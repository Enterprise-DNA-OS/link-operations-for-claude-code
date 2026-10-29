import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { parseCsv, pick } from './csv.mjs';
import { REPO_ROOT } from './db.mjs';

export const reads = {
 campaigns: 'select name,client,owner,status,opportunities,claimed_wins,current_live,overdue from campaign_desk order by name',
 contacts: 'select id,name,email,permission,permission_date,suppressed_at from contacts order by name',
 opportunities: 'select id,name,campaign,owner,milestone,next_due,eligible,quiet_days from opportunity_desk order by campaign,name',
 'follow-ups': "select name,campaign,owner,next_due,quiet_days from opportunity_desk where eligible and milestone not in ('won','lost','paused') and next_due<=current_date order by next_due,name",
 'permission-review': "select name,campaign,email,permission from opportunity_desk where not eligible and milestone not in ('lost','paused') order by name",
 'link-checks': "select name,campaign,page_url,state,observed_on,stale,qualification_gap from placement_desk order by name",
 'client-report': 'select name,client,opportunities,claimed_wins,current_live,overdue from campaign_desk order by name',
 attention: "select name,campaign,owner,milestone,next_due,quiet_days,eligible from opportunity_desk where milestone not in ('won','lost','paused') and (next_due is null or next_due<current_date or quiet_days>=14) order by next_due nulls first,name",
 compliance: 'select rule,name,finding from compliance_desk order by rule,name',
 history: 'select entity,record_id,action,actor,created_at from audit_log order by created_at,id',
};
export const questions = [
 ['Which overdue follow-ups have recorded permission?',reads['follow-ups']],
 ['Which active opportunities have unknown or withdrawn permission?',reads['permission-review']],
 ['Which claimed wins still lack a placement record?',"select o.name,c.name as campaign from opportunities o join campaigns c on c.id=o.campaign_id where o.milestone='won' and not exists(select 1 from placements p where p.opportunity_id=o.id) order by o.name"],
 ['Which paid or gifted placements lack a qualifying link attribute?',"select name,campaign,consideration,rel from placement_desk where qualification_gap order by name"],
 ['Which placements need a fresh observation?',"select name,campaign,observed_on from placement_desk where stale order by name"],
 ['Which campaigns report more wins than current live placements?',"select name,claimed_wins,current_live from campaign_desk where claimed_wins>current_live order by name"],
 ['Which owners have overdue work with unresolved permission?',"select owner,count(*) as blocked_overdue from opportunity_desk where not eligible and next_due<current_date and milestone not in ('won','lost','paused') group by owner order by owner"],
 ['Which placements are missing at the latest observation?',"select name,campaign,observed_on from placement_desk where state='missing' order by name"],
 ['Which publishers appear across several campaigns?',"select publisher_url,count(distinct campaign_id) as campaigns from opportunities group by publisher_url having count(distinct campaign_id)>1 order by publisher_url"],
 ['Which active opportunities have no next review date?',"select name,campaign,owner from opportunity_desk where next_due is null and milestone not in ('won','lost','paused') order by name"],
];
const required=(o,k)=>{if(typeof o[k]!=='string'||!o[k].trim())throw Error(`--${k} is required`);return o[k].trim();};
export function date(value) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw Error('Use a real YYYY-MM-DD date');
 return value;
}
function past(value){date(value);if(value>new Date().toISOString().slice(0,10))throw Error('Evidence dates cannot be in the future');return value;}
function url(value){let u;try{u=new URL(value);}catch{throw Error('Use an absolute http or https URL');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Use an http or https URL without credentials');return u.href;}
function email(value){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw Error('Invalid email');return value.toLowerCase();}
function choice(value,values){if(!values.includes(value))throw Error(`Expected ${values.join('|')}`);return value;}
export async function resolve(db,entity,term) {
 if(!['campaigns','contacts','opportunities','placements'].includes(entity))throw Error('Unknown entity');
 if(!term)throw Error(`Select a ${entity} record`);
 const exact=await db.query(`select * from ${entity} where id::text=$1 or lower(name)=lower($1)`,[term]);
 const rows=exact.length?exact:await db.query(`select * from ${entity} where starts_with(id::text,lower($1)) or strpos(lower(name),lower($1))>0 order by name,id`,[term]);
 if(rows.length!==1)throw Error(`${rows.length?'Ambiguous':'No'} ${entity} match: ${term}${rows.length?'\n'+rows.map(r=>`${r.id}  ${r.name}`).join('\n'):''}`);
 return rows[0];
}
export async function transaction(db,actor,fn,{dry=false}={}) {
 if(!actor?.trim())throw Error('--actor is required');
 await db.exec('BEGIN');
 try{await db.query("select set_config('links.actor',$1,true)",[actor]);const result=await fn();await db.exec(dry?'ROLLBACK':'COMMIT');return result;}
 catch(e){await db.exec('ROLLBACK');throw e;}
}
const safeWrite=(folder,name,content)=>{
 const dir=path.join(REPO_ROOT,folder);fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const file=path.join(dir,`${name}-${randomUUID()}.json`);fs.writeFileSync(file,JSON.stringify(content,null,2)+'\n',{mode:0o600,flag:'wx'});return file;
};

async function importPitchbox(db,args,o) {
 if(args[0]!=='pitchbox'||!args[1])throw Error('import pitchbox <csv> --campaign=<name> --actor=<name> [--map=<json>] [--dry-run]');
 const campaign=await resolve(db,'campaigns',required(o,'campaign'));
 if(campaign.status!=='active')throw Error('Campaign is closed');
 const map=o.map?JSON.parse(fs.readFileSync(o.map,'utf8')):{};
 const allowed=['name','url','milestone','source_key','owner'];
 for(const [k,v] of Object.entries(map)){if(!allowed.includes(k)||typeof v!=='string'||!v.trim())throw Error('Invalid column map');}
 const rows=parseCsv(fs.readFileSync(args[1],'utf8'));
 if(!rows.length)throw Error('No data rows in CSV');
 for(const v of Object.values(map))if(!Object.keys(rows[0]).includes(v))throw Error(`Mapped header missing: ${v}`);
 const value=(r,k,...aliases)=>map[k]?r[map[k]]:pick(r,...aliases);
 let added=0,skipped=0;
 return transaction(db,required(o,'actor'),async()=>{
  const seen=new Set();
  for(const [i,r] of rows.entries()){
   const publisher=url(value(r,'url','URL','Opportunity URL','Website'));
   const source=value(r,'source_key','Opportunity ID','ID')||publisher;
   if(seen.has(source))throw Error(`Duplicate source key on row ${i+2}`);seen.add(source);
   const name=value(r,'name','Name','Opportunity Name','Domain')||new URL(publisher).hostname;
   const rawMilestone=value(r,'milestone','Milestone','Status');
   // Preserve the vendor's label. Unknown or translated milestones need human review.
   const ms=String(rawMilestone).toLowerCase().trim();
   const milestone=({'won':'won','lost':'lost','not started':'prospect','prospect':'prospect','contacted':'contacted','replied':'reply','reply':'reply','paused':'paused'})[ms]||'review';
   const owner=value(r,'owner','Owner','Assigned To')||campaign.owner;
   const canonical=JSON.stringify(r);
   const old=await db.query('select * from opportunities where campaign_id=$1 and source_key=$2',[campaign.id,source]);
   if(old.length){
    const prior=old[0].source_data;
    if(JSON.stringify(Object.fromEntries(Object.entries(prior||{}).sort()))!==JSON.stringify(Object.fromEntries(Object.entries(r).sort())))throw Error(`Conflicting source record ${source}; reconcile it before retrying`);
    skipped++;continue;
   }
   await db.query('insert into opportunities(campaign_id,name,source_key,publisher_url,milestone,owner,source_data) values($1,$2,$3,$4,$5,$6,$7::jsonb)',[campaign.id,name,source,publisher,milestone,owner,canonical]);added++;
  }
  return [{added,skipped,dry_run:Boolean(o['dry-run']),permission:'Not imported; review and attach a contact separately'}];
 },{dry:Boolean(o['dry-run'])});
}

export async function run(db,cmd,args=[],o={}) {
 const options={
  'add-campaign':['name','client','owner','target','actor'],'close-campaign':['actor'],
  'add-contact':['name','email','actor'],permission:['evidence','date','actor'],suppress:['evidence','actor'],
  add:['campaign','name','url','owner','due','actor'],'attach-contact':['contact','actor'],
  plan:['due','owner','actor'],move:['milestone','actor'],log:['kind','note','date','actor'],
  'record-placement':['page','target','consideration','actor'],observe:['state','date','rel','evidence','actor'],
  import:['campaign','map','dry-run','actor'],'draft-follow-up':['sender','sender-contact']
 };
 for(const [k,v] of Object.entries(o)){
  if(k!=='json'&&!(options[cmd]||[]).includes(k))throw Error(`Unknown option --${k} for ${cmd}`);
  if(['json','dry-run'].includes(k)&&v!==true)throw Error(`--${k} takes no value`);
  if(!['json','dry-run'].includes(k)&&typeof v!=='string')throw Error(`--${k} needs a value`);
 }
 const needsOne=['opportunity','close-campaign','permission','suppress','attach-contact','plan','move','log','record-placement','observe','draft-follow-up','draft-client-report'];
 const expected=cmd==='import'?2:needsOne.includes(cmd)?1:0;
 if(args.length!==expected)throw Error(`${cmd} expects ${expected} positional argument(s)`);
 if(reads[cmd])return db.query(reads[cmd]);
 if(cmd==='insights'){const out=[];for(const [question,sql] of questions)out.push({question,rows:await db.query(sql)});return out;}
 if(cmd==='opportunity'){
  const r=await resolve(db,'opportunities',args[0]);
  return [{...r,activities:await db.query('select * from activities where opportunity_id=$1 order by occurred_on,created_at',[r.id])}];
 }
 if(cmd==='weekly-review'){
  const out=[];for(const section of ['attention','link-checks','compliance'])out.push({section,rows:await run(db,section)});return out;
 }
 if(cmd==='export'){
  await db.exec('BEGIN READ ONLY');
  try{const data={format:'link-operations-v1',exported_at:new Date().toISOString()};for(const t of ['campaigns','contacts','opportunities','activities','placements','observations','audit_log'])data[t]=await db.query(`select * from ${t} order by id`);return [{file:safeWrite('exports','archive',data)}];}
  finally{await db.exec('ROLLBACK');}
 }
 if(cmd==='draft-client-report'){
  const r=await resolve(db,'campaigns',args[0]);
  const report={draft:true,client:r.client,campaign:r.name,summary:await db.query('select * from campaign_desk where id=$1',[r.id]),placements:await db.query('select name,page_url,target_url,state,observed_on,stale,qualification_gap from placement_desk where campaign_id=$1 order by name',[r.id])};
  return [{file:safeWrite('drafts','client-report',report)}];
 }
 if(cmd==='draft-follow-up'){
  const r=await resolve(db,'opportunities',args[0]);
  const [record]=await db.query('select * from opportunity_desk where id=$1',[r.id]);
  if(!record.eligible||['won','lost','paused'].includes(record.milestone))throw Error('Opportunity is not eligible for a follow-up draft');
  const sender=required(o,'sender'),contact=required(o,'sender-contact');
  const draft={draft:true,to:record.email,from:sender,subject:`Follow-up: ${record.name}`,body:`Following up on ${record.name}. Reference: ${record.target_url}\n\n${sender}\n${contact}\nTo stop receiving messages, reply with unsubscribe.`,review:'Review the exact content and permission scope before sending. This tool never sends.'};
  return [{file:safeWrite('drafts','follow-up',draft)}];
 }
 if(cmd==='import')return importPitchbox(db,args,o);
 const mutations=['add-campaign','close-campaign','add-contact','permission','suppress','add','attach-contact','plan','move','log','record-placement','observe'];
 if(!mutations.includes(cmd))throw Error(`Unknown command ${cmd}. Use help.`);
 return transaction(db,required(o,'actor'),async()=>{
  if(cmd==='add-campaign')return db.query('insert into campaigns(name,client,owner,target_url) values($1,$2,$3,$4) returning id,name',[required(o,'name'),required(o,'client'),required(o,'owner'),url(required(o,'target'))]);
  if(cmd==='close-campaign'){const r=await resolve(db,'campaigns',args[0]);return db.query("update campaigns set status='closed' where id=$1 returning id,name,status",[r.id]);}
  if(cmd==='add-contact')return db.query('insert into contacts(name,email) values($1,$2) returning id,name,permission',[required(o,'name'),email(required(o,'email'))]);
  if(cmd==='permission'){
   const r=await resolve(db,'contacts',args[0]);
   if(r.suppressed_at)throw Error('Suppression cannot be removed by this base; retain the withdrawal and review a fresh permission workflow');
   return db.query("update contacts set permission='express',permission_evidence=$2,permission_date=$3 where id=$1 returning id,name,permission",[r.id,required(o,'evidence'),past(required(o,'date'))]);
  }
  if(cmd==='suppress'){const r=await resolve(db,'contacts',args[0]);return db.query("update contacts set permission='withdrawn',suppressed_at=coalesce(suppressed_at,now()),permission_evidence=$2 where id=$1 returning id,name,permission",[r.id,required(o,'evidence')]);}
  if(cmd==='add'){
   const c=await resolve(db,'campaigns',required(o,'campaign'));if(c.status!=='active')throw Error('Campaign is closed');
   return db.query('insert into opportunities(campaign_id,name,publisher_url,owner,next_due) values($1,$2,$3,$4,$5) returning id,name',[c.id,required(o,'name'),url(required(o,'url')),required(o,'owner'),o.due?date(o.due):null]);
  }
  if(cmd==='observe'){
   const p=await resolve(db,'placements',args[0]);
   const state=choice(required(o,'state'),['live','missing','unknown']);
   const rel=(o.rel||'').toLowerCase().split(/\s+/).filter(Boolean);for(const v of rel)choice(v,['nofollow','sponsored','ugc','noopener','noreferrer','external']);
   return db.query('insert into observations(placement_id,observed_on,state,rel,evidence,actor) values($1,$2,$3,$4,$5,$6) returning id,state,observed_on',[p.id,past(required(o,'date')),state,rel.join(' '),required(o,'evidence'),o.actor]);
  }
  const r=await resolve(db,'opportunities',args[0]);
  if(cmd==='attach-contact'){const c=await resolve(db,'contacts',required(o,'contact'));return db.query('update opportunities set contact_id=$2 where id=$1 returning id,name,contact_id',[r.id,c.id]);}
  if(cmd==='plan')return db.query('update opportunities set next_due=$2,owner=$3 where id=$1 returning id,name,next_due,owner',[r.id,date(required(o,'due')),required(o,'owner')]);
  if(cmd==='move')return db.query('update opportunities set milestone=$2 where id=$1 returning id,name,milestone',[r.id,choice(required(o,'milestone'),['prospect','review','contacted','reply','won','lost','paused'])]);
  if(cmd==='log'){
   const kind=choice(required(o,'kind'),['note','reply','follow-up','review']);const occurred=past(required(o,'date'));
   if(kind==='follow-up'){const [eligible]=await db.query('select eligible from opportunity_desk where id=$1',[r.id]);if(!eligible.eligible)throw Error('Follow-up is blocked by permission');}
   const rows=await db.query('insert into activities(opportunity_id,kind,note,occurred_on,actor) values($1,$2,$3,$4,$5) returning id,kind',[r.id,kind,required(o,'note'),occurred,o.actor]);
   await db.query('update opportunities set last_activity=greatest(last_activity,$2::date) where id=$1',[r.id,occurred]);return rows;
  }
  if(cmd==='record-placement')return db.query('insert into placements(opportunity_id,name,page_url,target_url,consideration) values($1,$2,$3,$4,$5) returning id,name',[r.id,r.name,url(required(o,'page')),url(required(o,'target')),choice(required(o,'consideration'),['none','paid','gifted','unknown'])]);
 });
}

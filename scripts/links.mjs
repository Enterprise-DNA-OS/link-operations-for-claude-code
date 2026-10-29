#!/usr/bin/env node
import { getDb } from './lib/db.mjs';
import { table } from './lib/format.mjs';
import { run, reads } from './lib/links.mjs';

const opts={},pos=[];
for(const a of process.argv.slice(2)){
 if(a.startsWith('--')){const i=a.indexOf('=');opts[a.slice(2,i<0?undefined:i)]=i<0?true:a.slice(i+1);}
 else pos.push(a);
}
const [cmd='help',...args]=pos;
if(cmd==='help'){
 console.log(`Link Operations for Claude Code\nRead: ${Object.keys(reads).join(', ')}, opportunity, insights, weekly-review\nWrite: add-campaign, close-campaign, add-contact, permission, suppress, add, attach-contact, plan, move, log, record-placement, observe\nFiles: import pitchbox <csv>, export, draft-follow-up, draft-client-report\nOptions use --key=value. Writes require --actor. See docs/cli.md.`);
}else{
 let db;
 try{db=await getDb();const rows=await run(db,cmd,args,opts);if(opts.json)console.log(JSON.stringify(rows,null,2));else if(['insights','weekly-review'].includes(cmd))for(const s of rows){console.log(`\n${s.question||s.section}`);console.log(render(s.rows));}else console.log(render(rows));}
 catch(e){console.error(opts.json?JSON.stringify({error:e.message}):e.message);process.exitCode=1;}
 finally{if(db)await db.close();}
}
function render(rows){if(!rows.length)return '  (none)';return table(rows,Object.keys(rows[0]).map(key=>({key,label:key,format:v=>v&&typeof v==='object'?JSON.stringify(v):v,width:100})));}

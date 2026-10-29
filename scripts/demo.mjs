import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from './lib/db.mjs';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'link-demo-'));
const env={...process.env,DATABASE_URL:'',DATA_DIR:path.join(temp,'db')};
try{
 for(const args of [['scripts/migrate.mjs'],['scripts/seed.mjs'],['scripts/links.mjs','follow-ups'],['scripts/links.mjs','link-checks'],['scripts/links.mjs','client-report']]){
  const p=spawnSync(process.execPath,args,{cwd:REPO_ROOT,env,encoding:'utf8'});
  process.stdout.write(p.stdout||'');if(p.status!==0)throw Error(p.stderr||p.error?.message||'Demo failed');
 }
 console.log('Demo complete. Fictional temporary database removed. Run migrate and seed separately for a persistent demo.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}

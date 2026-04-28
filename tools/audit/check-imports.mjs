import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const failures=[];
function walk(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name); if(e.isDirectory()) walk(p,out); else out.push(p)} return out;}
function candidates(base){return [base,base+'.js',base+'.css',base+'.html',path.join(base,'index.js')];}
function check(file,spec){if(!spec||!spec.startsWith('.')) return; const clean=spec.split('?')[0]; const base=path.resolve(path.dirname(file),clean); if(!candidates(base).some(fs.existsSync)) failures.push('Missing import target from '+path.relative(root,file)+' -> '+spec);}
function scanQuoted(line){const specs=[]; const re=/["']([^"']+)["']/g; let m; while((m=re.exec(line))) specs.push(m[1]); return specs;}
for(const file of walk(path.join(root,'src'))){if(!/\.(js|css|html)$/.test(file)) continue; const lines=fs.readFileSync(file,'utf8').split(/\r?\n/); for(const line of lines){ if(line.includes('import.meta.glob')) continue; if(line.includes('import')||line.includes('from')||line.includes('@import')) for(const s of scanQuoted(line)) check(file,s); }}
if(fs.existsSync(path.join(root,'src/shared'))) failures.push('Forbidden folder still exists: src/shared');
if(fs.existsSync(path.join(root,'src/ui/shared'))) failures.push('Forbidden folder still exists: src/ui/shared');
if(fs.existsSync(path.join(root,'LICENSE'))) failures.push('Forbidden file still exists: LICENSE');
if(failures.length){console.error(failures.join('\n')); process.exit(1)}
console.log('Import audit passed.'); process.exit(0);

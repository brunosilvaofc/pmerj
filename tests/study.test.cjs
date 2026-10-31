const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
// Compile only local TypeScript domain modules; no browser or network is needed.
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
};
const { contests, gradeGuard } = require('../app/lib/contests.ts');
const { emptyState, parseState, percent } = require('../app/lib/study.ts');
const topics = id => contests[id].subjects.flatMap(s=>s.groups.flatMap(g=>g.topics));
test('preserves PMERJ curriculum and stable legacy IDs', () => {
  assert.equal(topics('pmerj').length, 243);
  assert.equal(contests.pmerj.subjects.slice(0,6).flatMap(s=>s.groups.flatMap(g=>g.topics)).length,211);
  assert.equal(topics('pmerj')[0].id,'1.1.1');
});
test('guard curriculum covers five disciplines with unique isolated IDs', () => {
  assert.equal(contests.gmsg.subjects.length,5); assert.equal(topics('gmsg').length,121);
  const ids=topics('gmsg').map(t=>t.id); assert.equal(new Set(ids).size,121);
  assert.ok(ids.every(id=>!topics('pmerj').some(t=>t.id===id)));
});
test('weighted results distinguish questions from points', () => {
  assert.deepEqual(gradeGuard({'1':10,'2':10,'3':10,'4':15,'5':0}), {correct:45,points:60,zeroSubject:true,meetsMinimum:false});
  assert.deepEqual(gradeGuard({'1':15,'2':20,'3':15,'4':20,'5':10}), {correct:80,points:100,zeroSubject:false,meetsMinimum:true});
});
test('minimum is 50 points and no zero discipline', () => {
  assert.equal(gradeGuard({'1':10,'2':10,'3':10,'4':5,'5':10}).meetsMinimum,true);
  assert.equal(gradeGuard({'1':9,'2':10,'3':10,'4':5,'5':10}).meetsMinimum,false);
});
test('rejects invalid and fractional scores', () => {
  assert.throws(()=>gradeGuard({'1':16,'2':20,'3':15,'4':20,'5':10}));
  assert.throws(()=>gradeGuard({'1':1.5,'2':20,'3':15,'4':20,'5':10}));
  assert.throws(()=>gradeGuard({}));
});
test('accepts legacy backup and rejects inconsistent weighted backups', () => {
  assert.deepEqual(parseState(emptyState()),emptyState());
  const data=emptyState(); data.exams.push({id:'test',date:'2026-10-27',title:'Test',total:80,correct:80,errors:'',scores:{'1':15,'2':20,'3':15,'4':20,'5':10},points:100,template:'gmsg-2026'});
  assert.equal(parseState(data).exams[0].points,100);
  data.exams[0].points=80; assert.throws(()=>parseState(data));
  assert.throws(()=>parseState({})); assert.throws(()=>parseState({...emptyState(),goal:-1}));
});
test('progress handles empty and partial totals',()=>{assert.equal(percent(0,0),0);assert.equal(percent(1,121),1);assert.equal(percent(176,176),100);});
const { createSchedule, defaultSchedule, validateSchedule, timeBlocks } = require('../app/lib/schedule.ts');
test('schedule preserves topic order and inserts a review after every group',()=>{
 const config=defaultSchedule('2026-10-27'); const days=createSchedule('pmerj',config);
 assert.equal(days[0].date,'2026-10-27'); assert.equal(days[0].tasks[0].topicIds[0],'1.1.1');
 assert.equal(days.flatMap(d=>d.tasks).filter(t=>t.kind==='learn').length,211);
 assert.equal(days[6].tasks[0].kind,'review');
 assert.ok(days.every(d=>[1,2,3,4,5].includes(new Date(d.date+'T12:00:00Z').getUTCDay())));
});
test('schedule handles weekends, leap years and alternate pacing',()=>{
 const config={...defaultSchedule('2028-02-28'),weekdays:[2,6],topicsPerDay:3};
 const days=createSchedule('gmsg',config);assert.equal(days[0].date,'2028-02-29');
 assert.equal(days.flatMap(d=>d.tasks).filter(t=>t.kind==='learn').length,121);
 assert.ok(days.every(d=>d.tasks.length<=3));
 assert.equal(new Set(days.flatMap(d=>d.tasks).map(t=>t.id)).size,days.flatMap(d=>d.tasks).length);
});
test('schedule extra subjects and old backups remain compatible',()=>{
 const config={...defaultSchedule('2026-10-27'),includeExtra:true};
 assert.equal(createSchedule('pmerj',config).flatMap(d=>d.tasks).filter(t=>t.kind==='learn').length,243);
 assert.equal(parseState({...emptyState(),schedule:config}).schedule.start,'2026-10-27');
 assert.equal(parseState(emptyState()).schedule,undefined);
});
test('rejects invalid dates and schedules rather than looping',()=>{
 for(const patch of [{start:'2026-02-30'},{weekdays:[]},{weekdays:[8]},{weekdays:[1,1]},{minutes:0},{topicsPerDay:0},{exercises:100}]) assert.throws(()=>validateSchedule({...defaultSchedule('2026-10-27'),...patch}));
});
test('time blocks always add up to available study time',()=>{
 for(const minutes of [20,25,30,60,90,240]) assert.equal(timeBlocks(minutes).reduce((a,b)=>a+b,0),minutes);
});
test('deadline schedule fits every task within the inclusive selected period',()=>{
 for(const id of ['pmerj','gmsg']) {
 const config={...defaultSchedule('2028-02-28'),end:'2028-08-28',weekdays:[1,3,5]};
 const days=createSchedule(id,config),tasks=days.flatMap(d=>d.tasks);
 assert.ok(days.every(d=>d.date>=config.start&&d.date<=config.end&&[1,3,5].includes(new Date(d.date+'T12:00:00Z').getUTCDay())));
 assert.equal(tasks.filter(t=>t.kind==='learn').length,id==='pmerj'?211:121);
 assert.equal(new Set(tasks.map(t=>t.id)).size,tasks.length);
 assert.equal(days.reduce((n,d)=>n+d.minutes,0),tasks.reduce((n,t)=>n+(t.kind==='learn'?60:30),0));
 }
});
test('deadline rejects reversed, empty and impossible windows',()=>{
 for(const patch of [{end:'2026-10-26'},{end:'2026-10-27',weekdays:[1]},{end:'2040-01-01'},{end:'bad'}])assert.throws(()=>validateSchedule({...defaultSchedule('2026-10-27'),...patch}));
 assert.throws(()=>createSchedule('pmerj',{...defaultSchedule('2026-10-27'),end:'2026-10-27'}));
});
test('longer deadline reduces average load and keeps reviews ordered',()=>{
 const base=defaultSchedule('2026-10-27');
 const short=createSchedule('pmerj',{...base,end:'2027-01-27'}),long=createSchedule('pmerj',{...base,end:'2027-10-27'});
 const avg=days=>days.reduce((n,d)=>n+d.minutes,0)/days.length;
 assert.ok(avg(long)<avg(short));
 const seen=new Set();for(const task of long.flatMap(d=>d.tasks)){if(task.kind==='learn')seen.add(task.topicIds[0]);else assert.ok(task.topicIds.every(id=>seen.has(id)));}
});

const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,f);
const {trainingBank,diagnosticQuestions,latestErrors,learningStats}=require('../app/lib/training.ts');
const {emptyState,parseState}=require('../app/lib/study.ts');
const {contests}=require('../app/lib/contests.ts');
const attempt=(id,date,correct)=>({id,date,mode:'practice',answers:[{questionId:'q',lessonId:'l',correct}]});
test('review uses latest dated result and clears a corrected error',()=>{const wrong=attempt('1','2026-10-01T00:00:00Z',false),right=attempt('2','2026-10-02T00:00:00Z',true);assert.ok(latestErrors([wrong]).has('q'));assert.equal(latestErrors([right,wrong]).size,0);assert.ok(latestErrors([right,wrong,attempt('3','2026-10-03T00:00:00Z',false)]).has('q'));});
test('diagnostic covers every available discipline before repeating and never duplicates',()=>{for(const id of ['pmerj','gmsg']){const bank=trainingBank(id),round=diagnosticQuestions(bank,10),subjects=new Set(bank.map(q=>q.subjectId));assert.equal(new Set(round.slice(0,subjects.size).map(q=>q.subjectId)).size,subjects.size);assert.equal(new Set(round.map(q=>q.id)).size,round.length);assert.equal(diagnosticQuestions(bank,10000).length,bank.length);}});
test('all question links resolve to existing topics and options are valid',()=>{for(const id of ['pmerj','gmsg']){const bank=trainingBank(id);assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);const topics=contests[id].subjects.flatMap(s=>s.groups.flatMap(g=>g.topics));for(const q of bank){assert.ok(topics.some(t=>t.id===q.topicId));assert.ok(q.correct>=0&&q.correct<q.options.length);assert.equal(new Set(q.options).size,q.options.length);}}});
test('old backups remain valid; malformed attempts are rejected',()=>{assert.doesNotThrow(()=>parseState(emptyState()));const a=attempt('1','2026-10-01T00:00:00Z',true);assert.doesNotThrow(()=>parseState({...emptyState(),attempts:[a]}));assert.throws(()=>parseState({...emptyState(),attempts:[{...a,date:'bad'}]}));assert.throws(()=>parseState({...emptyState(),attempts:[{...a,answers:[{questionId:'q',lessonId:'l',correct:'yes'}]}]}));});
test('stats count repeat answers separately and distinct questions once',()=>{const stats=learningStats([{id:'q',lessonId:'l',lessonTitle:'Aula',topicId:'t'}],[attempt('1','2026-10-01T00:00:00Z',false),attempt('2','2026-10-02T00:00:00Z',true)]);assert.equal(stats[0].total,2);assert.equal(stats[0].correct,1);assert.equal(stats[0].unique,1);});

test('every worked example explains the objective, setup, actions and a comprehension check',()=>{
 const {lessons}=require('../app/lib/lessons/index.ts');
 for(const l of lessons)for(const e of l.examples){
  assert.ok(e.goal.length>20,`${l.id}: goal`);
  assert.ok(e.start.length>40,`${l.id}: setup`);
  assert.ok(e.steps.length>=5,`${l.id}: missing explanatory actions`);
  assert.ok(e.steps.every(s=>s.length>35),`${l.id}: terse action`);
  assert.ok(e.checkpoint.prompt.endsWith('?'),`${l.id}: check question`);
  assert.ok(e.checkpoint.answer.length>30,`${l.id}: check explanation`);
 }
});
test('every correction addresses a question in multiple steps and keeps its authored answer',()=>{
 const {lessons}=require('../app/lib/lessons/index.ts');
 for(const file of ['math','language','law','special','computing'])for(const authored of require(`../app/lib/lessons/${file}.json`)){
  const rendered=lessons.find(l=>l.id===authored.id);
  for(const q of authored.questions){
   assert.ok(q.explanation.length>=4,q.id);
   assert.ok(q.explanation.every(s=>s.trim().length>0),q.id);
   const rotated=rendered.questions.find(x=>x.id===q.id);
   assert.equal(rotated.options[rotated.correct],q.options[q.correct],q.id);
   assert.ok(['foundation','application'].includes(q.difficulty));
  }
 }
});
test('ECA correction explains integral protection rather than the unrelated age example',()=>{
 const q=require('../app/lib/lessons/special.json').find(l=>l.id==='eca').questions[0];
 assert.match(q.explanation.join(' '),/Proteção integral/);
 assert.doesNotMatch(q.explanation.join(' '),/ainda não completou 12/);
});
test('explicit question difficulty does not change when the explanation grows',()=>{
 const bank=trainingBank('pmerj');
 assert.equal(bank.find(q=>q.id==='2.1.1-q1').difficulty,'foundation');
 assert.equal(bank.find(q=>q.id==='2.2.2-q1').difficulty,'application');
});

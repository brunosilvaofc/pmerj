import {contests,type ContestId} from './contests';
import {lessonFor,type Question} from './lessons';
import type {QuestionAttempt} from './study';
export type TrainingQuestion=Question&{lessonId:string;lessonTitle:string;subjectId:string;topicId:string;difficulty:'foundation'|'application'};
export function trainingBank(contest:ContestId):TrainingQuestion[]{
 const seen=new Set<string>();const result:TrainingQuestion[]=[];
 for(const subject of contests[contest].subjects){if(contest==='pmerj'&&subject.id==='7')continue;for(const group of subject.groups)for(const topic of group.topics){const lesson=lessonFor(contest,subject.id,topic.id,topic.title);if(!lesson)continue;for(const q of lesson.questions){if(seen.has(q.id))continue;seen.add(q.id);result.push({...q,lessonId:lesson.id,lessonTitle:lesson.title,subjectId:subject.id,topicId:topic.id,difficulty:q.difficulty??'foundation'});}}}
 return result;
}
export function latestErrors(attempts:QuestionAttempt[]){const latest=new Map<string,boolean>();for(const a of [...attempts].sort((a,b)=>a.date.localeCompare(b.date)))for(const x of a.answers)latest.set(x.questionId,x.correct);return new Set([...latest].filter(([,correct])=>!correct).map(([id])=>id));}
export function learningStats(bank:TrainingQuestion[],attempts:QuestionAttempt[]){return [...new Set(bank.map(q=>q.lessonId))].map(id=>{const q=bank.find(q=>q.lessonId===id)!;const answers=attempts.flatMap(a=>a.answers).filter(a=>a.lessonId===id);return {id,title:q.lessonTitle,topicId:q.topicId,total:answers.length,correct:answers.filter(a=>a.correct).length,unique:new Set(answers.map(a=>a.questionId)).size};});}
export function diagnosticQuestions(bank:TrainingQuestion[],limit=10){const groups=[...new Set(bank.map(q=>q.subjectId))].map(id=>bank.filter(q=>q.subjectId===id));const selected:TrainingQuestion[]=[];for(let i=0;selected.length<limit&&groups.some(g=>g[i]);i++)for(const group of groups){if(group[i]&&selected.length<limit)selected.push(group[i]);}return selected;}

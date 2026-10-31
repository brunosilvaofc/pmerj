import { contests, type ContestId } from './contests';
export type ScheduleConfig = { start: string; end?: string; weekdays: number[]; minutes: number; topicsPerDay: number; exercises: number; includeExtra: boolean; done: string[] };
export type ScheduleTask = { id: string; title: string; subjectId: string; subject: string; group: string; kind: 'learn' | 'review'; topicIds: string[] };
export type ScheduleDay = { date: string; tasks: ScheduleTask[]; minutes: number };
export function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}
export function validateSchedule(value: unknown): ScheduleConfig {
  const s = value as ScheduleConfig;
  if (!s || !validDate(s.start) || !Array.isArray(s.weekdays) || !s.weekdays.length || s.weekdays.length > 7 || new Set(s.weekdays).size !== s.weekdays.length || !s.weekdays.every(d=>Number.isInteger(d)&&d>=0&&d<=6) || !Number.isInteger(s.minutes) || s.minutes<20 || s.minutes>240 || !Number.isInteger(s.topicsPerDay) || s.topicsPerDay<1 || s.topicsPerDay>3 || !Number.isInteger(s.exercises) || s.exercises<1 || s.exercises>50 || typeof s.includeExtra!=='boolean' || !Array.isArray(s.done) || !s.done.every(id=>typeof id==='string'&&id.length<300)) throw new Error('Cronograma inválido.');
  if (s.end !== undefined) {
    if (!validDate(s.end) || s.end < s.start) throw new Error('A data final deve ser igual ou posterior ao início.');
    if ((Date.parse(s.end)-Date.parse(s.start))/86400000 > 1826) throw new Error('Escolha um período de até cinco anos.');
    if (!availableDates(s).length) throw new Error('O período não contém nenhum dos dias da semana selecionados.');
  }
  return s;
}
export function defaultSchedule(start: string): ScheduleConfig { return { start, weekdays:[1,2,3,4,5], minutes:60, topicsPerDay:1, exercises:5, includeExtra:false, done:[] }; }
export function createSchedule(contestId: ContestId, config: ScheduleConfig): ScheduleDay[] {
  validateSchedule(config);
  const contest=contests[contestId];
  const subjects=contest.subjects.slice(0, config.includeExtra?undefined:contest.mainSubjectCount);
  const sessions: ScheduleTask[][]=[];
  for(const subject of subjects) {
    for(const group of subject.groups) {
      const topics=group.topics.map(t=>({ id:`learn:${t.id}`, title:t.title, subjectId:subject.id, subject:subject.title, group:group.title, kind:'learn' as const, topicIds:[t.id] }));
      for(let i=0;i<topics.length;i+=config.topicsPerDay) sessions.push(topics.slice(i,i+config.topicsPerDay));
      sessions.push([{id:`review:${subject.id}:${group.id}`,title:`Revisão: ${group.title}`,subjectId:subject.id,subject:subject.title,group:group.title,kind:'review',topicIds:group.topics.map(t=>t.id)}]);
    }
  }
  if(config.end) {
    const dates=availableDates(config), tasks=sessions.flat();
    const count=Math.min(dates.length,tasks.length);
    const result:ScheduleDay[]=Array.from({length:count},(_,i)=>({date:dates[Math.floor(i*dates.length/count)],tasks:[],minutes:0}));
    let cursor=0,remaining=tasks.reduce((n,t)=>n+taskMinutes(t),0);
    for(let i=0;i<count;i++) {
      const target=remaining/(count-i);
      do { const task=tasks[cursor++]; result[i].tasks.push(task); result[i].minutes+=taskMinutes(task); }
      while(cursor<tasks.length-(count-i-1) && (i===count-1 || result[i].minutes+taskMinutes(tasks[cursor])/2<=target));
      remaining-=result[i].minutes;
    }
    if(result.some(d=>d.minutes>1440)) throw new Error('O prazo exige mais de 24 horas de estudo em um dia. Amplie o período ou selecione mais dias.');
    return result;
  }
  const result:ScheduleDay[]=[];
  const date=new Date(`${config.start}T12:00:00Z`);
  for(const tasks of sessions) {
    while(!config.weekdays.includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate()+1);
    result.push({date:date.toISOString().slice(0,10),tasks,minutes:config.minutes});
    date.setUTCDate(date.getUTCDate()+1);
  }
  return result;
}
export function timeBlocks(minutes:number) { const recall=Math.round(minutes*.1),theory=Math.round(minutes*.35),practice=Math.round(minutes*.4); return [recall,theory,practice,minutes-recall-theory-practice]; }

function taskMinutes(task:ScheduleTask) { return task.kind==='learn'?60:30; }
export function availableDates(config:ScheduleConfig):string[] {
 const result:string[]=[]; const date=new Date(`${config.start}T12:00:00Z`);
 for(let i=0;i<=1826;i++) { const value=date.toISOString().slice(0,10); if(!config.end || value>config.end) break; if(config.weekdays.includes(date.getUTCDay())) result.push(value); date.setUTCDate(date.getUTCDate()+1); }
 return result;
}
export function suggestedEnd(start:string) { const d=new Date(`${start}T12:00:00Z`); d.setUTCDate(d.getUTCDate()+180); return d.toISOString().slice(0,10); }

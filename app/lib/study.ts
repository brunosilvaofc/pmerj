import { validateSchedule, type ScheduleConfig } from './schedule';
import { gradeGuard } from './contests';
export type StudySession = { id: string; date: string; minutes: number; subject: string };
export type Exam = { id: string; date: string; title: string; correct: number; total: number; errors: string; scores?: Record<string, number>; points?: number; template?: 'gmsg-2026' | 'practice' };
export type QuestionAttempt = { id:string; date:string; mode:'practice'|'diagnostic'|'review'; answers:{questionId:string;lessonId:string;correct:boolean}[] };
export type StudyState = { completed: Record<string, string>; notes: Record<string, string>; sessions: StudySession[]; exams: Exam[]; goal: number; attempts?: QuestionAttempt[]; schedule?: ScheduleConfig };
export const emptyState = (): StudyState => ({ completed: {}, notes: {}, sessions: [], exams: [], goal: 60 });
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const percent = (done: number, total: number) => total ? Math.round(done / total * 100) : 0;
export function parseState(value: unknown): StudyState {
  if (!value || typeof value !== 'object') throw new Error('Dados de estudo inválidos.');
  const s = value as StudyState;
  if (!s.completed || typeof s.completed !== 'object' || Array.isArray(s.completed) || !Object.values(s.completed).every(v=>typeof v==='string') || !s.notes || typeof s.notes!=='object' || Array.isArray(s.notes) || !Object.values(s.notes).every(v=>typeof v==='string') || !Array.isArray(s.sessions) || !s.sessions.every(v=>v && typeof v.id==='string' && typeof v.date==='string' && typeof v.subject==='string' && Number.isFinite(v.minutes) && v.minutes>0) || !Array.isArray(s.exams) || !s.exams.every(v=>v && typeof v.id==='string' && typeof v.title==='string' && typeof v.date==='string' && typeof v.errors==='string' && Number.isInteger(v.correct) && Number.isInteger(v.total) && v.total>0 && v.correct>=0 && v.correct<=v.total) || !Number.isFinite(s.goal) || s.goal<10 || s.goal>480) throw new Error('Formato de dados inválido.');
  for (const exam of s.exams) {
    if (exam.template === 'gmsg-2026') {
      const result = gradeGuard(exam.scores ?? {});
      if (exam.total !== 80 || exam.correct !== result.correct || exam.points !== result.points) throw new Error('Resultado ponderado inconsistente.');
    }
  }
  if(s.attempts!==undefined&&(!Array.isArray(s.attempts)||!s.attempts.every(a=>a&&typeof a.id==='string'&&typeof a.date==='string'&&Number.isFinite(Date.parse(a.date))&&['practice','diagnostic','review'].includes(a.mode)&&Array.isArray(a.answers)&&a.answers.length>0&&a.answers.every(x=>x&&typeof x.questionId==='string'&&typeof x.lessonId==='string'&&typeof x.correct==='boolean'))))throw new Error('Histórico de questões inválido.');
  if (s.schedule !== undefined) validateSchedule(s.schedule);
  return s;
}

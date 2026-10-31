import { subjects as pmerjSubjects } from './curriculum';
import { guardSubjects } from './guard-curriculum';
export type ContestId = 'pmerj' | 'gmsg';
export const contests = {
  pmerj: { id: 'pmerj', name: 'Soldado PMERJ', shortName: 'PMERJ', label: 'PREPARAÇÃO PMERJ', reference: 'PMERJ 2024', subjects: pmerjSubjects, mainSubjectCount: 6, questionCount: 50, sourceNote: 'Base: edital de Soldado nº 001/2023, versão retificada em 13/02/2025, Anexo II, e prova FGV de 2024. Complementos históricos de 2014 são opcionais. Confira novas publicações na organizadora.' },
  gmsg: { id: 'gmsg', name: 'Guarda de São Gonçalo', shortName: 'Guarda SG', label: 'GUARDA MUNICIPAL · SÃO GONÇALO', reference: 'GMSG · EDITAL 2026', subjects: guardSubjects, mainSubjectCount: 5, questionCount: 80, sourceNote: 'Base: edital enviado nº 001/PMSG/2026, Anexo III (páginas 49–51). A prova anterior enviada serve para praticar; o edital de 2026 orienta o conteúdo. Confira eventuais retificações na organizadora.' },
} as const;
export const guardSections = [
  { id: '1', title: 'Língua Portuguesa', questions: 15, weight: 1, range: '01–15' },
  { id: '2', title: 'Noções de Direito', questions: 20, weight: 1, range: '16–35' },
  { id: '3', title: 'Legislação Extravagante', questions: 15, weight: 1, range: '36–50' },
  { id: '4', title: 'Conhecimentos Específicos', questions: 20, weight: 2, range: '51–70' },
  { id: '5', title: 'Informática', questions: 10, weight: 1, range: '71–80' },
];
export function gradeGuard(scores: Record<string, number>) {
  if (guardSections.some(s => !Number.isInteger(scores[s.id]) || scores[s.id] < 0 || scores[s.id] > s.questions)) throw new Error('Acertos por disciplina inválidos.');
  const correct = guardSections.reduce((n,s) => n + scores[s.id], 0);
  const points = guardSections.reduce((n,s) => n + scores[s.id] * s.weight, 0);
  const zeroSubject = guardSections.some(s => scores[s.id] === 0);
  return { correct, points, zeroSubject, meetsMinimum: points >= 50 && !zeroSubject };
}

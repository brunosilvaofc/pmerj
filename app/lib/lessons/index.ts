import math from './math.json';
import language from './language.json';
import law from './law.json';
import special from './special.json';
import computing from './computing.json';
import { contests, type ContestId } from '../contests';
export type Question = {id:string;prompt:string;options:string[];correct:number;explanation:string[];difficulty?:'foundation'|'application'};
export type WorkedExample = {question:string;goal:string;start:string;steps:string[];checkpoint:{prompt:string;answer:string}};
export type Lesson = {id:string;title:string;scope:string;sections:{title:string;paragraphs:string[]}[];examples:WorkedExample[];questions:Question[];mistakes:string[];mastery:string[];sources:{label:string;url:string}[]};
// Rotate alternatives deterministically so the correct answer is not always A.
function rotate(q:Question):Question {const n=[...q.id].reduce((a,c)=>a+c.charCodeAt(0),0)%q.options.length;return {...q,options:[...q.options.slice(n),...q.options.slice(0,n)],correct:(q.correct-n+q.options.length)%q.options.length};}
export const lessons:Lesson[]=[...math,...language,...law,...special,...computing].map(l=>({...l,questions:l.questions.map(q=>rotate(q as Question))}));
const catalog=new Map(lessons.map(l=>[l.id,l]));
export function lessonFor(contest:ContestId,subjectId:string,topicId:string,title:string):Lesson|undefined {
 if(contest==='pmerj'&&subjectId==='2')return catalog.get(topicId);
 if(subjectId==='1') {
  if(/correspondência|oficial|formalidade|formato do texto|tipo de documento/.test(title))return catalog.get('pt-oficial');
  if(/Concordância/i.test(title))return catalog.get('pt-concordancia');
  if(/Regência|Crase|pronominal|pronomes átonos/i.test(title))return catalog.get('pt-regencia');
  if(/transitivos/i.test(title))return catalog.get('pt-sintaxe');
  if(/Verbos|verbais|gerúndio|particípio|tempos e modos/i.test(title))return catalog.get('pt-verbos');
  if(/Alfabeto|sílab|tonicidade|Monossíl|Acentuação|Ortografia|acentuação|ortografia/.test(title))return catalog.get('pt-fonologia');
  if(/Substantiv|Artigos|adjetivos|Numerais|pronomes|Advérbios|classes de palavras/i.test(title))return catalog.get('pt-classes');
  if(/coorden|subordin|Período simples|pontuação|Pontuação/.test(title))return catalog.get('pt-periodo');
  if(/Sujeito|predicado|transitivos|Objeto|Complemento|Predicativo|Frase|morfossintática/i.test(title))return catalog.get('pt-sintaxe');
  return catalog.get('pt-texto');
 }
 if(contest==='pmerj'&&subjectId==='6')return catalog.get('redacao');
 if((contest==='gmsg'&&subjectId==='5')||(contest==='pmerj'&&topicId.startsWith('7.4.'))){
  if(/Excel|Calc|células|fórmulas|Funções/i.test(title))return catalog.get('pc-planilha');
  if(/Word|Writer/i.test(title))return catalog.get('pc-texto');
  if(/PowerPoint|Impress|multimídia|áudio|vídeo|Imagens|figuras/i.test(title))return catalog.get('pc-apresentacao');
  if(/Segurança|proteção|ameaças|backup|Vírus|Criptografia/i.test(title))return catalog.get('pc-seguranca');
  if(/Redes|sinal|Protocolos|Internet|Navega|busca|Colaboração|discussão/i.test(title))return catalog.get('pc-redes');
  return catalog.get('pc-sistema');
 }
 if(/1\.416|1\.625|443\/|Hierarquia e disciplina militares|Licenças e afastamentos|Situações funcionais|Exclusão do serviço|Direitos, deveres e prerrogativas|9\.537|279\/1979|3\.527|667\/1969|14\.133|10\.741|8\.078|13\.146/.test(title))return undefined;
 if(/tortura/i.test(title))return catalog.get('tortura');
 if(/migrant|Refugiad/i.test(title))return catalog.get('migracao');
 if(/menor potencial|Uso proporcional/i.test(title))return catalog.get('forca');
 if(/hediondos/i.test(title))return catalog.get('hediondos');
 if(/Abuso de autoridade/i.test(title))return catalog.get('abuso');
 if(/ECA|Criança|Adolescente/i.test(title))return catalog.get('eca');
 if(/Desarmamento/i.test(title))return catalog.get('armas');
 if(/ambientais|meio ambiente/i.test(title))return catalog.get('ambiental');
 if(/Maria da Penha/i.test(title))return catalog.get('maria');
 if(/Drogas/i.test(title))return catalog.get('drogas');
 if(/Organizações criminosas|Lavagem/i.test(title))return catalog.get('organizacao');
 if(/CTB|Trânsito/i.test(title)||topicId.startsWith('7.5.'))return catalog.get('transito');
 if(contest==='gmsg'&&subjectId==='4'&&topicId.startsWith('gm.4.1.'))return catalog.get('guardas');
 if(contest==='pmerj'&&subjectId==='3')return catalog.get(/3\.3\./.test(topicId)?'constitucional':'dh');
 if(contest==='pmerj'&&subjectId==='7')return undefined;
 if(contest==='gmsg'&&topicId.startsWith('gm.2.1.'))return catalog.get('constitucional');
 if((contest==='pmerj'&&subjectId==='4')||(contest==='gmsg'&&topicId.startsWith('gm.2.5.'))){
  if(/Regime constitucional|Constituição Estadual/.test(title))return catalog.get('constitucional');
  if(/atos|ato administrativo|ato |Imperatividade|Exigibilidade|legitimidade|vinculados|discricionários|Anulação|revogação|Convalidação/i.test(title))return catalog.get('atos');
  if(/Poder|abuso|desvio/i.test(title))return catalog.get('poderes');
  if(/agente|servidor|Responsabilidade|Conduta|Processo|PAD|Improbidade|Estabilidade|remuneração|concurso|provimento/i.test(title))return catalog.get('agentes');
  return catalog.get('administracao');
 }
 if((contest==='pmerj'&&subjectId==='5')||(contest==='gmsg'&&subjectId==='2')){
  if(topicId.startsWith('5.5.')||topicId.startsWith('gm.2.4.')||/Juizados|prova|Prova|cadeia|Juiz,|cautelares|liberdade provisória/.test(title))return catalog.get('processo');
  if(/Imputabilidade|inimputabilidade|Embriaguez|agravantes|atenuantes|Regimes|cumprimento de pena|Penas restritivas/i.test(title))return catalog.get('penal-penas');
  if(/consumado|tentado|Consumação|tentativa|Desistência|arrependimento|defesa|necessidade|cumprimento de dever|Exercício regular/i.test(title))return catalog.get('penal-execucao');
  if(topicId.startsWith('5.4.')||topicId.startsWith('gm.2.3.')||/Crimes contra/i.test(title))return catalog.get('penal-crimes');
  return catalog.get('penal-base');
 }
 return undefined;
}
export function contestLessons(contest:ContestId,subject?:string){const unique=new Map<string,Lesson>();for(const s of contests[contest].subjects){if(subject&&s.id!==subject)continue;if(contest==='pmerj'&&s.id==='7')continue;for(const g of s.groups)for(const t of g.topics){const lesson=lessonFor(contest,s.id,t.id,t.title);if(lesson)unique.set(lesson.id,lesson);}}return [...unique.values()];}
export function questionBank(contest:ContestId,subject?:string){return contestLessons(contest,subject).flatMap(l=>l.questions.map(q=>({...q,lessonTitle:l.title})));}

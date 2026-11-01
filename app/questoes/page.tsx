"use client";
import { ThemeSelector } from '../components/theme-selector';
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { contests, type ContestId } from "../lib/contests";
import {
  trainingBank,
  diagnosticQuestions,
  latestErrors,
  learningStats,
  type TrainingQuestion,
} from "../lib/training";
import { useStudy } from "../lib/use-study";
import { supabase } from "../lib/supabase";
import { GuidedSteps } from "../components/guided-walkthrough";
import type { QuestionAttempt } from "../lib/study";
export default function Page() {
  return (
    <Suspense
      fallback={<main className="lesson-page"><div className="page-theme"><ThemeSelector /></div>Carregando…</main>}
    >
      <Route />
    </Suspense>
  );
}
function Route() {
  const params = useSearchParams();
  const [contest, setContest] = useState<ContestId>(
    params.get("concurso") === "gmsg" ? "gmsg" : "pmerj",
  );
  return (
    <main className="lesson-page"><div className="page-theme"><ThemeSelector /></div>
      <Link className="button secondary" href="/">
        ← Voltar ao plano
      </Link>
      <header className="page-heading">
        <div>
          <span className="eyebrow green-text">
            ENTENDA · PRATIQUE · REVISE
          </span>
          <h1>Seu treino, com direção.</h1>
          <p>
            Questões autorais, explicações passo a passo e evolução por assunto.
          </p>
        </div>
      </header>
      <label className="field">
        Concurso
        <select
          value={contest}
          onChange={(e) => {
            if (
              window.confirm(
                "Trocar de concurso? Uma rodada em andamento ou ainda não salva será descartada.",
              )
            )
              setContest(e.target.value as ContestId);
          }}
        >
          <option value="pmerj">Soldado PMERJ</option>
          <option value="gmsg">Guarda de São Gonçalo</option>
        </select>
      </label>
      <Bank key={contest} contest={contest} />
    </main>
  );
}
function Bank({ contest }: { contest: ContestId }) {
  const { state, user, ready, busy, error, save } = useStudy(contest);
  // A different authenticated account receives a fresh workspace, never an old user's unsaved round.
  return (
    <Training
      key={`${contest}-${user?.id ?? "local"}`}
      contest={contest}
      state={state}
      ready={ready}
      busy={busy}
      error={error}
      save={save}
      canSave={ready && (!supabase || !!user)}
    />
  );
}
function Training({
  contest,
  state,
  ready,
  busy,
  error,
  save,
  canSave,
}: {
  contest: ContestId;
  state: ReturnType<typeof useStudy>["state"];
  ready: boolean;
  busy: boolean;
  error: string;
  save: ReturnType<typeof useStudy>["save"];
  canSave: boolean;
}) {
  const bank = trainingBank(contest),
    attempts = state.attempts ?? [],
    errors = latestErrors(attempts),
    stats = learningStats(bank, attempts);
  const [subject, setSubject] = useState(""),
    [lesson, setLesson] = useState(""),
    [difficulty, setDifficulty] = useState(""),
    [mode, setMode] = useState<QuestionAttempt["mode"]>("practice"),
    [count, setCount] = useState(10);
  const [round, setRound] = useState<TrainingQuestion[]>([]),
    [answers, setAnswers] = useState<number[]>([]),
    [choice, setChoice] = useState<number | null>(null),
    [checked, setChecked] = useState(false),
    [index, setIndex] = useState(0),
    [saved, setSaved] = useState(false),
    [roundId, setRoundId] = useState(""),
    [roundDate, setRoundDate] = useState("");
  const filtered = bank.filter(
    (q) =>
      (!subject || q.subjectId === subject) &&
      (!lesson || q.lessonId === lesson) &&
      (!difficulty || q.difficulty === difficulty) &&
      (mode !== "review" || errors.has(q.id)),
  );
  const available = mode === "diagnostic" ? bank : filtered;
  const finished = round.length > 0 && index === round.length;
  const unsaved = round.length > 0 && !saved;
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (unsaved) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [unsaved]);
  const q = round[index];
  const answered = attempts.flatMap((a) => a.answers),
    correct = answered.filter((a) => a.correct).length;
  const recommended = stats
    .filter((s) => s.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  // Randomization runs only in the Start button event, never during rendering.
  function start() {
    const shuffled = [...available];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity -- Called by the Start button event.
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRound(
      mode === "diagnostic"
        ? diagnosticQuestions(shuffled, Math.min(count, bank.length))
        : shuffled.slice(0, Math.min(count, available.length)),
    );
    setIndex(0);
    setAnswers([]);
    setChoice(null);
    setChecked(false);
    setSaved(false);
    setRoundId(crypto.randomUUID());
    setRoundDate(new Date().toISOString());
  }
  async function persist() {
    const attempt: QuestionAttempt = {
      id: roundId,
      date: roundDate,
      mode,
      answers: round.map((q, i) => ({
        questionId: q.id,
        lessonId: q.lessonId,
        correct: answers[i] === q.correct,
      })),
    };
    if (
      await save({
        ...state,
        attempts: [...attempts.filter((a) => a.id !== roundId), attempt],
      })
    )
      setSaved(true);
  }
  return (
    <>
      <div className="training-metrics">
        <article>
          <strong>{bank.length}</strong>
          <span>questões disponíveis</span>
        </article>
        <article>
          <strong>
            {answered.length
              ? Math.round((100 * correct) / answered.length) + "%"
              : "—"}
          </strong>
          <span>acertos nas rodadas salvas</span>
        </article>
        <article>
          <strong>{errors.size}</strong>
          <span>questões para revisar</span>
        </article>
        <article>
          <strong>{attempts.length}</strong>
          <span>rodadas salvas</span>
        </article>
      </div>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      {!ready && <p role="status">Carregando seu histórico…</p>}
      {ready && !canSave && (
        <p className="notice">
          <Link href="/login">Entre na sua conta</Link> para guardar o
          histórico. Você pode experimentar as questões sem salvar.
        </p>
      )}
      {!round.length ? (
        <section className="panel lesson-content">
          <div className="training-tabs" aria-label="Tipo de treino">
            {(
              [
                ["practice", "Treino livre"],
                ["diagnostic", "Diagnóstico inicial"],
                ["review", "Revisar erros"],
              ] as const
            ).map(([id, title]) => (
              <button
                className={`button ${mode === id ? "dark" : "secondary"}`}
                key={id}
                onClick={() => setMode(id)}
                aria-pressed={mode === id}
              >
                {title}
              </button>
            ))}
          </div>
          <h2>
            {mode === "diagnostic"
              ? "Descubra por onde começar"
              : mode === "review"
                ? "Transforme os erros em aprendizado"
                : "Monte sua sessão"}
          </h2>
          <p>
            {mode === "diagnostic"
              ? "A seleção alterna entre as disciplinas com questões disponíveis. É uma amostra de estudo, sem pesos oficiais ou promessa de prever sua nota."
              : mode === "review"
                ? "Aqui entram as questões cuja resposta mais recente salva foi incorreta. Um novo acerto salvo retira a questão desta lista."
                : "Escolha o conteúdo e pratique no seu ritmo. Cada correção explica o raciocínio e aponta a aula."}
          </p>
          {mode !== "diagnostic" && (
            <div className="practice-controls">
              <label className="field">
                Disciplina
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setLesson("");
                  }}
                >
                  <option value="">Todas</option>
                  {contests[contest].subjects
                    .filter((s) => bank.some((q) => q.subjectId === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="field">
                Assunto
                <select
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                >
                  <option value="">Todos</option>
                  {[
                    ...new Map(
                      bank
                        .filter((q) => !subject || q.subjectId === subject)
                        .map((q) => [q.lessonId, q]),
                    ).values(),
                  ].map((q) => (
                    <option key={q.lessonId} value={q.lessonId}>
                      {q.lessonTitle}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Nível estimado
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="foundation">Fundamentos</option>
                  <option value="application">Aplicação em etapas</option>
                </select>
              </label>
            </div>
          )}
          <p className="schedule-footnote">
            O nível é uma indicação pedagógica inicial do tipo de tarefa, não
            uma dificuldade calibrada por banca. As questões não são cópias de
            provas oficiais.
          </p>
          <div className="practice-controls">
            <label className="field">
              Quantidade
              <input
                type="number"
                min={1}
                max={Math.max(1, available.length)}
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.max(
                      1,
                      Math.min(
                        available.length || 1,
                        Number(e.target.value) || 1,
                      ),
                    ),
                  )
                }
              />
            </label>
            <span>
              {available.length} disponíveis · rodada com{" "}
              {Math.min(count, available.length)}
            </span>
            <button
              className="button dark"
              disabled={!available.length || !ready}
              onClick={() => start()}
            >
              Começar {mode === "diagnostic" ? "diagnóstico" : "treino"}
            </button>
          </div>
          {!available.length && (
            <p role="status">
              Nenhuma questão neste recorte. Ajuste os filtros ou faça um treino
              livre.
            </p>
          )}
          {recommended && (
            <div className="notice">
              <b>Sugestão de revisão: {recommended.title}</b>
              <p>
                É o menor percentual entre os assuntos respondidos:{" "}
                {recommended.correct}/{recommended.total}. Repetições entram no
                cálculo; poucos exercícios não comprovam domínio.
              </p>
              <Link
                href={`/estudar?concurso=${contest}&tema=${recommended.topicId}`}
              >
                Estudar esse assunto →
              </Link>
            </div>
          )}
        </section>
      ) : (
        <section className="panel lesson-content">
          {finished ? (
            <>
              <span className="eyebrow green-text">RODADA CONCLUÍDA</span>
              <h2>
                {round.filter((q, i) => answers[i] === q.correct).length}{" "}
                acertos em {round.length} questões
              </h2>
              <p>
                Confira os comentários e salve a rodada para atualizar sua
                evolução.
              </p>
              <button
                className="button dark"
                disabled={!canSave || busy || saved}
                onClick={persist}
              >
                {saved
                  ? "Rodada salva"
                  : busy
                    ? "Salvando…"
                    : "Salvar no meu histórico"}
              </button>
              {saved && (
                <p role="status">Histórico e lista de revisão atualizados.</p>
              )}
              {round.map((q, i) => (
                <details key={q.id}>
                  <summary>
                    {answers[i] === q.correct ? "✓ Acerto" : "Revisar"} —{" "}
                    {q.prompt}
                  </summary>
                  <p>Sua resposta: {q.options[answers[i]]}</p>
                  <p>
                    <b>Gabarito: {q.options[q.correct]}</b>
                  </p>
                  <h4>Vamos fazer juntos</h4>
                  <GuidedSteps steps={q.explanation} />
                  <Link
                    href={`/estudar?concurso=${contest}&tema=${q.topicId}`}
                    target="_blank"
                  >
                    Abrir aula e caderno ↗
                  </Link>
                </details>
              ))}
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => {
                  if (
                    saved ||
                    window.confirm(
                      "O resultado ainda não foi salvo. Descartar esta rodada?",
                    )
                  )
                    setRound([]);
                }}
              >
                Novo treino
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow green-text">
                {mode === "diagnostic" ? "Diagnóstico" : "Treino"} · {index + 1}
                /{round.length}
              </p>
              <progress
                max={round.length}
                value={index}
                aria-label="Progresso da rodada"
              />
              <p>{q.lessonTitle}</p>
              <h2>{q.prompt}</h2>
              <fieldset className="quiz-options" disabled={checked}>
                <legend>Escolha uma alternativa</legend>
                {q.options.map((o, i) => (
                  <label
                    key={i}
                    className={
                      checked && i === q.correct
                        ? "correct"
                        : choice === i
                          ? "selected"
                          : ""
                    }
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={choice === i}
                      onChange={() => setChoice(i)}
                    />
                    <span>
                      {String.fromCharCode(65 + i)}. {o}
                    </span>
                  </label>
                ))}
              </fieldset>
              {checked ? (
                <div className="quiz-feedback" role="status">
                  <h3>
                    {choice === q.correct
                      ? "Você acertou"
                      : "Vamos entender o erro"}
                  </h3>
                  <p>
                    <b>Resposta: {q.options[q.correct]}</b>
                  </p>
                  <h4>Vamos fazer juntos</h4>
                  <GuidedSteps key={q.id} steps={q.explanation} />
                  <Link
                    href={`/estudar?concurso=${contest}&tema=${q.topicId}`}
                    target="_blank"
                  >
                    Ver explicação completa e caderno ↗
                  </Link>
                  <p>
                    <button
                      className="button dark"
                      onClick={() => {
                        setIndex(index + 1);
                        setChoice(null);
                        setChecked(false);
                      }}
                    >
                      {index + 1 === round.length
                        ? "Ver resultado"
                        : "Próxima questão"}
                    </button>
                  </p>
                </div>
              ) : (
                <button
                  className="button dark"
                  disabled={choice === null}
                  onClick={() => {
                    setAnswers([...answers, choice!]);
                    setChecked(true);
                  }}
                >
                  Corrigir
                </button>
              )}
              <button
                className="text-button"
                onClick={() => {
                  if (window.confirm("Encerrar esta rodada sem salvar?"))
                    setRound([]);
                }}
              >
                Encerrar rodada
              </button>
            </>
          )}
        </section>
      )}
      <section className="panel lesson-content training-history">
        <h2>Sua evolução por assunto</h2>
        <p>
          Percentuais consideram todas as respostas salvas, incluindo
          repetições. Assuntos sem tentativas ainda não foram avaliados.
        </p>
        <div className="topic-progress-grid">
          {stats.map((s) => (
            <article key={s.id}>
              <Link href={`/estudar?concurso=${contest}&tema=${s.topicId}`}>
                {s.title}
              </Link>
              <strong>
                {s.total
                  ? `${Math.round((100 * s.correct) / s.total)}%`
                  : "Sem avaliação"}
              </strong>
              <progress
                max={Math.max(1, s.total)}
                value={s.correct}
                aria-label={`Acertos em ${s.title}`}
              />
              <small>
                {s.total
                  ? `${s.correct}/${s.total} acertos · ${s.unique} questões distintas`
                  : "Comece um treino para avaliar"}
              </small>
            </article>
          ))}
        </div>
        <h2>Histórico de rodadas</h2>
        {!attempts.length ? (
          <p>Nenhuma rodada salva ainda.</p>
        ) : (
          <ul>
            {[...attempts].reverse().map((a) => (
              <li key={a.id}>
                {new Date(a.date).toLocaleString("pt-BR")} ·{" "}
                {a.mode === "diagnostic"
                  ? "Diagnóstico"
                  : a.mode === "review"
                    ? "Revisão"
                    : "Treino"}{" "}
                · {a.answers.filter((x) => x.correct).length}/{a.answers.length}{" "}
                acertos
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

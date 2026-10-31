# Rumo à Farda

Sistema de estudos em Next.js + React + TypeScript, preparado para Supabase Auth e PostgreSQL. Inclui as trilhas **Soldado PMERJ** e **Guarda Municipal de São Gonçalo** com dados independentes por concurso e por usuário.

## Executar

```sh
cd /Users/macbookair/Documents/PMERJ-saas/frontend
npm install
npm run dev
```

Abra http://localhost:3000. Se o ambiente bloquear o monitor de arquivos do Turbopack (erro `unable to start FSEvent stream`), use a versão de produção:

```sh
npm run build
npm start
```

Nenhuma variável é necessária para experimentar. Sem Supabase configurado, os dados são salvos no navegador. Não há conteúdo fictício pré-preenchido. O cronômetro continua entre telas, mas não sobrevive a recarregar/fechar a página; sessões concluídas só entram no histórico após clicar em salvar. Sessões também podem ser registradas manualmente.

## O que está incluído

- Seletor de concurso; progresso, meta, sessões, resultados e anotações independentes.
- PMERJ: 211 tópicos principais e 32 complementares, preservando o roteiro original.
- Guarda SG: 121 tópicos, organizados em cinco disciplinas a partir do Anexo III do edital enviado.
- Busca de assuntos, filtro de pendentes, marcação de conclusão e caderno de anotações.
- Cronômetro de 25/45/60 minutos; registro manual e gráfico dos últimos sete dias.
- Simulados livres e modelo Guarda SG 2026 com pesos por disciplina, pontuação de 0 a 100 e alerta de disciplina zerada.
- Exportação/importação JSON por concurso. Importar substitui somente o concurso selecionado; backups de outro concurso são rejeitados. Backups antigos sem envelope continuam aceitos na PMERJ.
- Interface responsiva, menu móvel, formulários rotulados e modais nativos acessíveis.
- Cadastro, login, confirmação de e-mail, recuperação de senha e saída preparados para Supabase.

## Ativar o Supabase

1. Crie um projeto Supabase.
2. No SQL Editor, execute, nesta ordem:
   - `supabase/migrations/001_study_state.sql`
   - `supabase/migrations/002_multiple_contests.sql`
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave **publishable** (a chave pública anon legada também é aceita como valor). Nunca use `service_role` no frontend.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA-CHAVE-PUBLICA
```

4. Em Authentication > Providers, habilite Email e configure confirmação por e-mail.
5. Em Authentication > URL Configuration, configure Site URL e Redirect URLs com a origem usada, por exemplo `http://localhost:3000`. Ao publicar, configure também a URL real. Confirmação e recuperação voltam para a raiz da aplicação.
6. Configure a entrega de e-mail do projeto (SMTP para uso real) e revise os limites do plano.
7. Reinicie o servidor. Em produção, faça um novo build após alterar variáveis `NEXT_PUBLIC_*`.
8. Crie uma conta, confirme o e-mail e entre. Se houver progresso local, exporte **antes** de ativar o Supabase; depois importe na conta, no concurso correspondente. Nenhum dado local é associado automaticamente a uma conta.

A tabela usa chave composta `(user_id, contest_id)` e RLS em SELECT/INSERT/UPDATE/DELETE para que cada usuário só acesse suas próprias linhas. A migração 002 identifica linhas antigas como `pmerj`, preservando seu conteúdo. A migração pode ser reaplicada. Não há credenciais reais incluídas no projeto.

O aplicativo lê e grava pelo SDK oficial; o controle de acesso é feito pelo banco, não apenas pela interface. O progresso de cada concurso é um documento JSON por usuário. Edições simultâneas em várias abas/dispositivos usam a última gravação; não há edição colaborativa ou atualização em tempo real.

Documentação oficial: https://supabase.com/docs/guides/auth/quickstarts/react e https://supabase.com/docs/guides/database/postgres/row-level-security.

### Verificar após conectar

- Cadastro e confirmação; login; recarregamento com sessão persistida; saída.
- Recuperação de senha pelo e-mail, retorno à aplicação e atualização.
- Marcar um assunto, sair e entrar novamente: o progresso deve reaparecer.
- Criar segunda conta: não deve ver o progresso da primeira.
- Conferir no SQL Editor que RLS está ativo e que as duas migrações foram aplicadas.

Esses fluxos remotos não foram executados porque ainda não existe projeto Supabase conectado.

## Fontes da Guarda Municipal

Arquivos enviados pelo usuário, copiados sem alteração para `public/materials/`:

- `gmsg-edital-2026.pdf`: Edital nº 001/PMSG/2026, 58 páginas. Programa no Anexo III, páginas 49–51. Distribuição/pesos e mínimo na página 24; duração no item 8.21.
- `gmsg-prova-2022.pdf`: prova enviada como 2022; a capa identifica Edital nº 003/PMSG/2020, 80 questões e duração de 3h30. Questões 1–15 Português, 16–35 Direito, 36–50 Extravagante, 51–70 Específicos, 71–80 Informática.

O edital de 2026 orienta a trilha: 15/20/15/20/10 questões e pesos 1/1/1/2/1. São 100 pontos, mínimo de 50 e nenhuma disciplina zerada. O mínimo não garante classificação. O alvo de 80% é uma meta de estudo e o painel geral mostra acertos sem pesos; os resultados do modelo 2026 exibem a pontuação ponderada separadamente.

As questões 61–70 da prova anterior usam a Lei Municipal 050/1991; o programa enviado usa as Leis 1.416/2022 e 1.625/2026. O sistema sinaliza essa diferença. A prova não substitui o edital. Não foi fornecido gabarito oficial, por isso não há correção automática nem respostas inventadas. Os tópicos seguem o escopo legal do documento, sem afirmar que eventuais retificações posteriores foram verificadas.

A contagem de tópicos é pedagógica: uma lei extensa pode ser um tópico, e seu percentual não representa o peso em pontos. Leis especiais repetidas nas disciplinas Direito e Extravagante seguem a estrutura do edital, com marcações independentes. A aplicação organiza estudo teórico; não oferece plano de treinamento físico ou acompanhamento das demais etapas.

Os PDFs em `public/` são servidos publicamente por este frontend. A aplicação foi preparada localmente; nenhum deploy externo foi realizado.

## Validação

```sh
npm test
npm run build
```

Testes de domínio verificam contagem e IDs, preservação do currículo PMERJ, pesos, mínimos, disciplina zerada, rejeição de notas inválidas e compatibilidade de backups. Verificação de navegador: troca de concurso, persistência local, progresso isolado, registro ponderado, registro de sessão, início/pausa do cronômetro e navegação móvel. Backend real e envio de e-mails dependem da configuração acima.

## Cronograma guiado

No menu **Meu cronograma**, escolha data inicial e final, dias da semana e meta de 1–50 exercícios do seu material. A carga é calculada automaticamente: 60 minutos por tópico e 30 por revisão (incluindo leitura, prática e correção). A média é por dia com sessão; cada sessão mostra sua duração. Dias excedentes ficam livres para descanso ou reforço. O sistema segue a ordem do currículo e reserva uma sessão de revisão após cada grupo. PMERJ permite incluir os complementos de 2014.

A agenda semanal traz quatro etapas com tempo distribuído: recordar, estudar teoria, praticar e corrigir. Inclui exemplos introdutórios resolvidos, desafios com explicação e erros comuns. As sessões abrem aulas por tema ou capítulos compartilhados e o banco de questões comentadas. Alguns temas legais aguardam revisão das fontes. A meta de exercícios não inicia uma prova automática.

A conclusão de uma sessão é independente do domínio dos tópicos e do histórico de minutos. Ela pode ser reaberta. Alterar datas ou ritmo preserva as tarefas concluídas. O plano cabe no prazo inclusivo escolhido. A carga é uma estimativa pedagógica: amplie o prazo se precisar de mais tempo. Prazos sem dias elegíveis, acima de cinco anos ou com sessões superiores a 24 horas são rejeitados.

O cronograma fica no campo opcional `schedule` do JSON de progresso, com separação por concurso. Usa o mesmo armazenamento local/Supabase, entra no backup e não exige nova migração SQL. Backups anteriores continuam válidos.

## Páginas de acesso e estudo
- `/login`: login, recuperação e redefinição de senha.
- `/registro`: cadastro com confirmação de senha e e-mail pelo Supabase.
- Autorize a origem e `/login` em Authentication > URL Configuration para os redirecionamentos de e-mail.
- Sem as variáveis públicas do Supabase, os formulários informam a configuração pendente; não simulam autenticação.
- No plano, o ícone de caderno abre `/estudar?concurso=...&tema=...`: explicação introdutória, exemplo resolvido, exercício comentado e caderno do tema na mesma página. Matemática tem 38 aulas específicas com resolução em etapas; outras disciplinas usam capítulos compartilhados, e itens sem fonte revisada são sinalizados.
- O caderno reutiliza os IDs existentes: anotações anteriores continuam disponíveis e entram no backup.


## Treino e diagnóstico

Acesse Simulados → Resolver questões comentadas ou `/questoes`. Há filtros por disciplina, assunto e nível estimado (classificação pedagógica inicial, não calibrada por banca). O diagnóstico alterna disciplinas disponíveis. As questões são autorais.

No resultado, clique **Salvar no meu histórico**. As rodadas são armazenadas em `study_state.data.attempts`, por usuário e concurso, usando o Supabase já configurado. Não requer nova tabela. Sem Supabase, usa armazenamento local; com Supabase, visitantes podem treinar mas precisam entrar para salvar. Falhas de gravação permitem tentar novamente, sem duplicar a rodada.

A revisão considera a última resposta salva de cada questão. A evolução conta todas as tentativas, mostra também questões distintas e recomenda o menor percentual entre assuntos respondidos. Não estima aprovação nem domínio com validade estatística. A prática embutida nas aulas continua sendo uma atividade avulsa; o histórico é registrado pelo banco `/questoes`.


## Vamos fazer juntos

Os 93 exemplos disponíveis apresentam objetivo, preparação em linguagem simples, ações explicadas e uma pergunta de conferência com resposta. O leitor pode avançar/voltar uma etapa ou exibir tudo. As 120 correções de questões também foram reescritas para mostrar o raciocínio em etapas. O componente compartilhado aparece nas aulas, no cronograma, nas correções e na revisão do resultado. Avançar a leitura não marca domínio nem altera progresso.

A classificação inicial das questões está explícita nos dados: ampliar uma explicação não muda automaticamente sua dificuldade. Isso mantém os filtros independentes do tamanho do texto.
# pmerj
# pmerj
# pmerj

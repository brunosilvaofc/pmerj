export type StudyGuide = { intro: string; steps: string[]; example: { question: string; solution: string[] }; challenge: string; answer: string; mistake: string };
const portuguese: StudyGuide = {
 intro:'Uma palavra pode ser observada de várias formas: como é escrita, quais sons produz e qual função tem na frase. Comece com frases curtas e aprenda um termo de cada vez.',
 steps:['Leia o nome do assunto e escreva o que você acha que ele significa. Depois confira a definição no seu material.','Separe a definição em palavras simples. Substantivo, por exemplo, é a classe que usamos para dar nome a seres, objetos, lugares e ideias.','Copie uma frase curta, encontre o elemento estudado e explique por que ele pertence àquela categoria. Depois escreva uma frase sua.'],
 example:{question:'Na frase “A guarda atenta observou a rua”, quais palavras nomeiam seres ou lugares e qual expressa uma característica?',solution:['“Guarda”, neste contexto, nomeia uma pessoa; “rua” nomeia um lugar. Ambos são substantivos.','“Atenta” caracteriza a guarda: é um adjetivo. “Observou” indica a ação e é um verbo.','Leia novamente substituindo “atenta” por “cuidadosa”. A característica mudou, mas a pessoa continua sendo a guarda. Essa comparação ajuda a reconhecer a função.']},
 challenge:'Na frase “O aluno dedicado leu o livro”, encontre dois substantivos, um adjetivo e um verbo.',answer:'Substantivos: aluno e livro. Adjetivo: dedicado. Verbo: leu.',mistake:'Não classifique uma palavra isoladamente sem olhar a frase: a função pode mudar conforme o contexto.'
};
const sounds: StudyGuide = {
 intro:'Letra é o sinal escrito. Fonema é uma unidade sonora que distingue palavras. Sílaba é uma parte pronunciada em um impulso de voz. Não confunda essas três ideias.',
 steps:['Leia a palavra em voz alta, devagar. Depois observe como ela é escrita.','Separe a palavra em sílabas. Identifique qual delas recebe mais força na pronúncia: essa é a sílaba tônica.','Classifique pela posição da sílaba tônica. Última: oxítona; penúltima: paroxítona; antepenúltima: proparoxítona. Só depois estude as regras de acentuação.'],
 example:{question:'Como separar e classificar a palavra “médico”?',solution:['A separação é mé-di-co: três sílabas.','A parte pronunciada com mais força é “mé”. Contando a partir do fim: co é a última, di é a penúltima e mé é a antepenúltima.','Portanto, “médico” é proparoxítona. Todas as proparoxítonas recebem acento gráfico.']},
 challenge:'Separe “café” em sílabas e identifique a posição da sílaba tônica.',answer:'Ca-fé. A sílaba tônica é “fé”, a última: é uma oxítona.',mistake:'Sílaba tônica não é sinônimo de acento gráfico. “Casa” tem sílaba tônica (“ca”), mesmo sem sinal de acento.'
};
const reading: StudyGuide = {
 intro:'Interpretar é construir uma conclusão apoiada no texto. Primeiro descubra o que está escrito; depois veja o que pode ser deduzido sem inventar informação.',
 steps:['Leia uma vez para descobrir o tema. Na segunda leitura, sublinhe quem fez o quê, quando e por quê.','Separe informação explícita (está escrita) de inferência (conclusão sustentada pelo texto).','Para cada alternativa, procure uma passagem que a confirme. Desconfie de palavras como “sempre”, “nunca” e “todos” quando o texto não faz essa generalização.'],
 example:{question:'“Choveu durante a manhã. Por isso, o treino foi adiado.” Qual é a relação entre as duas frases?',solution:['O primeiro fato é a chuva. O segundo é o adiamento.','O conector “por isso” apresenta o resultado do fato anterior. A chuva é a causa; o adiamento é a consequência.','Não é possível afirmar que o treino foi cancelado definitivamente: o texto informa apenas que foi adiado.']},
 challenge:'Em “Ana estudou, mas ainda tinha dúvidas”, o “mas” indica adição ou oposição?',answer:'Oposição: contrasta a expectativa de compreender tudo após estudar com a permanência de dúvidas.',mistake:'Não substitua o que o autor disse pelo que você acha sobre o assunto.'
};
const math: StudyGuide = {
 intro:'Em Matemática, entenda o que cada número representa antes de escolher uma conta. Escreva o raciocínio em etapas; fazer tudo mentalmente no começo dificulta encontrar erros.',
 steps:['Leia o problema e anote os dados, com suas unidades: reais, metros, pessoas ou minutos.','Escreva o que precisa descobrir. Escolha a operação e resolva uma linha por vez, respeitando parênteses e a ordem das operações.','Confira o resultado com uma operação inversa ou uma estimativa. Uma resposta pode estar numericamente correta e usar a unidade errada.'],
 example:{question:'Um caderno custa R$ 12. Quanto custam 3 cadernos? Qual é o troco ao pagar com R$ 50?',solution:['Cada caderno custa 12 reais. Três cadernos custam 3 × 12 = 36 reais.','O troco é o que sobra do pagamento: 50 − 36 = 14 reais.','Conferência: preço total + troco = 36 + 14 = 50. A conta fecha.']},
 challenge:'Quatro canetas custam R$ 3 cada. Pagando com R$ 20, qual é o troco?',answer:'4 × 3 = 12. Depois, 20 − 12 = 8. Troco: R$ 8.',mistake:'Não some quando o problema pede grupos iguais: três objetos a R$ 12 significam 3 × 12, não 3 + 12.'
};
const fractions: StudyGuide = {
 intro:'Fração representa partes de um todo. Porcentagem é uma fração cujo denominador é 100: 20% significa 20 de cada 100 partes.',
 steps:['Identifique qual quantidade é o todo, ou seja, 100%.','Transforme a porcentagem em fração ou decimal e multiplique pelo valor total.','Se houver desconto, subtraia a parte calculada. Se houver aumento, some. Diferencie o valor da mudança do valor final.'],
 example:{question:'Uma mochila de R$ 150 tem desconto de 20%. Qual é o preço final?',solution:['O todo é 150. O desconto corresponde a 20/100 = 0,20 desse valor.','Calcule 150 × 0,20 = 30. Esse é o desconto, não o preço final.','Subtraia: 150 − 30 = 120. O preço final é R$ 120. Conferência: 10% é 15; 20% é o dobro, 30.']},
 challenge:'Um produto custa R$ 80 e recebe aumento de 25%. Qual é o novo preço?',answer:'25% de 80 = 20. Como é aumento, 80 + 20 = R$ 100.',mistake:'O percentual precisa de uma base. 20% de 100 e 20% de 200 não são a mesma quantidade.'
};
const algebra: StudyGuide = {
 intro:'Uma letra pode representar um número que ainda não sabemos. A equação é uma igualdade: os dois lados precisam continuar valendo a mesma coisa em cada etapa.',
 steps:['Diga em palavras o que a letra representa. Por exemplo: x é o preço de uma caneta.','Traduza a situação para uma igualdade e faça a mesma operação nos dois lados.','Substitua o valor encontrado na equação original. Se os dois lados forem iguais, a solução confere.'],
 example:{question:'Resolva 3x + 6 = 21.',solution:['Subtraia 6 dos dois lados: 3x = 15.','Divida os dois lados por 3: x = 5.','Confira: 3 × 5 + 6 = 15 + 6 = 21. Logo, x = 5 é a solução.']},
 challenge:'Resolva 2x + 4 = 14 e confira a resposta.',answer:'Subtraindo 4: 2x = 10. Dividindo por 2: x = 5. Conferência: 2 × 5 + 4 = 14.',mistake:'“Passar para o outro lado” é apenas uma abreviação. Entenda qual operação foi feita nos dois lados.'
};
const geometry: StudyGuide = {
 intro:'Perímetro mede o contorno. Área mede a superfície interna. Comprimento usa metros; área usa metros quadrados. Um desenho simples costuma esclarecer o problema.',
 steps:['Desenhe a figura e escreva as medidas nos lados.','Decida se o enunciado pede cerca/contorno (perímetro) ou cobertura/piso (área).','Calcule e coloque a unidade correta. Converta unidades antes de misturar centímetros com metros.'],
 example:{question:'Um terreno retangular mede 8 m por 5 m. Qual é a área e o perímetro?',solution:['Área do retângulo: comprimento × largura = 8 × 5 = 40 m².','Perímetro: soma de todos os lados = 8 + 5 + 8 + 5 = 26 m.','Para cobrir o chão, usamos 40 m². Para cercar todo o contorno, usamos 26 m, sem considerar abertura de portão.']},
 challenge:'Um quadrado tem lado de 4 m. Calcule a área e o perímetro.',answer:'Área: 4 × 4 = 16 m². Perímetro: 4 + 4 + 4 + 4 = 16 m. Os números coincidem, mas as grandezas são diferentes.',mistake:'Não use metros quadrados para medir o comprimento de uma cerca.'
};
const probability: StudyGuide = {
 intro:'Probabilidade mede a chance de um resultado. Quando os resultados elementares são igualmente prováveis, compare os casos favoráveis com todos os casos possíveis.',
 steps:['Liste o espaço amostral: todos os resultados possíveis.','Marque quais resultados atendem ao pedido. Conte sem repetir.','Divida favoráveis por possíveis e simplifique a fração. Se os resultados não forem igualmente prováveis, essa contagem simples não basta.'],
 example:{question:'Ao lançar um dado comum equilibrado, qual é a chance de sair número par?',solution:['Os resultados possíveis são 1, 2, 3, 4, 5 e 6: seis casos.','Os pares são 2, 4 e 6: três casos favoráveis.','A probabilidade é 3/6 = 1/2 = 50%. Isso não garante exatamente metade de pares em poucos lançamentos.']},
 challenge:'No mesmo dado, qual é a probabilidade de sair um número maior que 4?',answer:'Os favoráveis são 5 e 6. Logo, 2/6 = 1/3.',mistake:'Não confunda possibilidade com certeza: um resultado provável pode não ocorrer.'
};
const law: StudyGuide = {
 intro:'Para começar a estudar Direito, leia uma regra por vez. Artigo é uma divisão do texto legal; parágrafo detalha a regra; incisos e alíneas organizam hipóteses. Faça perguntas ao texto em vez de tentar decorá-lo inteiro.',
 steps:['Abra a norma indicada no tópico e localize o dispositivo. Leia também o trecho anterior e o seguinte para entender o contexto.','Anote: quem é o destinatário, o que pode/deve fazer, em quais condições e quais exceções aparecem. Traduza com suas palavras sem retirar condições importantes.','Crie um caso simples e compare cada fato com a regra. Volte ao texto para verificar a conclusão e registre a fonte e o artigo no caderno.'],
 example:{question:'Exemplo fictício de leitura: “A biblioteca empresta até dois livros por sete dias, salvo autorização expressa para prazo maior.” O que precisamos observar?',solution:['Destinatário e ação: usuários podem pegar livros emprestados. Limite de quantidade: dois.','Prazo comum: sete dias. Exceção: prazo maior depende de autorização expressa; não é automático.','Um usuário com autorização pode ter prazo maior. Sem autorização, não podemos inventar uma exceção. Esse exercício ensina a ler regras; não é uma norma do concurso.']},
 challenge:'Na regra fictícia, uma pessoa pode concluir que sempre terá 14 dias de empréstimo? Explique.',answer:'Não. O prazo comum é sete dias e um prazo maior depende de autorização expressa. A exceção não elimina a regra.',mistake:'Não generalize um resumo esquecendo requisitos, exceções ou alterações da lei. Use a versão exigida pelo edital.'
};
const writing: StudyGuide = {
 intro:'Um texto argumentativo apresenta uma posição e explica por que ela faz sentido. Cada parágrafo deve ter uma tarefa clara. Comece com frases simples e revise antes de tentar usar palavras difíceis.',
 steps:['Reescreva a proposta com suas palavras e defina a pergunta que precisa responder.','Escreva uma tese (sua posição) e dois motivos que a sustentem. Desenvolva um motivo por parágrafo, com explicação e exemplo.','Conclua retomando a ideia central. Revise clareza, ligação entre frases, concordância e se respondeu ao tema.'],
 example:{question:'Como desenvolver a ideia “Uma rotina organizada ajuda nos estudos”?',solution:['Tese: organizar uma rotina facilita a continuidade do estudo.','Motivo: um horário definido reduz a necessidade de decidir diariamente quando começar. Exemplo: reservar 30 minutos após o almoço torna a tarefa previsível.','Conclusão possível: uma rotina realista, acompanhada de revisão, pode ajudar o estudante a manter a preparação. Evite dizer que ela garante aprovação.']},
 challenge:'Escreva três frases: uma tese sobre leitura diária, um motivo e um exemplo que sustente esse motivo.',answer:'Exemplo: “Ler diariamente amplia o contato com diferentes formas de escrever. A leitura frequente permite observar como as ideias são ligadas. Em uma notícia, o leitor pode identificar como o autor explica a causa de um acontecimento.” Outras respostas coerentes são possíveis.',mistake:'Não repita a tese com outras palavras no desenvolvimento: explique o motivo e mostre um exemplo.'
};
const computing: StudyGuide = {
 intro:'Aprenda Informática ligando o conceito a uma ação concreta. Hardware é a parte física; software são os programas. Quando o edital cita uma versão, os nomes de menus e atalhos podem depender dela.',
 steps:['Identifique o programa ou equipamento estudado e para que serve.','Repita a operação em um arquivo de teste, observando o que mudou. Nunca use documentos importantes para experimentar.','Explique a diferença entre conceitos parecidos: arquivo e pasta, salvar e exportar, cópia e backup. Registre a versão utilizada.'],
 example:{question:'Uma planilha tem o número 10 em A1 e o número 5 em A2. O que faz a fórmula =A1+A2?',solution:['A1 e A2 são endereços de células: coluna A, linhas 1 e 2.','O sinal = inicia a fórmula; + indica adição. A planilha usa os valores dessas duas células.','O resultado é 15. Se A1 mudar para 20, a fórmula passa a calcular 20 + 5 = 25, no recálculo normal.']},
 challenge:'Se B1 contém 7 e B2 contém 3, qual é o resultado de =B1*B2?',answer:'O asterisco representa multiplicação. 7 × 3 = 21.',mistake:'Não trate o resultado exibido como se fosse o conteúdo da fórmula. Uma célula pode mostrar 15 e armazenar =A1+A2.'
};
const history: StudyGuide = {
 intro:'Em conteúdos históricos e sociais, organize contexto, causa e consequência. Em mapas e tabelas, leia primeiro título, período, local e legenda para não interpretar dados fora do contexto.',
 steps:['Localize o tema no tempo e no espaço. Anote os principais termos e consulte o significado dos desconhecidos.','Faça uma linha do tempo ou quadro com fatos, causas e consequências. Não confunda coincidência com relação de causa.','Explique o tema em cinco frases e depois resolva uma questão. Volte à fonte quando uma informação estiver incerta.'],
 example:{question:'Uma tabela fictícia mostra 20 atendimentos em janeiro e 30 em fevereiro. O que se pode concluir?',solution:['O total de atendimentos aumentou em 10: 30 − 20 = 10.','Em relação aos 20 iniciais, o aumento é 10/20 = 50%.','A tabela sozinha não explica o motivo. Pode haver mais procura, mudança no registro ou outros fatores; precisamos de contexto para afirmar a causa.']},
 challenge:'Uma tabela sem data permite afirmar que seus números representam a situação atual?',answer:'Não. É necessário saber o período e a fonte. Um dado histórico não é automaticamente um retrato do presente.',mistake:'Não tire conclusões sobre um lugar ou período usando dados de outro sem justificar a comparação.'
};
export function guideFor(contestId:string,subjectId:string,group:string):StudyGuide {
 if(subjectId==='1') {
  if(/fundamentos da língua/i.test(group)) return sounds;
  if(/interpretação|leitura|semântica|coesão/i.test(group)) return reading;
  return portuguese;
 }
 if(contestId==='pmerj' && subjectId==='2') {
  if(/fraç|porcent/i.test(group)) return fractions;
  if(/álgebra/i.test(group)) return algebra;
  if(/geometria/i.test(group)) return geometry;
  if(/probabilidade/i.test(group)) return probability;
  return math;
 }
 if(contestId==='pmerj' && subjectId==='6') return writing;
 if((contestId==='gmsg' && subjectId==='5') || /informática/i.test(group)) return computing;
 if(contestId==='pmerj' && subjectId==='7' && !/trânsito/i.test(group)) return history;
 return law;
}

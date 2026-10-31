export type Topic = { id: string; title: string };
export type Subject = { id: string; title: string; description: string; duration: string; groups: {id: string; title: string; topics: Topic[]}[] };
export const subjects: Subject[] = [
  {
    "id": "1",
    "title": "Língua Portuguesa",
    "description": "Gramática, interpretação e sintaxe",
    "duration": "4–5 semanas",
    "groups": [
      {
        "id": "1.1",
        "title": "Fundamentos da língua",
        "topics": [
          {
            "id": "1.1.1",
            "title": "Alfabeto, letras, fonemas e sílabas"
          },
          {
            "id": "1.1.2",
            "title": "Divisão silábica e classificação das palavras"
          },
          {
            "id": "1.1.3",
            "title": "Sílaba tônica e tonicidade"
          },
          {
            "id": "1.1.4",
            "title": "Monossílabos, oxítonas, paroxítonas e proparoxítonas"
          },
          {
            "id": "1.1.5",
            "title": "Acentuação gráfica"
          },
          {
            "id": "1.1.6",
            "title": "Ortografia e emprego de letras"
          }
        ]
      },
      {
        "id": "1.2",
        "title": "Classes de palavras",
        "topics": [
          {
            "id": "1.2.1",
            "title": "Substantivos: concreto, abstrato, próprio e comum"
          },
          {
            "id": "1.2.2",
            "title": "Artigos e adjetivos"
          },
          {
            "id": "1.2.3",
            "title": "Numerais e pronomes"
          },
          {
            "id": "1.2.4",
            "title": "Verbos: conjugação, tempos e modos"
          },
          {
            "id": "1.2.5",
            "title": "Locuções verbais, gerúndio, particípio e infinitivo"
          },
          {
            "id": "1.2.6",
            "title": "Advérbios, preposições, conjunções e interjeições"
          }
        ]
      },
      {
        "id": "1.3",
        "title": "Estrutura das orações",
        "topics": [
          {
            "id": "1.3.1",
            "title": "Frase, oração e período"
          },
          {
            "id": "1.3.2",
            "title": "Sujeito, predicado e seus tipos"
          },
          {
            "id": "1.3.3",
            "title": "Verbos transitivos e intransitivos"
          },
          {
            "id": "1.3.4",
            "title": "Objeto direto e indireto"
          },
          {
            "id": "1.3.5",
            "title": "Complemento nominal, adjuntos e aposto"
          },
          {
            "id": "1.3.6",
            "title": "Predicativo, voz ativa e passiva"
          }
        ]
      },
      {
        "id": "1.4",
        "title": "Sintaxe e gramática",
        "topics": [
          {
            "id": "1.4.1",
            "title": "Período simples e composto"
          },
          {
            "id": "1.4.2",
            "title": "Orações coordenadas"
          },
          {
            "id": "1.4.3",
            "title": "Orações subordinadas substantivas, adjetivas e adverbiais"
          },
          {
            "id": "1.4.4",
            "title": "Concordância verbal e nominal"
          },
          {
            "id": "1.4.5",
            "title": "Regência verbal e nominal"
          },
          {
            "id": "1.4.6",
            "title": "Crase"
          },
          {
            "id": "1.4.7",
            "title": "Colocação pronominal"
          }
        ]
      },
      {
        "id": "1.5",
        "title": "Interpretação e semântica",
        "topics": [
          {
            "id": "1.5.1",
            "title": "Compreensão e interpretação de textos"
          },
          {
            "id": "1.5.2",
            "title": "Informações explícitas e implícitas"
          },
          {
            "id": "1.5.3",
            "title": "Tema, ideia principal, inferência e intenção do autor"
          },
          {
            "id": "1.5.4",
            "title": "Sinônimos, antônimos, polissemia e ambiguidade"
          },
          {
            "id": "1.5.5",
            "title": "Denotação e conotação; expressões populares"
          },
          {
            "id": "1.5.6",
            "title": "Coesão, coerência, conectivos e relações de causa, consequência, condição e oposição"
          },
          {
            "id": "1.5.7",
            "title": "Pontuação, reticências e discurso direto"
          },
          {
            "id": "1.5.8",
            "title": "Gêneros textuais, especialmente a crônica"
          },
          {
            "id": "1.5.9",
            "title": "Figuras de linguagem: metáfora, metonímia, hipérbole, ironia e personificação"
          }
        ]
      }
    ]
  },
  {
    "id": "2",
    "title": "Matemática Básica",
    "description": "Aritmética, álgebra, geometria e lógica",
    "duration": "4–5 semanas",
    "groups": [
      {
        "id": "2.1",
        "title": "Aritmética fundamental",
        "topics": [
          {
            "id": "2.1.1",
            "title": "Números naturais, inteiros, racionais e decimais"
          },
          {
            "id": "2.1.2",
            "title": "Adição, subtração, multiplicação e divisão"
          },
          {
            "id": "2.1.3",
            "title": "Tabuada e ordem das operações"
          },
          {
            "id": "2.1.4",
            "title": "Potenciação, radiciação e raiz quadrada"
          },
          {
            "id": "2.1.5",
            "title": "Múltiplos, divisores, MMC e MDC"
          }
        ]
      },
      {
        "id": "2.2",
        "title": "Frações, razões e porcentagens",
        "topics": [
          {
            "id": "2.2.1",
            "title": "Frações próprias, impróprias e equivalentes"
          },
          {
            "id": "2.2.2",
            "title": "Simplificação e operações com frações"
          },
          {
            "id": "2.2.3",
            "title": "Conversão entre fração, decimal e porcentagem"
          },
          {
            "id": "2.2.4",
            "title": "Razão, proporção e regra de três"
          },
          {
            "id": "2.2.5",
            "title": "Aumentos, descontos e valor original"
          },
          {
            "id": "2.2.6",
            "title": "Problemas com dinheiro e áreas proporcionais"
          }
        ]
      },
      {
        "id": "2.3",
        "title": "Álgebra",
        "topics": [
          {
            "id": "2.3.1",
            "title": "Expressões algébricas"
          },
          {
            "id": "2.3.2",
            "title": "Uso de letras para representar números"
          },
          {
            "id": "2.3.3",
            "title": "Equações de primeiro grau"
          },
          {
            "id": "2.3.4",
            "title": "Equações com parênteses e frações"
          },
          {
            "id": "2.3.5",
            "title": "Sistemas de duas ou três equações"
          },
          {
            "id": "2.3.6",
            "title": "Problemas que envolvem quantidades e valores"
          }
        ]
      },
      {
        "id": "2.4",
        "title": "Sequências e raciocínio lógico",
        "topics": [
          {
            "id": "2.4.1",
            "title": "Números consecutivos e padrões numéricos"
          },
          {
            "id": "2.4.2",
            "title": "Média aritmética simples"
          },
          {
            "id": "2.4.3",
            "title": "Ordenação de elementos e desigualdades"
          },
          {
            "id": "2.4.4",
            "title": "Interpretação de condições lógicas"
          },
          {
            "id": "2.4.5",
            "title": "Contagem de pares e agrupamentos"
          },
          {
            "id": "2.4.6",
            "title": "Princípio fundamental da contagem"
          }
        ]
      },
      {
        "id": "2.5",
        "title": "Probabilidade",
        "topics": [
          {
            "id": "2.5.1",
            "title": "Espaço amostral"
          },
          {
            "id": "2.5.2",
            "title": "Eventos possíveis e favoráveis"
          },
          {
            "id": "2.5.3",
            "title": "Probabilidade simples"
          },
          {
            "id": "2.5.4",
            "title": "Experimentos envolvendo urnas e sorteios"
          },
          {
            "id": "2.5.5",
            "title": "Probabilidade com contagem de pares"
          }
        ]
      },
      {
        "id": "2.6",
        "title": "Geometria e medidas",
        "topics": [
          {
            "id": "2.6.1",
            "title": "Unidades de comprimento, área e tempo"
          },
          {
            "id": "2.6.2",
            "title": "Conversão de horas e minutos"
          },
          {
            "id": "2.6.3",
            "title": "Figuras geométricas planas"
          },
          {
            "id": "2.6.4",
            "title": "Área e perímetro de quadrados e retângulos"
          },
          {
            "id": "2.6.5",
            "title": "Circunferência, triângulos e Teorema de Pitágoras"
          },
          {
            "id": "2.6.6",
            "title": "Problemas de cercamento, voltas e arredondamento por lotes"
          }
        ]
      },
      {
        "id": "2.7",
        "title": "Conteúdos do edital: juros, conjuntos, gráficos e volume",
        "topics": [
          {
            "id": "2.7.1",
            "title": "Juros simples e compostos"
          },
          {
            "id": "2.7.2",
            "title": "Conjuntos e diagramas de Venn"
          },
          {
            "id": "2.7.3",
            "title": "Tabelas, gráficos e relações entre grandezas"
          },
          {
            "id": "2.7.4",
            "title": "Volume de sólidos e capacidade"
          }
        ]
      }
    ]
  },
  {
    "id": "3",
    "title": "Direitos Humanos",
    "description": "Cidadania, Constituição e tratados",
    "duration": "2–3 semanas",
    "groups": [
      {
        "id": "3.1",
        "title": "Fundamentos",
        "topics": [
          {
            "id": "3.1.1",
            "title": "Conceito, características e evolução dos direitos humanos"
          },
          {
            "id": "3.1.2",
            "title": "Dignidade da pessoa humana"
          },
          {
            "id": "3.1.3",
            "title": "Universalidade, igualdade e não discriminação"
          },
          {
            "id": "3.1.4",
            "title": "Gerações ou dimensões dos direitos humanos"
          }
        ]
      },
      {
        "id": "3.2",
        "title": "Declaração Universal",
        "topics": [
          {
            "id": "3.2.1",
            "title": "Contexto histórico de 1948"
          },
          {
            "id": "3.2.2",
            "title": "Direito à vida, liberdade e segurança"
          },
          {
            "id": "3.2.3",
            "title": "Proibição da escravidão e tortura"
          },
          {
            "id": "3.2.4",
            "title": "Igualdade perante a lei e presunção de inocência"
          },
          {
            "id": "3.2.5",
            "title": "Proteção judicial, liberdade e direitos sociais"
          }
        ]
      },
      {
        "id": "3.3",
        "title": "Constituição Federal",
        "topics": [
          {
            "id": "3.3.1",
            "title": "Artigo 5º e direitos fundamentais"
          },
          {
            "id": "3.3.2",
            "title": "Inviolabilidade do domicílio"
          },
          {
            "id": "3.3.3",
            "title": "Direito de defesa e devido processo legal"
          },
          {
            "id": "3.3.4",
            "title": "Garantias da pessoa presa e prisão ilegal"
          },
          {
            "id": "3.3.5",
            "title": "Vedação de penas e tratamentos proibidos"
          }
        ]
      },
      {
        "id": "3.4",
        "title": "Tratados internacionais",
        "topics": [
          {
            "id": "3.4.1",
            "title": "Sistema global e sistema interamericano"
          },
          {
            "id": "3.4.2",
            "title": "Pacto de São José da Costa Rica"
          },
          {
            "id": "3.4.3",
            "title": "Convenção Americana de Direitos Humanos"
          },
          {
            "id": "3.4.4",
            "title": "Incorporação e hierarquia dos tratados"
          },
          {
            "id": "3.4.5",
            "title": "Artigo 5º, §3º, da Constituição"
          }
        ]
      },
      {
        "id": "3.5",
        "title": "Leis e proteção de direitos",
        "topics": [
          {
            "id": "3.5.1",
            "title": "Lei 9.455/1997: crimes de tortura"
          },
          {
            "id": "3.5.2",
            "title": "Lei 12.847/2013: prevenção e combate à tortura"
          },
          {
            "id": "3.5.3",
            "title": "Lei 13.445/2017: direitos dos migrantes"
          },
          {
            "id": "3.5.4",
            "title": "Lei 13.060/2014: instrumentos de menor potencial ofensivo"
          },
          {
            "id": "3.5.5",
            "title": "Uso proporcional da força e respeito à vida"
          }
        ]
      },
      {
        "id": "3.6",
        "title": "Direito internacional penal",
        "topics": [
          {
            "id": "3.6.1",
            "title": "Tribunal Penal Internacional"
          },
          {
            "id": "3.6.2",
            "title": "Estatuto de Roma"
          },
          {
            "id": "3.6.3",
            "title": "Crime de genocídio"
          },
          {
            "id": "3.6.4",
            "title": "Crimes contra a humanidade e crimes de guerra"
          },
          {
            "id": "3.6.5",
            "title": "Proteção da população civil"
          }
        ]
      },
      {
        "id": "3.7",
        "title": "Tratados e controle de convencionalidade",
        "topics": [
          {
            "id": "3.7.1",
            "title": "Controle de convencionalidade"
          },
          {
            "id": "3.7.2",
            "title": "Pacto Internacional de Direitos Civis e Políticos"
          }
        ]
      }
    ]
  },
  {
    "id": "4",
    "title": "Direito Administrativo",
    "description": "Administração Pública e legislação da PMERJ",
    "duration": "3–4 semanas",
    "groups": [
      {
        "id": "4.1",
        "title": "Introdução à Administração Pública",
        "topics": [
          {
            "id": "4.1.1",
            "title": "Estado, governo e Administração Pública"
          },
          {
            "id": "4.1.2",
            "title": "Administração direta e indireta"
          },
          {
            "id": "4.1.3",
            "title": "Órgãos e entidades públicas"
          },
          {
            "id": "4.1.4",
            "title": "Pessoas jurídicas de direito público"
          },
          {
            "id": "4.1.5",
            "title": "Competência e função administrativa"
          }
        ]
      },
      {
        "id": "4.2",
        "title": "Princípios administrativos",
        "topics": [
          {
            "id": "4.2.1",
            "title": "Legalidade"
          },
          {
            "id": "4.2.2",
            "title": "Impessoalidade"
          },
          {
            "id": "4.2.3",
            "title": "Moralidade"
          },
          {
            "id": "4.2.4",
            "title": "Publicidade"
          },
          {
            "id": "4.2.5",
            "title": "Eficiência"
          },
          {
            "id": "4.2.6",
            "title": "Razoabilidade, proporcionalidade e continuidade"
          }
        ]
      },
      {
        "id": "4.3",
        "title": "Poderes da Administração",
        "topics": [
          {
            "id": "4.3.1",
            "title": "Poder hierárquico"
          },
          {
            "id": "4.3.2",
            "title": "Poder disciplinar"
          },
          {
            "id": "4.3.3",
            "title": "Poder regulamentar ou normativo"
          },
          {
            "id": "4.3.4",
            "title": "Poder de polícia"
          },
          {
            "id": "4.3.5",
            "title": "Limites, abuso e desvio de poder"
          }
        ]
      },
      {
        "id": "4.4",
        "title": "Atos administrativos",
        "topics": [
          {
            "id": "4.4.1",
            "title": "Conceito e elementos do ato"
          },
          {
            "id": "4.4.2",
            "title": "Presunção de legitimidade e veracidade"
          },
          {
            "id": "4.4.3",
            "title": "Imperatividade e autoexecutoriedade"
          },
          {
            "id": "4.4.4",
            "title": "Exigibilidade e tipicidade"
          },
          {
            "id": "4.4.5",
            "title": "Atos vinculados e discricionários"
          },
          {
            "id": "4.4.6",
            "title": "Espécies de atos administrativos"
          },
          {
            "id": "4.4.7",
            "title": "Anulação, revogação e convalidação"
          }
        ]
      },
      {
        "id": "4.5",
        "title": "Agentes e responsabilidade",
        "topics": [
          {
            "id": "4.5.1",
            "title": "Classificação dos agentes públicos"
          },
          {
            "id": "4.5.2",
            "title": "Agentes de fato"
          },
          {
            "id": "4.5.3",
            "title": "Responsabilidade civil do Estado"
          },
          {
            "id": "4.5.4",
            "title": "Conduta, dano e nexo causal"
          },
          {
            "id": "4.5.5",
            "title": "Responsabilidade por atos de agentes públicos"
          }
        ]
      },
      {
        "id": "4.6",
        "title": "Legislação da PMERJ",
        "topics": [
          {
            "id": "4.6.1",
            "title": "Estatuto dos Policiais Militares do RJ — Lei 443/1981"
          },
          {
            "id": "4.6.2",
            "title": "Hierarquia e disciplina militares"
          },
          {
            "id": "4.6.3",
            "title": "Direitos, deveres e prerrogativas"
          },
          {
            "id": "4.6.4",
            "title": "Licenças e afastamentos"
          },
          {
            "id": "4.6.5",
            "title": "Situações funcionais e passagem para a inatividade"
          },
          {
            "id": "4.6.6",
            "title": "Exclusão do serviço ativo e competências administrativas"
          },
          {
            "id": "4.6.7",
            "title": "Regime constitucional dos militares estaduais"
          }
        ]
      },
      {
        "id": "4.7",
        "title": "Ampliação conforme o edital oficial",
        "topics": [
          {
            "id": "4.7.1",
            "title": "Gênese, evolução, fontes e interpretação do Direito Administrativo"
          },
          {
            "id": "4.7.2",
            "title": "Desconcentração, descentralização, concessões e terceiro setor"
          },
          {
            "id": "4.7.3",
            "title": "Princípios da autotutela, consensualidade, segurança jurídica e confiança"
          },
          {
            "id": "4.7.4",
            "title": "Lei 14.133/2021: licitações e contratos"
          },
          {
            "id": "4.7.5",
            "title": "Processo administrativo: princípios, fases, decadência e PAD"
          },
          {
            "id": "4.7.6",
            "title": "Constituição Estadual: arts. 91 a 93; CF: arts. 42, 144 e 125, §§4º e 5º"
          },
          {
            "id": "4.7.7",
            "title": "Decreto-Lei 667/1969: trechos do edital e marco temporal"
          },
          {
            "id": "4.7.8",
            "title": "Lei Estadual 9.537/2021: proteção social dos militares"
          },
          {
            "id": "4.7.9",
            "title": "Lei Estadual 279/1979: remuneração"
          },
          {
            "id": "4.7.10",
            "title": "Lei Estadual 3.527/2001: auxílio-invalidez"
          }
        ]
      }
    ]
  },
  {
    "id": "5",
    "title": "Direito Penal e Processual Penal",
    "description": "Crimes, penas, investigação e processo",
    "duration": "3–4 semanas",
    "groups": [
      {
        "id": "5.1",
        "title": "Fundamentos de Direito Penal",
        "topics": [
          {
            "id": "5.1.1",
            "title": "Princípios da legalidade e anterioridade penal"
          },
          {
            "id": "5.1.2",
            "title": "Aplicação da lei penal no tempo e no espaço"
          },
          {
            "id": "5.1.3",
            "title": "Conceito e elementos do crime"
          },
          {
            "id": "5.1.4",
            "title": "Fato típico, ilicitude e culpabilidade"
          },
          {
            "id": "5.1.5",
            "title": "Dolo, culpa, ação e omissão"
          }
        ]
      },
      {
        "id": "5.2",
        "title": "Execução e exclusões",
        "topics": [
          {
            "id": "5.2.1",
            "title": "Crime consumado e tentado"
          },
          {
            "id": "5.2.2",
            "title": "Desistência voluntária e arrependimento eficaz"
          },
          {
            "id": "5.2.3",
            "title": "Legítima defesa"
          },
          {
            "id": "5.2.4",
            "title": "Estado de necessidade"
          },
          {
            "id": "5.2.5",
            "title": "Estrito cumprimento de dever legal"
          },
          {
            "id": "5.2.6",
            "title": "Exercício regular de direito"
          }
        ]
      },
      {
        "id": "5.3",
        "title": "Imputabilidade e penas",
        "topics": [
          {
            "id": "5.3.1",
            "title": "Imputabilidade e inimputabilidade"
          },
          {
            "id": "5.3.2",
            "title": "Embriaguez e consequências jurídicas"
          },
          {
            "id": "5.3.3",
            "title": "Circunstâncias agravantes e atenuantes"
          },
          {
            "id": "5.3.4",
            "title": "Regimes fechado, semiaberto e aberto"
          },
          {
            "id": "5.3.5",
            "title": "Estabelecimentos de cumprimento de pena"
          }
        ]
      },
      {
        "id": "5.4",
        "title": "Crimes em espécie",
        "topics": [
          {
            "id": "5.4.1",
            "title": "Furto e roubo"
          },
          {
            "id": "5.4.2",
            "title": "Extorsão e extorsão com restrição de liberdade"
          },
          {
            "id": "5.4.3",
            "title": "Diferenças entre crimes patrimoniais"
          },
          {
            "id": "5.4.4",
            "title": "Crimes contra a Administração Pública"
          },
          {
            "id": "5.4.5",
            "title": "Corrupção ativa e passiva"
          }
        ]
      },
      {
        "id": "5.5",
        "title": "Processo Penal",
        "topics": [
          {
            "id": "5.5.1",
            "title": "Princípios do processo penal"
          },
          {
            "id": "5.5.2",
            "title": "Inquérito policial e sua instauração"
          },
          {
            "id": "5.5.3",
            "title": "Ação penal pública e privada"
          },
          {
            "id": "5.5.4",
            "title": "Ação pública incondicionada e condicionada"
          },
          {
            "id": "5.5.5",
            "title": "Princípio da indivisibilidade na ação privada"
          },
          {
            "id": "5.5.6",
            "title": "Prisão em flagrante e suas modalidades"
          },
          {
            "id": "5.5.7",
            "title": "Provas e elementos informativos"
          },
          {
            "id": "5.5.8",
            "title": "Artigo 155 do Código de Processo Penal"
          }
        ]
      },
      {
        "id": "5.6",
        "title": "Crimes e leis especiais previstos no edital",
        "topics": [
          {
            "id": "5.6.1",
            "title": "Crimes contra a pessoa"
          },
          {
            "id": "5.6.2",
            "title": "Crimes contra a dignidade sexual"
          },
          {
            "id": "5.6.3",
            "title": "Crimes contra a paz pública e a fé pública"
          },
          {
            "id": "5.6.4",
            "title": "Lei 13.869/2019: abuso de autoridade"
          },
          {
            "id": "5.6.5",
            "title": "Lei 8.072/1990: crimes hediondos"
          },
          {
            "id": "5.6.6",
            "title": "Lei 9.455/1997: tortura"
          },
          {
            "id": "5.6.7",
            "title": "Lei 10.741/2003: Estatuto da Pessoa Idosa"
          },
          {
            "id": "5.6.8",
            "title": "Lei 11.343/2006: drogas"
          },
          {
            "id": "5.6.9",
            "title": "Lei 11.340/2006: Maria da Penha"
          },
          {
            "id": "5.6.10",
            "title": "Lei 8.069/1990: ECA"
          },
          {
            "id": "5.6.11",
            "title": "Lei 9.099/1995: Juizados Especiais"
          },
          {
            "id": "5.6.12",
            "title": "Lei 10.826/2003: desarmamento"
          },
          {
            "id": "5.6.13",
            "title": "Lei 8.078/1990: crimes contra o consumidor"
          },
          {
            "id": "5.6.14",
            "title": "Lei 13.146/2015: inclusão da pessoa com deficiência"
          }
        ]
      },
      {
        "id": "5.7",
        "title": "Penas, provas e sujeitos do processo",
        "topics": [
          {
            "id": "5.7.1",
            "title": "Penas restritivas de direitos, multa, sursis e livramento condicional"
          },
          {
            "id": "5.7.2",
            "title": "Corpo de delito, cadeia de custódia, perícias, busca e apreensão"
          },
          {
            "id": "5.7.3",
            "title": "Juiz, Ministério Público, acusado, defensor e auxiliares"
          },
          {
            "id": "5.7.4",
            "title": "Medidas cautelares e liberdade provisória"
          }
        ]
      }
    ]
  },
  {
    "id": "6",
    "title": "Redação",
    "description": "Argumentação, estrutura e escrita formal",
    "duration": "2 semanas",
    "groups": [
      {
        "id": "6.1",
        "title": "Base da escrita",
        "topics": [
          {
            "id": "6.1.1",
            "title": "Construção de frases claras"
          },
          {
            "id": "6.1.2",
            "title": "Parágrafos e pontuação"
          },
          {
            "id": "6.1.3",
            "title": "Ortografia e concordância"
          },
          {
            "id": "6.1.4",
            "title": "Coesão e coerência"
          }
        ]
      },
      {
        "id": "6.2",
        "title": "Texto dissertativo-argumentativo",
        "topics": [
          {
            "id": "6.2.1",
            "title": "Interpretação da proposta"
          },
          {
            "id": "6.2.2",
            "title": "Definição do tema e recorte"
          },
          {
            "id": "6.2.3",
            "title": "Construção de tese"
          },
          {
            "id": "6.2.4",
            "title": "Introdução e contextualização"
          },
          {
            "id": "6.2.5",
            "title": "Desenvolvimento dos argumentos"
          },
          {
            "id": "6.2.6",
            "title": "Exemplos e repertório pertinente"
          },
          {
            "id": "6.2.7",
            "title": "Conclusão coerente com a tese"
          }
        ]
      },
      {
        "id": "6.3",
        "title": "Aplicação ao concurso",
        "topics": [
          {
            "id": "6.3.1",
            "title": "Produção entre 25 e 30 linhas, conforme 2024"
          },
          {
            "id": "6.3.2",
            "title": "Planejamento antes da escrita"
          },
          {
            "id": "6.3.3",
            "title": "Revisão gramatical e estrutural"
          },
          {
            "id": "6.3.4",
            "title": "Simulados de redação e correção por critérios"
          },
          {
            "id": "6.3.5",
            "title": "Debates sobre segurança pública, cidadania e tecnologia"
          }
        ]
      }
    ]
  },
  {
    "id": "7",
    "title": "Conteúdos complementares",
    "description": "História, Geografia, Sociologia, Informática e CTB",
    "duration": "3–4 semanas",
    "groups": [
      {
        "id": "7.1",
        "title": "História do Brasil e de Portugal",
        "topics": [
          {
            "id": "7.1.1",
            "title": "Revolução de Avis e formação da monarquia portuguesa"
          },
          {
            "id": "7.1.2",
            "title": "Expansão marítima, mercantilismo e colonização"
          },
          {
            "id": "7.1.3",
            "title": "Brasil Colonial, economia açucareira e invasões holandesas"
          },
          {
            "id": "7.1.4",
            "title": "Insurreição Pernambucana"
          },
          {
            "id": "7.1.5",
            "title": "Reformas pombalinas e Erário Régio"
          },
          {
            "id": "7.1.6",
            "title": "Independência do Brasil e Batalha do Jenipapo"
          },
          {
            "id": "7.1.7",
            "title": "Interpretações históricas do sistema colonial"
          }
        ]
      },
      {
        "id": "7.2",
        "title": "Geografia do Rio de Janeiro",
        "topics": [
          {
            "id": "7.2.1",
            "title": "Divisão regional e localização dos municípios fluminenses"
          },
          {
            "id": "7.2.2",
            "title": "Urbanização e crescimento da cidade do Rio de Janeiro"
          },
          {
            "id": "7.2.3",
            "title": "Favelização, periferização e desigualdade socioespacial"
          },
          {
            "id": "7.2.4",
            "title": "Industrialização da Região do Médio Paraíba"
          },
          {
            "id": "7.2.5",
            "title": "Indicadores de violência e mortalidade"
          },
          {
            "id": "7.2.6",
            "title": "Leitura de mapas, tabelas e dados estatísticos"
          },
          {
            "id": "7.2.7",
            "title": "Sustentabilidade, emissões de carbono e compensação ambiental"
          }
        ]
      },
      {
        "id": "7.3",
        "title": "Sociologia",
        "topics": [
          {
            "id": "7.3.1",
            "title": "Grupos sociais e interação social"
          },
          {
            "id": "7.3.2",
            "title": "Comunidade e sociedade"
          },
          {
            "id": "7.3.3",
            "title": "Divisão social do trabalho"
          },
          {
            "id": "7.3.4",
            "title": "Estratificação e classes sociais"
          },
          {
            "id": "7.3.5",
            "title": "Mobilidade social vertical e horizontal"
          },
          {
            "id": "7.3.6",
            "title": "Renda per capita, desenvolvimento e desigualdade"
          },
          {
            "id": "7.3.7",
            "title": "Indicadores econômicos e sociais"
          }
        ]
      },
      {
        "id": "7.4",
        "title": "Informática",
        "topics": [
          {
            "id": "7.4.1",
            "title": "Fundamentos de sistemas operacionais e aplicativos"
          },
          {
            "id": "7.4.2",
            "title": "Microsoft Word: margens, páginas e formatação"
          },
          {
            "id": "7.4.3",
            "title": "Excel: células, referências e fórmulas"
          },
          {
            "id": "7.4.4",
            "title": "Funções HOJE, TEXTO, MAIÚSCULA e MARRED"
          },
          {
            "id": "7.4.5",
            "title": "Navegação, segurança, cookies e privacidade"
          }
        ]
      },
      {
        "id": "7.5",
        "title": "Legislação de Trânsito",
        "topics": [
          {
            "id": "7.5.1",
            "title": "Estrutura e conceitos básicos do CTB"
          },
          {
            "id": "7.5.2",
            "title": "Penalidades e medidas administrativas"
          },
          {
            "id": "7.5.3",
            "title": "Suspensão e cassação da CNH"
          },
          {
            "id": "7.5.4",
            "title": "Curso de reciclagem"
          },
          {
            "id": "7.5.5",
            "title": "Infrações e responsabilidades"
          },
          {
            "id": "7.5.6",
            "title": "Regras sobre veículos estrangeiros e reciprocidade"
          }
        ]
      }
    ]
  }
];
export const allTopics = subjects.flatMap(s => s.groups.flatMap(g => g.topics));
export const mainTopics = subjects.slice(0,6).flatMap(s => s.groups.flatMap(g => g.topics));

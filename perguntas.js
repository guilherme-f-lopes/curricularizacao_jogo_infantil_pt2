/* Banco de perguntas — Jogo Educação Infantil (5 a 6 anos)*/

const SEM_RESPOSTA_AUDIO = [1, 8, 9]; 

const PERGUNTAS = {
  facil: [
    { n: 1,  texto: 'Toque na cor amarela.', img: null, alt: ['Amarelo', 'Azul', 'Vermelho'], certa: 0 },
    { n: 2,  texto: 'Quantas maçãs você vê na tela?', alt: ['2', '3', '4'], certa: 1 },
    { n: 3,  texto: 'A bolinha está EM CIMA ou EMBAIXO da mesa?', alt: ['Em cima', 'Embaixo'], certa: 1 },
    { n: 4,  texto: 'Onde vive o peixinho?', alt: ['No mar', 'Na floresta', 'No céu'], certa: 0 },
    { n: 5,  texto: 'Qual bicho é MAIOR?', alt: ['Elefante', 'Formiga', 'Gato'], certa: 0 },
    { n: 6,  texto: 'Bata palminhas e conte: BO-LA. Quantos pedacinhos (sílabas) tem a palavra "BOLA"?', alt: ['1', '2', '3'], certa: 1 },
    { n: 7,  texto: 'Com qual letra começa a palavra "GATO"?', alt: ['G', 'T', 'A'], certa: 0 },
    { n: 8,  texto: 'Qual estrelinha é IGUAL à primeira?', alt: ['Estrela igual ao modelo', 'Estrela de cor diferente', 'Estrela de tamanho diferente'], certa: 0 },
    { n: 9,  texto: 'Ouça: "O cachorrinho correu atrás da bola." O que o cachorrinho fez?', alt: ['Correu atrás da bola', 'Dormiu na caminha', 'Comeu a ração'], certa: 0 },
    { n: 10, texto: 'Qual é o som inicial da palavra "BOLA"?', alt: ['B', 'F', 'M'], certa: 0 }
  ],
  medio: [
    { n: 11, texto: 'Conte os patinhos nadando na lagoa. Quantos são?', alt: ['4', '5', '6'], certa: 1 },
    { n: 12, texto: 'Qual objeto é mais PESADO?', alt: ['Pedra', 'Pena', 'Folha'], certa: 0 },
    { n: 13, texto: 'O passarinho está à DIREITA ou à ESQUERDA da árvore?', alt: ['À direita', 'À esquerda'], certa: 0 },
    { n: 14, texto: 'Misture azul e amarelo. Qual cor você forma?', alt: ['Verde', 'Roxo', 'Laranja'], certa: 0 },
    { n: 15, texto: 'Qual animal vive na floresta?', alt: ['Macaco', 'Tubarão', 'Pinguim'], certa: 0 },
    { n: 16, texto: 'Bata palminhas: BOR-BO-LE-TA. Quantas sílabas tem a palavra "BORBOLETA"?', alt: ['3', '4', '5'], certa: 1 },
    { n: 17, texto: 'Qual dessas palavras começa com a mesma letra de "CASA"?', alt: ['Carro', 'Mesa', 'Pato'], certa: 0 },
    { n: 18, texto: 'Observe as 3 estrelas. Qual tem a cor DIFERENTE das outras duas?', alt: ['Estrela 1', 'Estrela 2', 'Estrela 3'], certa: 1 },
    { n: 19, texto: 'Ouça: "O gato está em cima da caixa." Onde está o gato?', alt: ['Em cima da caixa', 'Embaixo da caixa', 'Dentro da caixa'], certa: 0 },
    { n: 20, texto: 'Qual dessas palavras começa com o mesmo som de "SAPO"?', alt: ['Sapato', 'Gato', 'Lua'], certa: 0 }
  ],
  dificil: [
    { n: 21, texto: 'Você tem 3 bolinhas e ganha mais 2. Quantas bolinhas você terá ao todo?', alt: ['4', '5', '6'], certa: 1 },
    { n: 22, texto: 'Coloque em ordem do MENOR para o MAIOR: formiguinha, cachorro e elefante.', alt: ['Formiguinha, cachorro, elefante', 'Elefante, cachorro, formiguinha', 'Cachorro, formiguinha, elefante'], certa: 0 },
    { n: 23, texto: 'O livro está ENTRE o lápis e a borracha. Qual objeto está no meio?', alt: ['Livro', 'Lápis', 'Borracha'], certa: 0 },
    { n: 24, texto: 'Que cor aparece quando misturamos vermelho e branco?', alt: ['Rosa', 'Roxo', 'Marrom'], certa: 0 },
    { n: 25, texto: 'Qual destes animais NÃO vive na água?', alt: ['Peixe', 'Golfinho', 'Leão'], certa: 2 },
    { n: 26, texto: 'Qual palavra tem MAIS sílabas: "SOL" ou "GIRASSOL"?', alt: ['Sol', 'Girassol'], certa: 1 },
    { n: 27, texto: 'Qual letra está faltando na palavra "C_SA"?', alt: ['A', 'U', 'O'], certa: 0 },
    { n: 28, texto: 'Observe o padrão: círculo, quadrado, círculo, quadrado, ___. O que vem depois?', alt: ['Círculo', 'Quadrado', 'Triângulo'], certa: 0 },
    { n: 29, texto: 'Ouça: "A menina foi ao parque e depois foi para casa." Onde ela foi PRIMEIRO?', alt: ['Parque', 'Casa', 'Escola'], certa: 0 },
    { n: 30, texto: 'Qual destas palavras RIMA com "GATO"?', alt: ['Pato', 'Bola', 'Casa'], certa: 0 }
  ]
};

const NIVEIS = {
  facil:   { nome: 'Fácil',   estrelas: '★',   cor: '#59c773' },
  medio:   { nome: 'Normal',  estrelas: '★★',  cor: '#ffa633' },
  dificil: { nome: 'Difícil', estrelas: '★★★', cor: '#ef5b5b' }
};

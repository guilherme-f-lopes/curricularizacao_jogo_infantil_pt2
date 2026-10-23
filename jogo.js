/* Lógica do jogo — telas: nome → nível → tabuleiro ⇄ pergunta → final */

const TOTAL = 10;          // perguntas por partida
const PONTOS_POR_ACERTO = 40;
const $ = (id) => document.getElementById(id);

const estado = { nome: '', nivel: null, fila: [], idx: 0, acertos: 0, pontos: 0, resultados: [] };

/* ---------- Palco escalável (1366×768) ---------- */
function ajustarPalco() {
  const s = Math.min(window.innerWidth / 1366, window.innerHeight / 768);
  const st = $('stage');
  st.style.transform = `scale(${s})`;
  st.style.left = (window.innerWidth - 1366 * s) / 2 + 'px';
  st.style.top = (window.innerHeight - 768 * s) / 2 + 'px';
}
window.addEventListener('resize', ajustarPalco);
ajustarPalco();

/* ---------- Telas ---------- */
function mostrar(id) {
  pararAudio();
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $(id).classList.add('active');
}

/* ---------- Áudio ---------- */
let audioAtual = null;
function pararAudio() {
  if (audioAtual) { audioAtual.onended = null; audioAtual.pause(); audioAtual = null; }
  $('btn-ouvir').classList.remove('tocando');
}
function tocar(src, aoTerminar, botao) {
  pararAudio();
  const a = new Audio(src);
  audioAtual = a;
  if (botao) botao.classList.add('tocando');
  a.onended = () => { if (botao) botao.classList.remove('tocando'); if (aoTerminar) aoTerminar(); };
  a.play().catch(() => { if (botao) botao.classList.remove('tocando'); if (aoTerminar) aoTerminar(); });
}

let ctxAudio = null;
function notas(lista) { // lista: [frequência, início, duração]
  try {
    ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = ctxAudio.currentTime + 0.02;
    lista.forEach(([f, ini, dur]) => {
      const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + ini);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + ini + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + ini + dur);
      o.connect(g).connect(ctxAudio.destination);
      o.start(t0 + ini); o.stop(t0 + ini + dur + 0.05);
    });
  } catch (e) { /* sem som, o jogo continua */ }
}
const somAcerto = () => notas([[523, 0, .18], [659, .12, .18], [784, .24, .18], [1047, .36, .35]]);
const somErro   = () => notas([[392, 0, .22], [330, .2, .35]]);
const somFinal  = () => notas([[523, 0, .2], [659, .18, .2], [784, .36, .2], [1047, .54, .2], [784, .72, .15], [1047, .86, .5]]);

/* ---------- Utilidades ---------- */
function embaralhar(lista) { // Fisher-Yates: ordem aleatória a cada partida
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pad = (n) => String(n).padStart(2, '0');
const LETRAS = ['A', 'B', 'C', 'D'];

/* ---------- 01 · Nome ---------- */
function confirmarNome() {
  const v = $('nome').value.trim();
  if (!v) {
    const c = $('nome'); c.classList.remove('erro'); void c.offsetWidth; c.classList.add('erro'); c.focus();
    return;
  }
  estado.nome = v;
  mostrar('s-nivel');
}
$('btn-nome').addEventListener('click', confirmarNome);
$('nome').addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmarNome(); });

/* ---------- 02 · Nível (escolha da criança) ---------- */
document.querySelectorAll('.nivel-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.nivel-card').forEach((c) => c.classList.remove('sel'));
    card.classList.add('sel');
    estado.nivel = card.dataset.nivel;
    $('btn-continuar').disabled = false;
  });
});
$('btn-continuar').addEventListener('click', () => { if (estado.nivel) iniciarPartida(); });

/* ---------- Partida ---------- */
function iniciarPartida() {
  estado.fila = embaralhar(PERGUNTAS[estado.nivel]).slice(0, TOTAL);
  estado.idx = 0; estado.acertos = 0; estado.pontos = 0; estado.resultados = [];
  montarTabuleiro();
  irParaTabuleiro(-1);
}

/* ---------- 04 · Tabuleiro ---------- */
const POS = Array.from({ length: TOTAL + 1 }, (_, i) => ({ x: 105 + i * 115, y: i % 2 === 0 ? 500 : 385 }));
const raioNo = (i) => (i === TOTAL ? 55 : i === estado.idx ? 46 : 34);

function montarTabuleiro() {
  const svg = $('trilha'); svg.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', POS[i].x); l.setAttribute('y1', POS[i].y);
    l.setAttribute('x2', POS[i + 1].x); l.setAttribute('y2', POS[i + 1].y);
    svg.appendChild(l);
  }
  const nos = $('nos'); nos.innerHTML = '';
  for (let i = 0; i <= TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'no'; d.id = 'no' + i;
    d.style.left = POS[i].x + 'px'; d.style.top = POS[i].y + 'px';
    nos.appendChild(d);
  }
  const r = document.createElement('div');
  r.className = 'rotulo-chegada'; r.textContent = 'Chegada';
  r.style.left = POS[TOTAL].x + 'px'; r.style.top = POS[TOTAL].y + 62 + 'px';
  nos.appendChild(r);
}

function pintarNos() {
  for (let i = 0; i <= TOTAL; i++) {
    const d = $('no' + i);
    d.className = 'no'; d.textContent = ''; d.innerHTML = '';
    let tam = 68;
    if (i === TOTAL) {
      d.classList.add('chegada'); tam = 110;
      d.innerHTML = '<svg viewBox="0 0 24 24"><use href="#star"/></svg>';
      d.style.fontSize = '';
    } else if (i < estado.idx) {
      d.classList.add(estado.resultados[i] ? 'feito' : 'errou');
      d.textContent = estado.resultados[i] ? '✓' : '✗';
      d.style.fontSize = '24px';
    } else if (i === estado.idx) {
      d.classList.add('atual'); tam = 92; d.textContent = i + 1; d.style.fontSize = '30px';
    } else {
      d.textContent = i + 1; d.style.fontSize = '22px';
    }
    d.style.width = d.style.height = tam + 'px';
  }
}

function posAvatar(i) {
  const av = $('avatar');
  av.style.left = POS[i].x + 'px';
  av.style.top = POS[i].y - raioNo(i) - 12 - 40 + 'px';
}

function irParaTabuleiro(anterior) {
  mostrar('s-tabuleiro');
  $('tab-nome').textContent = estado.nome;
  $('tab-pontos').textContent = `★ ${estado.pontos} pontos`;
  pintarNos();

  const btn = $('btn-prox');
  btn.classList.add('oculto');
  btn.firstChild.textContent = estado.idx === 0 ? 'Começar! ' : estado.idx >= TOTAL ? 'Ver resultado ' : 'Próxima pergunta ';

  const av = $('avatar');
  av.style.transition = 'none';
  const origem = anterior >= 0 ? anterior : 0;
  // posição de partida: no nó onde o jogador estava
  av.style.left = POS[origem].x + 'px';
  av.style.top = POS[origem].y - (origem === estado.idx ? 46 : 34) - 12 - 40 + 'px';
  void av.offsetWidth;
  av.style.transition = '';

  setTimeout(() => {
    posAvatar(estado.idx);
    av.classList.remove('pula'); void av.offsetWidth; av.classList.add('pula');
    setTimeout(() => btn.classList.remove('oculto'), anterior >= 0 ? 950 : 300);
  }, anterior >= 0 ? 450 : 100);
}

$('btn-prox').addEventListener('click', () => {
  if (estado.idx >= TOTAL) mostrarFinal(); else mostrarPergunta();
});

/* ---------- 03 · Pergunta ---------- */
function mostrarPergunta() {
  const q = estado.fila[estado.idx];
  const nv = NIVEIS[estado.nivel];
  mostrar('s-pergunta');

  $('q-contador').textContent = `Pergunta ${estado.idx + 1} de ${TOTAL}`;
  const chip = $('q-nivel');
  chip.textContent = `${nv.estrelas} ${nv.nome}`; chip.style.background = nv.cor;
  $('prog-fill').style.background = nv.cor;
  $('prog-fill').style.width = ((estado.idx + 1) / TOTAL) * 100 + '%';
  $('feedback').hidden = true;
  $('q-texto').textContent = q.texto;

  const box = $('q-img');
  box.innerHTML = '';
  box.classList.toggle('cores', q.img === null);
  if (q.img === null) {
    box.innerHTML = '<i style="background:#ffd633"></i><i style="background:#4aadf0"></i><i style="background:#ef5b5b"></i>';
  } else {
    const im = new Image();
    im.alt = ''; im.src = `img/q${pad(q.n)}.webp`;
    box.appendChild(im);
  }

  const wrap = $('q-respostas');
  wrap.innerHTML = '';
  wrap.classList.remove('travado');
  wrap.style.setProperty('--cols', q.alt.length);
  wrap.classList.toggle('longo', q.alt.some((t) => t.length > 18));
  q.alt.forEach((texto, i) => {
    const b = document.createElement('button');
    b.className = 'alt';
    b.innerHTML = `<span class="letra">${LETRAS[i]}</span><span></span>`;
    b.lastChild.textContent = texto;
    b.addEventListener('click', () => responder(i));
    wrap.appendChild(b);
  });

  setTimeout(() => ouvirPergunta(), 450);
}

function ouvirPergunta() { // enunciado e, logo em seguida, as alternativas
  const q = estado.fila[estado.idx];
  const botao = $('btn-ouvir');
  const alternativas = SEM_RESPOSTA_AUDIO.includes(q.n) ? null : () => tocar(`audio/r${pad(q.n)}.m4a`, null, botao);
  tocar(`audio/p${pad(q.n)}.m4a`, alternativas, botao);
}
$('btn-ouvir').addEventListener('click', ouvirPergunta);

const ELOGIOS = ['Muito bem!', 'Parabéns!', 'Isso mesmo!', 'Você arrasou!', 'Ótimo!'];

function responder(i) {
  const wrap = $('q-respostas');
  if (wrap.classList.contains('travado')) return;
  wrap.classList.add('travado');
  pararAudio();

  const q = estado.fila[estado.idx];
  const acertou = i === q.certa;
  const botoes = wrap.querySelectorAll('.alt');
  botoes.forEach((b, k) => {
    if (k === q.certa) b.classList.add('certa');
    else if (k === i) b.classList.add('errada');
    else b.classList.add('apagada');
  });

  estado.resultados[estado.idx] = acertou;
  if (acertou) { estado.acertos++; estado.pontos += PONTOS_POR_ACERTO; }

  const fb = $('feedback');
  fb.classList.toggle('erro', !acertou);
  $('fb-titulo').textContent = acertou ? ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)] : 'Quase!';
  $('fb-msg').textContent = acertou ? `Você acertou! +${PONTOS_POR_ACERTO} pontos` : `A resposta certa é: ${q.alt[q.certa]}`;
  fb.hidden = false;
  fb.style.animation = 'none'; void fb.offsetWidth; fb.style.animation = '';

  if (acertou) somAcerto(); else somErro();
}

$('btn-fb').addEventListener('click', () => {
  pararAudio();
  estado.idx++;
  irParaTabuleiro(estado.idx - 1);
});

/* ---------- 05 · Final ---------- */
function mostrarFinal() {
  mostrar('s-final');
  const nv = NIVEIS[estado.nivel];
  const a = estado.acertos;
  const estrelas = a >= 9 ? 3 : a >= 5 ? 2 : a >= 1 ? 1 : 0;
  const subs = ['Não desanime, vamos tentar de novo!', 'Muito bom! Vamos treinar mais um pouquinho?', 'Você completou o desafio com sucesso!', 'Você é um super expert!'];

  $('f-titulo').textContent = a > 0 ? `Parabéns, ${estado.nome}!` : `Boa tentativa, ${estado.nome}!`;
  $('f-sub').textContent = subs[estrelas];
  $('f-pontos').textContent = estado.pontos;
  $('f-acertos').textContent = `${a}/${TOTAL}`;
  $('f-nivel').textContent = nv.nome;

  const box = $('f-estrelas'); box.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.innerHTML = '<use href="#star"/>';
    if (i < estrelas) { s.classList.add('on'); s.style.animationDelay = 0.3 + i * 0.25 + 's'; }
    box.appendChild(s);
  }
  confete();
  if (a > 0) somFinal();
}

function confete() {
  const c = $('confete'); c.innerHTML = '';
  const cores = ['#6fd0ec', '#ffd633', '#ef6f9b', '#b79cf5', '#59c773', '#ff8a3d'];
  for (let i = 0; i < 34; i++) {
    const el = document.createElement('i');
    const t = 10 + Math.random() * 24;
    if (Math.random() < 0.35) el.className = 'est';
    let x, y;
    do { x = Math.random() * 1340; y = Math.random() * 740; }
    while (x > 300 && x < 1070 && y > 40 && y < 700); // deixa o centro livre para o texto
    el.style.cssText = `left:${x}px;top:${y}px;width:${t}px;height:${t}px;background:${cores[i % cores.length]};animation-duration:${3 + Math.random() * 3}s;animation-delay:${-Math.random() * 3}s`;
    c.appendChild(el);
  }
}

$('btn-again').addEventListener('click', iniciarPartida);
$('btn-inicio').addEventListener('click', () => {
  $('nome').value = estado.nome;
  document.querySelectorAll('.nivel-card').forEach((c) => c.classList.remove('sel'));
  estado.nivel = null; $('btn-continuar').disabled = true;
  mostrar('s-nome');
});

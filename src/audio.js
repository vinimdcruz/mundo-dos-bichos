/**
 * Módulo de áudio: música de fundo sintetizada + efeitos sonoros.
 *
 * IMPORTANTE (iOS): AudioContext.resume() é assíncrono. iniciarMusica()
 * retorna uma Promise; aguardar antes de agendar notas garante que o
 * contexto está ativo quando os osciladores forem criados.
 */

let contexto = null;
let ganhoMusica = null;
let tocando = false;
let timeoutLoop = null;

function obterContexto() {
  if (!contexto) contexto = new (window.AudioContext || window.webkitAudioContext)();
  return contexto;
}

// Duração de uma semínima a ~82 BPM
const Q = 0.73;

function tocarNota(freq, inicio, duracao, volume = 0.18) {
  const ctx = obterContexto();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);

  // Sine soa mais suave e orgânico do que triangle
  osc.type = 'sine';
  osc.frequency.value = freq;

  // Envelope com ataque e decaimento suaves
  const t = ctx.currentTime + inicio;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.08);
  gain.gain.linearRampToValueAtTime(volume * 0.7, t + duracao * 0.5);
  gain.gain.linearRampToValueAtTime(0, t + duracao);

  osc.start(t);
  osc.stop(t + duracao + 0.05);
}

function tocarBaixo(freq, inicio, duracao, volume = 0.07) {
  const ctx = obterContexto();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t = ctx.currentTime + inicio;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.12);
  gain.gain.linearRampToValueAtTime(0, t + duracao);
  osc.start(t);
  osc.stop(t + duracao + 0.05);
}

// Melodia pentatônica suave em Sol maior (~68 BPM)
// Uma voz só, movimento por graus conjuntos, notas longas
const MELODIA = [
  [392.00, 0*Q,  Q*2  ], // G4  (mínima)
  [440.00, 2*Q,  Q*1.5], // A4
  [493.88, 3.5*Q,Q*1.5], // B4
  [392.00, 5*Q,  Q*2  ], // G4  (mínima)
  [329.63, 7*Q,  Q*2  ], // E4  (mínima)

  [293.66, 9*Q,  Q    ], // D4
  [329.63, 10*Q, Q*1.5], // E4
  [392.00, 11.5*Q,Q*2 ], // G4
  [440.00, 13.5*Q,Q*3 ], // A4  (pontuada)

  [392.00, 16.5*Q,Q   ], // G4
  [349.23, 17.5*Q,Q*1.5],// F#4
  [329.63, 19*Q,  Q*2 ], // E4
  [293.66, 21*Q,  Q*1.5],// D4
  [261.63, 22.5*Q,Q*3.5],// C4  (pausa longa antes do loop)
];

// Baixo simples: raiz do acorde a cada dois tempos
const BAIXO = [
  [98.00,  0*Q,  Q*4 ], // G2
  [98.00,  4*Q,  Q*4 ], // G2
  [73.42,  8*Q,  Q*4 ], // D2
  [98.00,  12*Q, Q*4 ], // G2
  [65.41,  16*Q, Q*4 ], // C2
  [98.00,  20*Q, Q*6 ], // G2 (segura até o loop)
];

const DURACAO_LOOP = 26 * Q;

function agendarLoop() {
  if (!tocando) return;
  MELODIA.forEach(([freq, inicio, dur]) => tocarNota(freq, inicio, dur));
  BAIXO.forEach(([freq, inicio, dur]) => tocarBaixo(freq, inicio, dur));
  timeoutLoop = setTimeout(agendarLoop, DURACAO_LOOP * 1000);
}

export async function iniciarMusica() {
  if (tocando) return;

  const ctx = obterContexto();
  // Aguarda o resume antes de agendar — crítico no iOS
  await ctx.resume();

  ganhoMusica = ctx.createGain();
  ganhoMusica.gain.value = 0.22;
  ganhoMusica.connect(ctx.destination);

  tocando = true;
  agendarLoop();
}

export function pararMusica() {
  tocando = false;
  if (timeoutLoop) clearTimeout(timeoutLoop);
  if (ganhoMusica) {
    ganhoMusica.gain.linearRampToValueAtTime(0, obterContexto().currentTime + 0.3);
    setTimeout(() => { ganhoMusica = null; }, 400);
  }
}

export function musicaEstaTocando() {
  return tocando;
}

export function tocarSomAcerto() {
  const ctx = obterContexto();
  const base = ctx.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, base + i * 0.1);
    g.gain.linearRampToValueAtTime(0.2, base + i * 0.1 + 0.02);
    g.gain.linearRampToValueAtTime(0, base + i * 0.1 + 0.18);
    osc.start(base + i * 0.1);
    osc.stop(base + i * 0.1 + 0.22);
  });
}

export function tocarSomErro() {
  const ctx = obterContexto();
  const base = ctx.currentTime;
  [280, 230].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, base + i * 0.18);
    g.gain.linearRampToValueAtTime(0.1, base + i * 0.18 + 0.02);
    g.gain.linearRampToValueAtTime(0, base + i * 0.18 + 0.2);
    osc.start(base + i * 0.18);
    osc.stop(base + i * 0.18 + 0.22);
  });
}

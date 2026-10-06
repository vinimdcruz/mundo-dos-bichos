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

function tocarNota(freq, inicio, duracao, tipo = 'triangle', volume = 0.25) {
  const ctx = obterContexto();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.type = tipo;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + inicio);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + inicio + 0.03);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + inicio + duracao - 0.03);
  osc.start(ctx.currentTime + inicio);
  osc.stop(ctx.currentTime + inicio + duracao);
}

const MELODIA = [
  [523.25, 0.00, 0.16], // C5
  [659.25, 0.18, 0.16], // E5
  [783.99, 0.36, 0.16], // G5
  [659.25, 0.54, 0.16], // E5
  [587.33, 0.72, 0.16], // D5
  [698.46, 0.90, 0.16], // F5
  [880.00, 1.08, 0.24], // A5
  [783.99, 1.34, 0.24], // G5
  [523.25, 1.60, 0.16], // C5
  [659.25, 1.78, 0.16], // E5
  [783.99, 1.96, 0.16], // G5
  [1046.5, 2.14, 0.32], // C6
  [880.00, 2.48, 0.16], // A5
  [783.99, 2.66, 0.16], // G5
  [698.46, 2.84, 0.16], // F5
  [659.25, 3.02, 0.32], // E5
  [587.33, 3.36, 0.16], // D5
  [523.25, 3.54, 0.46], // C5
];

const DURACAO_LOOP = 4.2;

function agendarLoop() {
  if (!tocando) return;
  MELODIA.forEach(([freq, inicio, dur]) => tocarNota(freq, inicio, dur));
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
    g.gain.linearRampToValueAtTime(0.4, base + i * 0.1 + 0.02);
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
    g.gain.linearRampToValueAtTime(0.2, base + i * 0.18 + 0.02);
    g.gain.linearRampToValueAtTime(0, base + i * 0.18 + 0.2);
    osc.start(base + i * 0.18);
    osc.stop(base + i * 0.18 + 0.22);
  });
}

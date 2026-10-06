/**
 * Módulo de áudio: música de fundo com drums + efeitos sonoros.
 *
 * Referência de estilo: jogos educativos como Fisher-Price, Sesame Street,
 * early Duolingo — loop curto, animado, percussão discreta, melodia clara.
 *
 * IMPORTANTE (iOS): iniciarMusica() é async; aguardar ctx.resume() antes
 * de agendar notas é obrigatório para funcionar no Safari/Chrome iOS.
 */

import { obterContexto } from './contexto-audio.js';

let ganhoMusica = null;
let tocando = false;
let timeoutLoop = null;

// Noise buffer compartilhado (gerado uma vez, reutilizado nos drums)
let noiseBuffer = null;

function obterNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  const ctx = obterContexto();
  const segundos = 1;
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * segundos, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

// ── Instrumentos ──────────────────────────────────────────────────────────────

function kick(inicio) {
  const ctx = obterContexto();
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  gain.gain.setValueAtTime(0.7, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.start(t);
  osc.stop(t + 0.3);
}

function snare(inicio) {
  const ctx = obterContexto();
  const t = ctx.currentTime + inicio;

  // Corpo tonal do snare
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.connect(oscGain);
  oscGain.connect(ganhoMusica ?? ctx.destination);
  osc.type = 'triangle';
  osc.frequency.value = 220;
  oscGain.gain.setValueAtTime(0.18, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.start(t);
  osc.stop(t + 0.12);

  // Ruído do snare
  const noise = ctx.createBufferSource();
  noise.buffer = obterNoiseBuffer();
  const noiseGain = ctx.createGain();
  noise.connect(noiseGain);
  noiseGain.connect(ganhoMusica ?? ctx.destination);
  noiseGain.gain.setValueAtTime(0.22, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  noise.start(t);
  noise.stop(t + 0.15);
}

function hihat(inicio, volume = 0.06) {
  const ctx = obterContexto();
  const t = ctx.currentTime + inicio;
  const noise = ctx.createBufferSource();
  noise.buffer = obterNoiseBuffer();
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 9000;
  const gain = ctx.createGain();
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
  noise.start(t);
  noise.stop(t + 0.05);
}

function nota(freq, inicio, duracao, volume = 0.2) {
  const ctx = obterContexto();
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.type = 'square';
  // Suaviza o timbre do square com um filtro passa-baixa
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  osc.connect(filter);
  filter.connect(gain);
  osc.disconnect(gain); // usa só a cadeia com filtro
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.02);
  gain.gain.linearRampToValueAtTime(volume * 0.6, t + duracao * 0.4);
  gain.gain.linearRampToValueAtTime(0, t + duracao);
  osc.start(t);
  osc.stop(t + duracao + 0.02);
}

function baixo(freq, inicio, duracao) {
  const ctx = obterContexto();
  const t = ctx.currentTime + inicio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
  gain.gain.linearRampToValueAtTime(0.12, t + duracao * 0.5);
  gain.gain.linearRampToValueAtTime(0, t + duracao);
  osc.start(t);
  osc.stop(t + duracao + 0.02);
}

// ── Loop musical ──────────────────────────────────────────────────────────────
// 110 BPM | 4/4 | 2 compassos | pentatônica de Dó maior
// Q = semínima, E = colcheia

const BPM = 110;
const Q = 60 / BPM;          // ~0.545s
const E = Q / 2;              // ~0.273s

// Melodia: colcheias animadas com saltos alegres
const MELODIA = [
  // Compasso 1
  [523.25, 0*E,  E*1.5], // C5
  [659.25, 1.5*E,E*0.5], // E5
  [783.99, 2*E,  E    ], // G5
  [659.25, 3*E,  E*0.5], // E5
  [587.33, 3.5*E,E*0.5], // D5
  [659.25, 4*E,  E    ], // E5
  [523.25, 5*E,  E    ], // C5
  [440.00, 6*E,  E*2  ], // A4 (mínima)
  // Compasso 2
  [392.00, 8*E,  E    ], // G4
  [440.00, 9*E,  E*0.5], // A4
  [523.25, 9.5*E,E*0.5], // C5
  [659.25, 10*E, E*1.5], // E5
  [783.99, 11.5*E,E*0.5],// G5
  [880.00, 12*E, E    ], // A5
  [783.99, 13*E, E    ], // G5
  [659.25, 14*E, E*2  ], // E5 (mínima)
];

// Baixo: raiz + quinta, movimento simples
const BAIXO = [
  [130.81, 0*Q,  Q*1.5], // C3
  [196.00, 1.5*Q,Q*0.5], // G3
  [130.81, 2*Q,  Q*2  ], // C3
  [146.83, 4*Q,  Q    ], // D3
  [164.81, 5*Q,  Q    ], // E3
  [130.81, 6*Q,  Q*2  ], // C3
];

// Drums: kick + snare + hihat em 2 compassos
function agendarDrums() {
  // Hihat em todas as colcheias
  for (let i = 0; i < 16; i++) hihat(i * E, i % 2 === 0 ? 0.07 : 0.04);

  // Kick: tempos 1 e 3 de cada compasso
  [0, 2, 4, 6].forEach(t => kick(t * Q));

  // Snare: tempos 2 e 4 de cada compasso
  [1, 3, 5, 7].forEach(t => snare(t * Q));
}

const DURACAO_LOOP = 8 * Q;

function agendarLoop() {
  if (!tocando) return;
  agendarDrums();
  MELODIA.forEach(([f, i, d]) => nota(f, i, d));
  BAIXO.forEach(([f, i, d]) => baixo(f, i, d));
  timeoutLoop = setTimeout(agendarLoop, DURACAO_LOOP * 1000);
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function iniciarMusica() {
  if (tocando) return;
  const ctx = obterContexto();
  await ctx.resume();

  ganhoMusica = ctx.createGain();
  ganhoMusica.gain.value = 0.55;
  ganhoMusica.connect(ctx.destination);

  // Pré-carrega noise buffer fora do loop de agendamento
  obterNoiseBuffer();

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

/**
 * Módulo de áudio: música de fundo com drums + efeitos sonoros.
 *
 * IMPORTANTE (iOS): iniciarMusica() é async; aguardar ctx.resume() antes
 * de agendar notas é obrigatório para funcionar no Safari/Chrome iOS.
 */

import { obterContexto } from './contexto-audio.js';

let ganhoMusica = null;
let tocando     = false;
let timeoutLoop = null;
let noiseBuffer = null;

function obterNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  const ctx = obterContexto();
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data  = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

// ── Instrumentos ──────────────────────────────────────────────────────────────

function kick(inicio) {
  const ctx  = obterContexto();
  const t    = ctx.currentTime + inicio;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  gain.gain.setValueAtTime(0.7, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.start(t); osc.stop(t + 0.3);
}

function snare(inicio) {
  const ctx = obterContexto();
  const t   = ctx.currentTime + inicio;

  const osc     = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 220;
  osc.connect(oscGain);
  oscGain.connect(ganhoMusica ?? ctx.destination);
  oscGain.gain.setValueAtTime(0.18, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.start(t); osc.stop(t + 0.12);

  const noise     = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  noise.buffer = obterNoiseBuffer();
  noise.connect(noiseGain);
  noiseGain.connect(ganhoMusica ?? ctx.destination);
  noiseGain.gain.setValueAtTime(0.22, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  noise.start(t); noise.stop(t + 0.15);
}

function hihat(inicio, volume = 0.06) {
  const ctx    = obterContexto();
  const t      = ctx.currentTime + inicio;
  const noise  = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain   = ctx.createGain();
  noise.buffer       = obterNoiseBuffer();
  filter.type        = 'highpass';
  filter.frequency.value = 9000;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
  noise.start(t); noise.stop(t + 0.05);
}

function nota(freq, inicio, duracao, volume = 0.2) {
  const ctx    = obterContexto();
  const t      = ctx.currentTime + inicio;
  const osc    = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain   = ctx.createGain();

  osc.type           = 'square';
  osc.frequency.value = freq;
  filter.type        = 'lowpass';
  filter.frequency.value = 1800;

  // Cadeia limpa sem connect/disconnect: osc -> filter -> gain -> dest
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.02);
  gain.gain.linearRampToValueAtTime(volume * 0.6, t + duracao * 0.4);
  gain.gain.linearRampToValueAtTime(0, t + duracao);
  osc.start(t); osc.stop(t + duracao + 0.02);
}

function baixo(freq, inicio, duracao) {
  const ctx  = obterContexto();
  const t    = ctx.currentTime + inicio;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ganhoMusica ?? ctx.destination);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
  gain.gain.linearRampToValueAtTime(0.12, t + duracao * 0.5);
  gain.gain.linearRampToValueAtTime(0, t + duracao);
  osc.start(t); osc.stop(t + duracao + 0.02);
}

// ── Sequências ────────────────────────────────────────────────────────────────

const BPM = 110;
const Q   = 60 / BPM;
const E   = Q / 2;

const MELODIA = [
  [523.25, 0*E,   E*1.5],
  [659.25, 1.5*E, E*0.5],
  [783.99, 2*E,   E    ],
  [659.25, 3*E,   E*0.5],
  [587.33, 3.5*E, E*0.5],
  [659.25, 4*E,   E    ],
  [523.25, 5*E,   E    ],
  [440.00, 6*E,   E*2  ],
  [392.00, 8*E,   E    ],
  [440.00, 9*E,   E*0.5],
  [523.25, 9.5*E, E*0.5],
  [659.25, 10*E,  E*1.5],
  [783.99, 11.5*E,E*0.5],
  [880.00, 12*E,  E    ],
  [783.99, 13*E,  E    ],
  [659.25, 14*E,  E*2  ],
];

const BAIXO_SEQ = [
  [130.81, 0*Q,   Q*1.5],
  [196.00, 1.5*Q, Q*0.5],
  [130.81, 2*Q,   Q*2  ],
  [146.83, 4*Q,   Q    ],
  [164.81, 5*Q,   Q    ],
  [130.81, 6*Q,   Q*2  ],
];

function agendarDrums() {
  for (let i = 0; i < 16; i++) hihat(i * E, i % 2 === 0 ? 0.07 : 0.04);
  [0, 2, 4, 6].forEach(t => kick(t * Q));
  [1, 3, 5, 7].forEach(t => snare(t * Q));
}

const DURACAO_LOOP = 8 * Q;

function agendarLoop() {
  if (!tocando) return;
  agendarDrums();
  MELODIA.forEach(([f, i, d]) => nota(f, i, d));
  BAIXO_SEQ.forEach(([f, i, d]) => baixo(f, i, d));
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

export function musicaEstaTocando() { return tocando; }

export function tocarSomAcerto() {
  const ctx  = obterContexto();
  const base = ctx.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = f;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0, base + i * 0.1);
    g.gain.linearRampToValueAtTime(0.2, base + i * 0.1 + 0.02);
    g.gain.linearRampToValueAtTime(0, base + i * 0.1 + 0.18);
    osc.start(base + i * 0.1); osc.stop(base + i * 0.1 + 0.22);
  });
}

export function tocarSomErro() {
  const ctx  = obterContexto();
  const base = ctx.currentTime;
  [280, 230].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0, base + i * 0.18);
    g.gain.linearRampToValueAtTime(0.1, base + i * 0.18 + 0.02);
    g.gain.linearRampToValueAtTime(0, base + i * 0.18 + 0.2);
    osc.start(base + i * 0.18); osc.stop(base + i * 0.18 + 0.22);
  });
}

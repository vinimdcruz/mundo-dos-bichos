/**
 * Módulo de fala.
 *
 * Carrega os WAVs via fetch + decodeAudioData e toca pelo mesmo AudioContext
 * da música. Isso evita o conflito iOS onde HTMLAudioElement suspende o
 * AudioContext do Web Audio API.
 *
 * Fallback para Web Speech API se o buffer não estiver pronto.
 */

import { obterContexto } from './contexto-audio.js';

const CAMINHO_AUDIO = 'assets/audio';
const buffers = new Map(); // nome -> AudioBuffer
let vozFallback = null;

/**
 * Dispara o carregamento de todos os WAVs em background.
 * Não bloqueia — chamar logo após o AudioContext estar ativo (pós-gesto).
 *
 * @param {string[]} nomes
 */
export function precarregarAudios(nomes) {
  nomes.forEach(async nome => {
    if (buffers.has(nome)) return;
    try {
      const resp = await fetch(`${CAMINHO_AUDIO}/${encodeURIComponent(nome)}.wav`);
      if (!resp.ok) return;
      const arrayBuffer = await resp.arrayBuffer();
      const buffer = await obterContexto().decodeAudioData(arrayBuffer);
      buffers.set(nome, buffer);
    } catch {
      // silencia erros de rede; fallback para síntese quando o nome for pedido
    }
  });
}

/**
 * Inicializa o fallback de síntese de voz.
 * Chamar uma vez no carregamento da página.
 */
export function inicializarFala() {
  if (!('speechSynthesis' in window)) return;

  function selecionarVoz() {
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes.length) return;
    vozFallback =
      vozes.find(v => v.lang === 'pt-BR' && v.localService) ??
      vozes.find(v => v.lang === 'pt-BR') ??
      vozes.find(v => v.lang.startsWith('pt')) ??
      null;
  }

  selecionarVoz();
  window.speechSynthesis.addEventListener('voiceschanged', selecionarVoz, { once: true });
}

/**
 * Fala o nome do animal via AudioContext (sem interromper a música).
 *
 * @param {string} nome
 */
export function falarNomeAnimal(nome) {
  const buffer = buffers.get(nome);
  if (buffer) {
    const ctx = obterContexto();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // Voz um pouco mais alta que a música
    const gain = ctx.createGain();
    gain.gain.value = 2.0;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } else {
    usarSintese(nome);
  }
}

// ── Interno ───────────────────────────────────────────────────────────────────

function usarSintese(texto) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(texto);
  utt.lang  = 'pt-BR';
  utt.rate  = 0.82;
  utt.pitch = 1.1;
  if (vozFallback) utt.voice = vozFallback;
  window.speechSynthesis.speak(utt);
}

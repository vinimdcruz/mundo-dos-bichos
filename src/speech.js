/**
 * Módulo de fala.
 *
 * Toca arquivos WAV pré-gerados de assets/audio/{nome}.wav.
 * Fallback para Web Speech API se o arquivo não estiver em cache.
 *
 * IMPORTANTE (iOS): Audio.play() só funciona fora de um gesto do usuário
 * se o elemento já foi criado e carregado dentro de um gesto anterior.
 * Por isso, chamar precarregarAudios() dentro do handler do botão iniciar.
 */

const CAMINHO_AUDIO = 'assets/audio';
const cache = new Map();
let vozFallback = null;

/**
 * Pré-carrega todos os Audio elements durante um gesto do usuário.
 * Deve ser chamado diretamente no handler de clique (sem await antes).
 *
 * @param {string[]} nomes
 */
export function precarregarAudios(nomes) {
  nomes.forEach(nome => {
    if (cache.has(nome)) return;
    const audio = new Audio(`${CAMINHO_AUDIO}/${encodeURIComponent(nome)}.wav`);
    audio.load();
    cache.set(nome, audio);
  });
}

/**
 * Inicializa o fallback de síntese de voz (Web Speech API).
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
 * Fala o nome do animal.
 * Usa o WAV do cache; fallback para síntese de voz.
 *
 * @param {string} nome
 */
export async function falarNomeAnimal(nome) {
  const tocou = await tentarWav(nome);
  if (!tocou) usarSintese(nome);
}

// ── Interno ───────────────────────────────────────────────────────────────────

async function tentarWav(nome) {
  try {
    const audio = cache.get(nome);
    if (!audio) return false;
    audio.currentTime = 0;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

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

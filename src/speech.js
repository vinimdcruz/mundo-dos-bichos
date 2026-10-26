/**
 * Módulo de fala.
 *
 * Toca arquivos WAV pré-gerados: assets/audio/{nome}.wav (pt) e assets/audio/en/{nome}.wav (en).
 * Fallback para Web Speech API se o arquivo não estiver em cache.
 *
 * IMPORTANTE (iOS): Audio.play() só funciona fora de um gesto do usuário
 * se o elemento já foi criado e carregado dentro de um gesto anterior.
 * Por isso, chamar precarregarAudios() dentro do handler do botão iniciar.
 */

const CAMINHO_AUDIO = { pt: 'assets/audio', en: 'assets/audio/en' };
const LANG_VOZ = { pt: 'pt-BR', en: 'en-US' };
const cache = new Map();
const vozesFallback = {};

/**
 * Pré-carrega todos os Audio elements durante um gesto do usuário.
 * Deve ser chamado diretamente no handler de clique (sem await antes).
 *
 * @param {string[]} nomes
 * @param {'pt'|'en'} idioma
 */
export function precarregarAudios(nomes, idioma) {
  nomes.forEach(nome => {
    const chave = `${idioma}/${nome}`;
    if (cache.has(chave)) return;
    const audio = new Audio(`${CAMINHO_AUDIO[idioma]}/${encodeURIComponent(nome)}.wav`);
    audio.load();
    cache.set(chave, audio);
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
    for (const [idioma, lang] of Object.entries(LANG_VOZ)) {
      const base = lang.slice(0, 2);
      vozesFallback[idioma] =
        vozes.find(v => v.lang === lang && v.localService) ??
        vozes.find(v => v.lang === lang) ??
        vozes.find(v => v.lang.startsWith(base)) ??
        null;
    }
  }

  selecionarVoz();
  window.speechSynthesis.addEventListener('voiceschanged', selecionarVoz, { once: true });
}

/**
 * Fala o nome do animal.
 * Usa o WAV do cache; fallback para síntese de voz.
 *
 * @param {string} nome
 * @param {'pt'|'en'} idioma
 */
export async function falarNomeAnimal(nome, idioma) {
  const tocou = await tentarWav(nome, idioma);
  if (!tocou) usarSintese(nome, idioma);
}

// ── Interno ───────────────────────────────────────────────────────────────────

async function tentarWav(nome, idioma) {
  try {
    const audio = cache.get(`${idioma}/${nome}`);
    if (!audio) return false;
    audio.currentTime = 0;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

function usarSintese(texto, idioma) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(texto);
  utt.lang  = LANG_VOZ[idioma];
  utt.rate  = 0.82;
  utt.pitch = 1.1;
  if (vozesFallback[idioma]) utt.voice = vozesFallback[idioma];
  window.speechSynthesis.speak(utt);
}

/**
 * Módulo de fala.
 *
 * Estratégia: tenta tocar o arquivo WAV pré-gerado em assets/audio/{nome}.wav.
 * Se não encontrar (404) ou falhar, cai para Web Speech API com pt-BR.
 * Os WAVs foram gerados pela voz Luciana (macOS) via scripts/gerar-audio.sh.
 */

const CAMINHO_AUDIO = 'assets/audio';

// Cache de Audio elements para evitar recarregamento
const cache = new Map();

/**
 * Inicializa o módulo. Chamar uma vez no início do jogo.
 * Pré-seleciona a melhor voz pt-BR disponível para o fallback.
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

let vozFallback = null;

/**
 * Fala o nome do animal.
 * Prioriza o arquivo WAV; usa síntese de voz como fallback.
 *
 * @param {string} nome - nome do animal em português
 */
export async function falarNomeAnimal(nome) {
  const tocou = await tentarArquivoWav(nome);
  if (!tocou) usarSintese(nome);
}

// ── Interno ───────────────────────────────────────────────────────────────────

async function tentarArquivoWav(nome) {
  const arquivo = `${CAMINHO_AUDIO}/${nome}.wav`;

  try {
    let audio = cache.get(nome);

    if (!audio) {
      // Verifica se o arquivo existe antes de criar o elemento
      const resp = await fetch(arquivo, { method: 'HEAD' });
      if (!resp.ok) return false;

      audio = new Audio(arquivo);
      cache.set(nome, audio);
    }

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

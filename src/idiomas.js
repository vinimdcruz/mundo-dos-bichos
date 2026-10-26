/**
 * Idiomas do jogo: textos da interface e nome dos animais.
 * O idioma é escolhido na tela inicial e lembrado no localStorage.
 */

const CHAVE = 'mundo-dos-bichos:idioma';

export const TEXTOS = Object.freeze({
  pt: {
    htmlLang:  'pt-BR',
    vozLang:   'pt-BR',
    titulo:    'Mundo dos Bichos',
    subtitulo: 'Escuta o nome do animal e toca na foto certa!',
    iniciar:   'Vamos jogar!',
    acerto:    'Muito bem!',
    erro:      'Tente de novo!',
  },
  en: {
    htmlLang:  'en',
    vozLang:   'en-US',
    titulo:    'Animal World',
    subtitulo: 'Listen to the animal name and tap the right picture!',
    iniciar:   "Let's play!",
    acerto:    'Great job!',
    erro:      'Try again!',
  },
});

let atual = lerSalvo();

function lerSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo in TEXTOS) return salvo;
  } catch { /* localStorage indisponível */ }
  return navigator.language?.startsWith('en') ? 'en' : 'pt';
}

export function idiomaAtual() {
  return atual;
}

export function definirIdioma(idioma) {
  if (!(idioma in TEXTOS)) return;
  atual = idioma;
  try { localStorage.setItem(CHAVE, idioma); } catch { /* ignora */ }
}

/** Texto da interface no idioma atual. */
export function t(chave) {
  return TEXTOS[atual][chave];
}

/** Nome do animal no idioma atual. */
export function nomeDoAnimal(animal) {
  return atual === 'en' ? animal.en : animal.nome;
}

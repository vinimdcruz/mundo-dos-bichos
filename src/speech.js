/**
 * Módulo de fala em português brasileiro.
 *
 * Problema: getVoices() é assíncrono no primeiro carregamento do browser.
 * Solução: aguarda o evento voiceschanged e prioriza vozes pt-BR nativas,
 *          caindo para qualquer voz pt como segundo plano.
 */

let vozPreferida = null;
let vozesCarregadas = false;

/**
 * Inicializa o módulo de fala e pré-seleciona a melhor voz pt-BR disponível.
 * Chamar uma vez no início do jogo.
 */
export function inicializarFala() {
  if (!('speechSynthesis' in window)) return;

  function selecionarVoz() {
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes.length) return;

    // Prioridade: pt-BR > pt > qualquer voz com "brazil" ou "portuguese" no nome
    const candidatas = [
      vozes.find(v => v.lang === 'pt-BR' && v.localService),
      vozes.find(v => v.lang === 'pt-BR'),
      vozes.find(v => v.lang.startsWith('pt')),
      vozes.find(v => v.name.toLowerCase().includes('brazil')),
      vozes.find(v => v.name.toLowerCase().includes('portuguese')),
    ];

    vozPreferida = candidatas.find(Boolean) ?? null;
    vozesCarregadas = true;
  }

  selecionarVoz();
  if (!vozesCarregadas) {
    window.speechSynthesis.addEventListener('voiceschanged', selecionarVoz, { once: true });
  }
}

/**
 * Fala o texto em português brasileiro.
 * @param {string} texto
 */
export function falar(texto) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang  = 'pt-BR';
  utterance.rate  = 0.82;
  utterance.pitch = 1.1;

  if (vozPreferida) utterance.voice = vozPreferida;

  window.speechSynthesis.speak(utterance);
}

/**
 * Fala o nome do animal com a frase "Qual é o ___?" para dar contexto à criança.
 * @param {string} nome
 */
export function falarNomeAnimal(nome) {
  falar(nome);
}

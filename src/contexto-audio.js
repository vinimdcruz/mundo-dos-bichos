/**
 * AudioContext singleton compartilhado entre audio.js e speech.js.
 * Garante que música e voz usem o mesmo contexto — evita conflitos no iOS.
 */

let ctx = null;

export function obterContexto() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

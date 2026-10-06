/**
 * Lógica adaptativa do jogo.
 * Centraliza seleção de animais, verificação de respostas e avaliação de progresso.
 */

import { ANIMAIS } from './animals.js';

/**
 * Escolhe 4 animais para a rodada, evitando os vistos recentemente.
 *
 * @param {object} estado - { indicesRecentes: number[] }
 * @returns {Promise<number[]>} - 4 índices de ANIMAIS
 */
export async function escolherAnimais(estado) {
  const recentes = estado.indicesRecentes ?? [];
  const pool = [...Array(ANIMAIS.length).keys()].filter(i => !recentes.includes(i));
  return embaralhar(pool).slice(0, 4);
}

/**
 * Avalia o desempenho atual e retorna um nível de 0 a 10.
 *
 * @param {object} estado - { acertos: number, total: number }
 * @returns {Promise<number>}
 */
export async function avaliarProgresso(estado) {
  if (estado.total === 0) return 5;
  return Math.round((estado.acertos / estado.total) * 10);
}

/**
 * Verifica se a resposta da criança está correta.
 *
 * @param {number} indiceTocado
 * @param {number} indiceAlvo
 * @returns {Promise<{ valor: boolean }>}
 */
export async function verificarResposta(indiceTocado, indiceAlvo) {
  return { valor: indiceTocado === indiceAlvo };
}

// ── util ──────────────────────────────────────────────────────────────────────

function embaralhar(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

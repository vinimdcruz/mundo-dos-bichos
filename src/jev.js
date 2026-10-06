/**
 * Lógica adaptativa do jogo.
 *
 * Centraliza as decisões de seleção de animais e avaliação de progresso.
 * Mantém a interface nomeada como "jev" para facilitar integração futura
 * com a API TypeSafe caso o jogo cresça o suficiente para justificar.
 */

import { ANIMAIS } from './animals.js';

/**
 * Escolhe 4 animais para a rodada, evitando os vistos recentemente.
 *
 * @param {object} estado - { indicesRecentes: number[] }
 * @returns {Promise<number[]>} - 4 índices de ANIMAIS
 */
export async function jevEscolherAnimais(estado) {
  const recentes = estado.indicesRecentes ?? [];
  const pool = [...Array(ANIMAIS.length).keys()].filter(i => !recentes.includes(i));
  return embaralhar(pool).slice(0, 4);
}

/**
 * Avalia o desempenho atual e retorna um nível de 0 a 10.
 * Pode ser usado no futuro para ajustar dificuldade ou introduzir novos animais.
 *
 * @param {object} estado - { acertos: number, total: number }
 * @returns {Promise<number>}
 */
export async function jevAvaliarProgresso(estado) {
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
export async function jevVerificarResposta(indiceTocado, indiceAlvo) {
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

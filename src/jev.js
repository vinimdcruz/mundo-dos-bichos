/**
 * Camada de integração JEV (TypeSafe AI).
 *
 * Cada função tem implementação fallback local e um bloco TODO
 * indicando como substituir pela chamada real à API quando disponível.
 *
 * Para ativar a integração real:
 *   1. Defina JEV_API_KEY (via variável de ambiente ou config)
 *   2. Descomente os blocos marcados com "TODO: JEV real"
 *   3. Instale o SDK: npm install @typesafe-ai/sdk (ou o nome oficial)
 */

// TODO: importar SDK quando disponível
// import { JevClient } from '@typesafe-ai/sdk';
// const jev = new JevClient({ apiKey: JEV_API_KEY });

import { ANIMAIS } from './animals.js';

/**
 * JEV Choice — escolhe 4 animais para a rodada.
 *
 * @param {object} estadoJogador - { acertos, total, indicesRecentes: number[] }
 * @returns {Promise<number[]>} - 4 índices do array ANIMAIS
 */
export async function jevEscolherAnimais(estadoJogador) {
  /*
  TODO: JEV real
  const resultado = await jev.choice({
    question: "Quais 4 animais apresentar agora para uma criança de 3 anos?",
    options: ANIMAIS.map((a, i) => ({ id: i, label: a.nome, meta: a.categoria })),
    state: estadoJogador,
    count: 4,
  });
  return resultado.selected;
  */

  // Fallback: sorteia sem repetir os recentes
  const recentes = estadoJogador.indicesRecentes ?? [];
  const pool = [...Array(ANIMAIS.length).keys()].filter(i => !recentes.includes(i));
  return embaralhar(pool).slice(0, 4);
}

/**
 * JEV Score — avalia o desempenho da criança (0–10).
 *
 * @param {object} estadoJogador
 * @returns {Promise<number>} - pontuação para calibrar dificuldade
 */
export async function jevAvaliarProgresso(estadoJogador) {
  /*
  TODO: JEV real
  const resultado = await jev.score({
    question: "Qual o nível de acerto e engajamento desta criança?",
    criteria: ["taxa de acerto", "tempo de resposta médio", "erros consecutivos"],
    state: estadoJogador,
  });
  return resultado.score;
  */

  const taxa = estadoJogador.total > 0
    ? estadoJogador.acertos / estadoJogador.total
    : 0.5;
  return Math.round(taxa * 10);
}

/**
 * JEV Noul — verifica se a resposta está correta (com nível de confiança).
 *
 * @param {number} indiceTocado
 * @param {number} indiceAlvo
 * @returns {Promise<{ valor: boolean, confianca: number }>}
 */
export async function jevVerificarResposta(indiceTocado, indiceAlvo) {
  /*
  TODO: JEV real
  const resultado = await jev.noul({
    question: "A criança tocou no animal correto?",
    state: {
      tocou: ANIMAIS[indiceTocado].nome,
      alvo: ANIMAIS[indiceAlvo].nome,
    },
  });
  return { valor: resultado.value, confianca: resultado.confidence };
  */

  return { valor: indiceTocado === indiceAlvo, confianca: 1.0 };
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

/**
 * Orquestra o jogo: estado, rodadas, UI e feedback.
 */

import { ANIMAIS }               from './animals.js';
import { inicializarFala, falarNomeAnimal } from './speech.js';
import {
  iniciarMusica, pararMusica, musicaEstaTocando,
  tocarSomAcerto, tocarSomErro,
} from './audio.js';
import {
  jevEscolherAnimais,
  jevAvaliarProgresso,
  jevVerificarResposta,
} from './jev.js';

// ── Estado ────────────────────────────────────────────────────────────────────

const estado = {
  acertos:         0,
  total:           0,
  indicesRecentes: [],   // últimos 8 índices vistos, para evitar repetição
  opcoes:          [],   // 4 índices de ANIMAIS desta rodada
  indiceAlvo:      -1,   // índice em ANIMAIS do animal correto
  bloqueado:       false,
};

// ── Elementos DOM ─────────────────────────────────────────────────────────────

const $pontuacao    = document.getElementById('pontuacao');
const $nomeAnimal   = document.getElementById('nome-animal');
const $cartoes      = document.querySelectorAll('.cartao-animal');
const $feedback     = document.getElementById('feedback');
const $feedbackEmoji = document.getElementById('feedback-emoji');
const $feedbackTexto = document.getElementById('feedback-texto');
const $btnMusica    = document.getElementById('btn-musica');
const $btnNome      = document.getElementById('btn-nome');
const $telaInicial  = document.getElementById('tela-inicial');
const $btnIniciar   = document.getElementById('btn-iniciar');

// ── Rodada ────────────────────────────────────────────────────────────────────

async function novaRodada() {
  estado.bloqueado = false;

  const opcoes = await jevEscolherAnimais(estado);
  estado.opcoes = opcoes;

  // Registra recentes (janela de 8 animais)
  estado.indicesRecentes = [...estado.indicesRecentes, ...opcoes].slice(-8);

  // Escolhe o alvo aleatoriamente entre as 4 opções
  const slotAlvo = Math.floor(Math.random() * 4);
  estado.indiceAlvo = opcoes[slotAlvo];

  // Atualiza UI
  $nomeAnimal.textContent = ANIMAIS[estado.indiceAlvo].nome;
  $cartoes.forEach((cartao, i) => {
    cartao.textContent = ANIMAIS[opcoes[i]].emoji;
    cartao.className = 'cartao-animal';
    cartao.dataset.indice = opcoes[i];
  });

  // Fala o nome após um pequeno delay para a UI estabilizar
  setTimeout(() => falarNomeAnimal(ANIMAIS[estado.indiceAlvo].nome), 350);
}

// ── Interação ─────────────────────────────────────────────────────────────────

async function aoTocarCartao(cartao) {
  if (estado.bloqueado) return;
  estado.bloqueado = true;

  const indiceTocado = parseInt(cartao.dataset.indice, 10);
  const resultado = await jevVerificarResposta(indiceTocado, estado.indiceAlvo);

  estado.total++;

  if (resultado.valor) {
    estado.acertos++;
    cartao.classList.add('correto');
    tocarSomAcerto();
    mostrarFeedback(true);
  } else {
    cartao.classList.add('errado');
    // Destaca o correto para que a criança entenda
    $cartoes.forEach(c => {
      if (parseInt(c.dataset.indice, 10) === estado.indiceAlvo) {
        c.classList.add('correto');
      }
    });
    tocarSomErro();
    mostrarFeedback(false);
  }

  atualizarPontuacao();

  // Avalia progresso via JEV (pode ser usado para ajustar dificuldade)
  jevAvaliarProgresso(estado).then(nivel => {
    // console.log('[JEV] Nível atual:', nivel);
  });

  setTimeout(() => {
    esconderFeedback();
    novaRodada();
  }, 1500);
}

// ── Feedback visual ───────────────────────────────────────────────────────────

function mostrarFeedback(acertou) {
  $feedback.className = 'visivel ' + (acertou ? 'acerto' : 'erro');
  $feedbackEmoji.textContent = acertou ? '🎉' : '😅';
  $feedbackTexto.textContent = acertou ? 'Muito bem!' : 'Tente de novo!';
}

function esconderFeedback() {
  $feedback.className = '';
}

function atualizarPontuacao() {
  $pontuacao.textContent = `⭐ ${estado.acertos}`;
}

// ── Controles ─────────────────────────────────────────────────────────────────

$btnNome.addEventListener('click', () => {
  if (ANIMAIS[estado.indiceAlvo]) {
    falarNomeAnimal(ANIMAIS[estado.indiceAlvo].nome);
  }
});

$btnMusica.addEventListener('click', () => {
  if (musicaEstaTocando()) {
    pararMusica();
    $btnMusica.textContent = '🔇';
  } else {
    iniciarMusica();
    $btnMusica.textContent = '🎵';
  }
});

$cartoes.forEach(cartao => {
  cartao.addEventListener('click', () => aoTocarCartao(cartao));
});

// ── Inicialização ─────────────────────────────────────────────────────────────

inicializarFala();

$btnIniciar.addEventListener('click', () => {
  $telaInicial.style.opacity = '0';
  $telaInicial.style.transition = 'opacity 0.3s';
  setTimeout(() => $telaInicial.remove(), 300);

  iniciarMusica();
  novaRodada();
});

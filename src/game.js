/**
 * Orquestra o jogo: estado, rodadas, UI e feedback.
 */

import { ANIMAIS }               from './animals.js';
import {
  inicializarFala,
  precarregarAudios,
  falarNomeAnimal,
}                                from './speech.js';
import {
  iniciarMusica, pararMusica, musicaEstaTocando,
  tocarSomAcerto, tocarSomErro,
}                                from './audio.js';
import {
  escolherAnimais,
  avaliarProgresso,
  verificarResposta,
}                                from './logica.js';

// ── Estado ────────────────────────────────────────────────────────────────────

const estado = {
  acertos:         0,
  total:           0,
  indicesRecentes: [],
  opcoes:          [],
  indiceAlvo:      -1,
  bloqueado:       false,
};

// ── Elementos DOM ─────────────────────────────────────────────────────────────

const $pontuacao     = document.getElementById('pontuacao');
const $nomeAnimal    = document.getElementById('nome-animal');
const $cartoes       = document.querySelectorAll('.cartao-animal');
const $feedback      = document.getElementById('feedback');
const $feedbackEmoji = document.getElementById('feedback-emoji');
const $feedbackTexto = document.getElementById('feedback-texto');
const $btnMusica     = document.getElementById('btn-musica');
const $btnNome       = document.getElementById('btn-nome');
const $telaInicial   = document.getElementById('tela-inicial');
const $btnIniciar    = document.getElementById('btn-iniciar');

// ── Rodada ────────────────────────────────────────────────────────────────────

async function novaRodada() {
  estado.bloqueado = false;

  const opcoes = await escolherAnimais(estado);
  estado.opcoes = opcoes;

  estado.indicesRecentes = [...estado.indicesRecentes, ...opcoes].slice(-8);

  const slotAlvo = Math.floor(Math.random() * 4);
  estado.indiceAlvo = opcoes[slotAlvo];

  $nomeAnimal.textContent = ANIMAIS[estado.indiceAlvo].nome;
  $cartoes.forEach((cartao, i) => {
    cartao.textContent = ANIMAIS[opcoes[i]].emoji;
    cartao.className = 'cartao-animal';
    cartao.dataset.indice = opcoes[i];
  });

  // Fala o nome automaticamente a cada nova rodada
  setTimeout(() => falarNomeAnimal(ANIMAIS[estado.indiceAlvo].nome), 400);
}

// ── Interação ─────────────────────────────────────────────────────────────────

async function aoTocarCartao(cartao) {
  if (estado.bloqueado) return;
  estado.bloqueado = true;

  const indiceTocado = parseInt(cartao.dataset.indice, 10);
  const resultado = await verificarResposta(indiceTocado, estado.indiceAlvo);

  estado.total++;

  if (resultado.valor) {
    estado.acertos++;
    cartao.classList.add('correto');
    tocarSomAcerto();
    mostrarFeedback(true);
  } else {
    cartao.classList.add('errado');
    $cartoes.forEach(c => {
      if (parseInt(c.dataset.indice, 10) === estado.indiceAlvo) {
        c.classList.add('correto');
      }
    });
    tocarSomErro();
    mostrarFeedback(false);
  }

  atualizarPontuacao();
  avaliarProgresso(estado);

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

$btnIniciar.addEventListener('click', async () => {
  $btnIniciar.textContent = 'Carregando…';
  $btnIniciar.disabled = true;

  // Desbloqueia o AudioContext dentro do gesto — obrigatório no iOS
  await iniciarMusica();

  // Aguarda todos os WAVs decodificados antes de começar
  // (buffers no mesmo AudioContext; sem HTMLAudioElement = sem conflito iOS)
  await precarregarAudios(ANIMAIS.map(a => a.nome));

  $telaInicial.style.opacity = '0';
  $telaInicial.style.transition = 'opacity 0.3s';
  setTimeout(() => $telaInicial.remove(), 300);

  novaRodada();
});

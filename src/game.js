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
import {
  idiomaAtual, definirIdioma, t, nomeDoAnimal,
}                                from './idiomas.js';

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
const $btnIdiomaJogo = document.getElementById('btn-idioma-jogo');
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

  $nomeAnimal.textContent = nomeDoAnimal(ANIMAIS[estado.indiceAlvo]);
  $cartoes.forEach((cartao, i) => {
    const img = document.createElement('img');
    img.src = ANIMAIS[opcoes[i]].imagem;
    img.alt = '';
    img.draggable = false;
    cartao.replaceChildren(img);
    cartao.className = 'cartao-animal';
    cartao.dataset.indice = opcoes[i];
  });

  // Fala o nome automaticamente a cada nova rodada
  setTimeout(() => falarNomeAnimal(nomeDoAnimal(ANIMAIS[estado.indiceAlvo]), idiomaAtual()), 400);
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
  $feedbackTexto.textContent = acertou ? t('acerto') : t('erro');
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
    falarNomeAnimal(nomeDoAnimal(ANIMAIS[estado.indiceAlvo]), idiomaAtual());
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

// ── Seletor de idioma (tela inicial) ──────────────────────────────────────────

const $btnsIdioma = document.querySelectorAll('.btn-idioma');

function aplicarIdioma() {
  document.documentElement.lang = t('htmlLang');
  document.title = t('titulo');
  // A tela inicial é removida do DOM ao começar o jogo
  if ($telaInicial.isConnected) {
    document.getElementById('titulo-inicial').textContent    = t('titulo');
    document.getElementById('subtitulo-inicial').textContent = t('subtitulo');
    $btnIniciar.textContent = t('iniciar');
  }
  $btnIdiomaJogo.textContent = t('rotuloIdioma');
  $btnsIdioma.forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.idioma === idiomaAtual()));
  });
}

$btnsIdioma.forEach(b => {
  b.addEventListener('click', () => {
    definirIdioma(b.dataset.idioma);
    aplicarIdioma();
  });
});

// ── Botão de idioma durante o jogo ────────────────────────────────────────────

$btnIdiomaJogo.addEventListener('click', () => {
  definirIdioma(idiomaAtual() === 'pt' ? 'en' : 'pt');
  aplicarIdioma();

  // Pré-carrega os áudios do novo idioma dentro do gesto (iOS)
  precarregarAudios(ANIMAIS.map(nomeDoAnimal), idiomaAtual());

  const alvo = ANIMAIS[estado.indiceAlvo];
  if (alvo) {
    $nomeAnimal.textContent = nomeDoAnimal(alvo);
    falarNomeAnimal(nomeDoAnimal(alvo), idiomaAtual());
  }
});

aplicarIdioma();

$btnIniciar.addEventListener('click', async () => {
  // Pré-carrega todos os áudios AQUI, dentro do gesto — obrigatório no iOS
  precarregarAudios(ANIMAIS.map(nomeDoAnimal), idiomaAtual());

  // Aguarda o AudioContext estar ativo antes de continuar
  await iniciarMusica();

  $telaInicial.style.opacity = '0';
  $telaInicial.style.transition = 'opacity 0.3s';
  setTimeout(() => $telaInicial.remove(), 300);

  novaRodada();
});

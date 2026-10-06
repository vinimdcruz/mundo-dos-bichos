# Mundo dos Bichos

Jogo educativo mobile-first para crianças de 3 anos. A criança escuta o nome de um animal e toca na imagem correta entre 4 opções. Construído como HTML/CSS/JS puro (sem build step), com integração JEV (TypeSafe AI) para adaptar dificuldade e selecionar animais.

## Estrutura

```
mundo-dos-bichos/
  index.html          # Página principal; carrega os módulos via <script type="module">
  styles/
    main.css          # Tokens de cor, layout, animações
  src/
    animals.js        # Catálogo de animais (emoji + nome pt-BR)
    speech.js         # Síntese de voz em pt-BR (Web Speech API)
    audio.js          # Música de fundo (Web Audio API) e efeitos sonoros
    jev.js            # Camada de integração JEV (TypeSafe AI)
    game.js           # Lógica do jogo; orquestra os demais módulos
```

## Regras de desenvolvimento

- Código sempre em português (variáveis, comentários, nomes de funções).
- Sem frameworks, sem bundler. ES Modules nativos via `<script type="module">`.
- Toda lógica de IA fica isolada em `src/jev.js`. O restante do jogo nunca chama a API diretamente.
- `src/animals.js` exporta um array imutável; adicionar animais é a única mudança permitida nesse arquivo.
- Mobile-first. Testar sempre com DevTools em viewport 390×844 (iPhone 14).
- Nunca usar `alert()`, `confirm()` ou `prompt()`.

## Integração JEV

As funções em `src/jev.js` têm fallback local enquanto a API key não estiver disponível.
Quando integrar, definir a variável de ambiente `JEV_API_KEY` e descomentar as chamadas reais.

Primitivos usados:
- **Choice** (`jevEscolherAnimais`) - seleciona os 4 animais de cada rodada
- **Score** (`jevAvaliarProgresso`) - pontua o desempenho para ajustar dificuldade
- **Noul** (`jevVerificarResposta`) - confirma se a resposta está correta

## Publicação do artefato

O arquivo `index.html` pode ser publicado como Artifact no Claude Code para testar no celular rapidamente.
Ao publicar, incluir todos os arquivos de suporte via `files:`.

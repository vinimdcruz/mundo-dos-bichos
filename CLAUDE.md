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

## Áudios pré-gerados

Os nomes dos animais são falados por arquivos WAV gerados com a voz **Luciana** (macOS pt-BR nativa),
muito mais natural do que a Web Speech API do browser. Os WAVs ficam em `assets/audio/` e não são
versionados no git (binários).

Para (re)gerar após clonar o repo ou adicionar novos animais:

```bash
bash scripts/gerar-audio.sh
```

Requer macOS. O script pula arquivos que já existem.
Se quiser trocar a voz, edite a variável `VOZ` no script.

## Rodar localmente

ES Modules são bloqueados pelo browser via `file://`. Sempre usar um servidor HTTP:

```bash
npm run dev   # inicia em http://localhost:3000
```

No celular: conecta na mesma rede Wi-Fi e acessa `http://<IP-do-mac>:3000`.

## Regras de desenvolvimento

- Código sempre em português (variáveis, comentários, nomes de funções).
- Sem frameworks, sem bundler. ES Modules nativos via `<script type="module">`.
- Toda lógica de IA fica isolada em `src/jev.js`. O restante do jogo nunca chama a API diretamente.
- `src/animals.js` exporta um array imutável; adicionar animais é a única mudança permitida nesse arquivo.
- Mobile-first. Testar sempre com DevTools em viewport 390×844 (iPhone 14).
- Nunca usar `alert()`, `confirm()` ou `prompt()`.

## Módulo jev.js

Contém a lógica adaptativa do jogo (seleção de animais, verificação de resposta, avaliação de progresso).
É lógica local pura; a interface foi nomeada com o prefixo `jev` para facilitar integração futura com
a API TypeSafe se o jogo crescer o suficiente para justificar IA real.

## Publicação do artefato

O arquivo `index.html` pode ser publicado como Artifact no Claude Code para testar no celular rapidamente.
Ao publicar, incluir todos os arquivos de suporte via `files:`.

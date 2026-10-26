#!/usr/bin/env bash
# Gera arquivos de áudio dos animais em português (voz Luciana, assets/audio/)
# e em inglês (voz Samantha, assets/audio/en/).
# Requer macOS. Roda da raiz do projeto: bash scripts/gerar-audio.sh
#
# Para trocar as vozes: edite VOZ e VOZ_EN abaixo.
# Vozes pt-BR disponíveis: Luciana, "Reed (Portuguese (Brazil))", "Sandy (Portuguese (Brazil))"

set -euo pipefail

VOZ="Luciana"
VOZ_EN="Samantha"
DESTINO="assets/audio"
DESTINO_EN="assets/audio/en"
TAXA=22050

mkdir -p "$DESTINO" "$DESTINO_EN"

ANIMAIS=(
  "gato" "cachorro" "coelho" "hamster" "peixe" "vaca" "porco" "galinha" "cavalo" "ovelha" "pato" "cabra" "burro" "galo" "leão" "tigre" "elefante" "girafa" "macaco" "gorila" "zebra" "rinoceronte" "hipopótamo" "urso" "panda" "coala" "canguru" "raposa" "lobo" "guaxinim" "ouriço" "lhama" "crocodilo" "cobra" "onça" "preguiça" "arara" "jacaré" "capivara" "tamanduá" "golfinho" "baleia" "tubarão" "polvo" "caranguejo" "lagosta" "tartaruga" "baiacu" "foca" "lula" "águia" "coruja" "pavão" "flamingo" "pinguim" "cisne" "papagaio" "passarinho" "tucano" "borboleta" "abelha" "joaninha" "grilo" "sapo" "caracol"
)

ANIMAIS_EN=(
  "cat" "dog" "rabbit" "hamster" "fish" "cow" "pig" "hen" "horse" "sheep" "duck" "goat" "donkey" "rooster" "lion" "tiger" "elephant" "giraffe" "monkey" "gorilla" "zebra" "rhinoceros" "hippo" "bear" "panda" "koala" "kangaroo" "fox" "wolf" "raccoon" "hedgehog" "llama" "crocodile" "snake" "jaguar" "sloth" "macaw" "caiman" "capybara" "anteater" "dolphin" "whale" "shark" "octopus" "crab" "lobster" "turtle" "pufferfish" "seal" "squid" "eagle" "owl" "peacock" "flamingo" "penguin" "swan" "parrot" "bird" "toucan" "butterfly" "bee" "ladybug" "cricket" "frog" "snail"
)

gerado=0
pulado=0

# gerar <voz> <destino> <nomes...>
gerar() {
  local voz="$1" destino="$2"; shift 2
  local nome arquivo tmp
  for nome in "$@"; do
    arquivo="$destino/${nome}.wav"
    if [[ -f "$arquivo" ]]; then
      echo "  já existe: $nome"
      pulado=$((pulado+1))
      continue
    fi
    tmp=$(mktemp /tmp/bicho_XXXXXX.aiff)
    say -v "$voz" "$nome" -o "$tmp"
    afconvert "$tmp" "$arquivo" -d LEI16@$TAXA -f WAVE
    rm -f "$tmp"
    echo "  gerado: $nome"
    gerado=$((gerado+1))
  done
}

gerar "$VOZ" "$DESTINO" "${ANIMAIS[@]}"
gerar "$VOZ_EN" "$DESTINO_EN" "${ANIMAIS_EN[@]}"

echo ""
echo "Concluído: $gerado gerado(s), $pulado já existia(m)."

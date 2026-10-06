#!/usr/bin/env bash
# Gera arquivos de áudio para todos os animais usando a voz Luciana (pt-BR macOS).
# Requer macOS. Roda da raiz do projeto: bash scripts/gerar-audio.sh
#
# Para trocar a voz: edite VOZ abaixo.
# Vozes pt-BR disponíveis: Luciana, "Reed (Portuguese (Brazil))", "Sandy (Portuguese (Brazil))"

set -euo pipefail

VOZ="Luciana"
DESTINO="assets/audio"
TAXA=22050

mkdir -p "$DESTINO"

ANIMAIS=(
  "gato" "cachorro" "coelho" "hamster" "peixe"
  "vaca" "porco" "galinha" "cavalo" "ovelha" "pato" "cabra" "burro" "galo"
  "leão" "tigre" "elefante" "girafa" "macaco" "gorila" "zebra"
  "rinoceronte" "hipopótamo" "urso" "panda" "coala" "canguru"
  "raposa" "lobo" "guaxinim" "ouriço" "lhama" "crocodilo" "cobra"
  "onça" "preguiça" "arara" "jacaré" "capivara" "tamanduá"
  "golfinho" "baleia" "tubarão" "polvo" "caranguejo" "lagosta"
  "tartaruga" "baiacu" "foca" "lula"
  "águia" "coruja" "pavão" "flamingo" "pinguim" "cisne" "papagaio" "passarinho" "tucano"
  "borboleta" "abelha" "joaninha" "grilo" "sapo" "caracol"
)

gerado=0
pulado=0

for nome in "${ANIMAIS[@]}"; do
  arquivo="$DESTINO/${nome}.wav"

  if [[ -f "$arquivo" ]]; then
    echo "  já existe: $nome"
    ((pulado++))
    continue
  fi

  tmp=$(mktemp /tmp/bicho_XXXXXX.aiff)
  say -v "$VOZ" "$nome" -o "$tmp"
  afconvert "$tmp" "$arquivo" -d LEI16@$TAXA -f WAVE
  rm -f "$tmp"

  echo "  gerado: $nome"
  ((gerado++))
done

echo ""
echo "Concluído: $gerado gerado(s), $pulado já existia(m)."

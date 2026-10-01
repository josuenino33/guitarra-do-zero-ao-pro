#!/usr/bin/env bash
# Monta o Mapa do Braço a partir de src/:
#   mapa-do-braco.html  -> versão publicada no Claude (link privado, progresso na conta)
#   docs/               -> site para o GitHub Pages / uso offline (instalável no celular)
set -e
cd "$(dirname "$0")"

FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Music&display=swap">'

scripts() { for f in src/js/*.js; do cat "$f"; echo; done; }
styles() { cat src/style.css; for f in src/css/*.css; do echo; cat "$f"; done; }

# 1) versão do Claude
{
  echo '<title>Mapa do Braço</title>'
  echo "$FONTS"
  echo '<style>'; styles; echo '</style>'
  cat src/body.html
  echo '<script>'; scripts; echo '</script>'
} > mapa-do-braco.html

# 2) site independente
mkdir -p docs
BUILD=$(cat src/style.css src/css/*.css src/body.html src/js/*.js src/pwa/* | md5sum | cut -c1-10)
{
  cat src/pwa/head.html
  echo '<title>Mapa do Braço</title>'
  echo "$FONTS"
  echo '<style>'; styles; echo '</style>'
  echo '</head><body>'
  cat src/body.html
  echo '<script>'; scripts; echo '</script>'
  echo "<script>if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(function () {});</script>"
  echo '</body></html>'
} > docs/index.html
sed "s/__BUILD__/$BUILD/" src/pwa/sw.js > docs/sw.js
cp src/pwa/manifest.webmanifest docs/manifest.webmanifest
touch docs/.nojekyll
[ -f docs/icons/icon-512.png ] || python tools/icons.py

echo "ok: mapa-do-braco.html ($(wc -c < mapa-do-braco.html) bytes) e docs/ (build $BUILD)"

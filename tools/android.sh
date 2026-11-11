#!/usr/bin/env bash
# Monta o app Android (Capacitor) a partir de docs/ e gera um APK instalável.
#   bash tools/android.sh          -> projeto em build/android-app e APK em build/MapaDoBraco.apk
#   SKIP_GRADLE=1 bash tools/android.sh  -> só monta o projeto (sem compilar)
# Precisa de Node 20+, Java 21 e Android SDK (o GitHub Actions já tem tudo isso).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd); APP=build/android-app
rm -rf "$APP"; mkdir -p "$APP/www"
cp -r docs/. "$APP/www/"
rm -f "$APP/www/sw.js"   # dentro do app os arquivos já ficam no aparelho; o service worker não é necessário
sed -i "s#navigator.serviceWorker.register#(()=>Promise.resolve())#g" "$APP/www/index.html" || true
cd "$APP"
cat > package.json <<'JSON'
{ "name": "mapa-do-braco-android", "private": true, "version": "1.0.0" }
JSON
npm install --no-audit --no-fund @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 >/dev/null
cat > capacitor.config.json <<'JSON'
{
  "appId": "io.github.josuenino33.mapadobraco",
  "appName": "Mapa do Braço",
  "webDir": "www",
  "android": { "backgroundColor": "#0F1412" }
}
JSON
npx cap add android >/dev/null
MAN=android/app/src/main/AndroidManifest.xml
# microfone (afinador, praticar com microfone, gravador) e áudio
sed -i 's#<uses-permission android:name="android.permission.INTERNET" />#<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />#' "$MAN"
grep -q RECORD_AUDIO "$MAN"
# ícone: usa o ícone do PWA em todas as densidades (convert = ImageMagick)
RES=android/app/src/main/res
rm -rf "$RES/mipmap-anydpi-v26"
for d in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  n=${d%%:*}; s=${d##*:}
  convert "$ROOT/docs/icons/icon-512.png" -resize ${s}x${s} "$RES/mipmap-$n/ic_launcher.png"
  cp "$RES/mipmap-$n/ic_launcher.png" "$RES/mipmap-$n/ic_launcher_round.png"
  rm -f "$RES/mipmap-$n/ic_launcher_foreground.png"
done
if [ "${SKIP_GRADLE:-}" = "1" ]; then echo "ok: projeto em $APP (sem compilar)"; exit 0; fi
cd android && chmod +x gradlew && ./gradlew --no-daemon -q assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$ROOT/build/MapaDoBraco.apk"
echo "ok: build/MapaDoBraco.apk"

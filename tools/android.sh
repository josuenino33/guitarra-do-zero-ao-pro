#!/usr/bin/env bash
# Monta o app Android (Capacitor) a partir de docs/ e gera um APK instalável.
#   bash tools/android.sh          -> projeto em build/android-app e APK em build/MapaDoBraco.apk
#   SKIP_GRADLE=1 bash tools/android.sh  -> só monta o projeto (sem compilar)
# Precisa de Node 22+, Java 21 e Android SDK (o GitHub Actions já tem tudo isso).
# Versão: VERSION_CODE (número inteiro que sempre sobe; no GitHub = número da execução).
# Assinatura (para a Play Store): KEYSTORE_FILE, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD.
#   Com assinatura sai MapaDoBraco.apk (release assinado) e MapaDoBraco.aab (envio à Play Store).
#   Sem assinatura sai só MapaDoBraco.apk de teste (debug), que também instala no celular.
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
npm install --no-audit --no-fund @capacitor/core@8 @capacitor/cli@8 @capacitor/android@8 >/dev/null
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
# versão do app (a Play Store exige versionCode sempre maior)
VC=${VERSION_CODE:-1}
sed -i -E "s/versionCode [0-9]+/versionCode $VC/; s/versionName \"[^\"]*\"/versionName \"1.0.$VC\"/" android/app/build.gradle
grep -q "versionCode $VC" android/app/build.gradle
grep -E "targetSdkVersion|compileSdkVersion" android/variables.gradle
if [ "${SKIP_GRADLE:-}" = "1" ]; then echo "ok: projeto em $APP (sem compilar)"; exit 0; fi
cd android && chmod +x gradlew
if [ -n "${KEYSTORE_FILE:-}" ]; then
  SIGN=(-Pandroid.injected.signing.store.file="$KEYSTORE_FILE" -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD"
        -Pandroid.injected.signing.key.alias="$KEY_ALIAS" -Pandroid.injected.signing.key.password="$KEY_PASSWORD")
  ./gradlew --no-daemon -q assembleRelease bundleRelease "${SIGN[@]}"
  cp app/build/outputs/apk/release/app-release.apk "$ROOT/build/MapaDoBraco.apk"
  cp app/build/outputs/bundle/release/app-release.aab "$ROOT/build/MapaDoBraco.aab"
  echo "ok: build/MapaDoBraco.apk e build/MapaDoBraco.aab (assinados, versão 1.0.$VC)"
else
  ./gradlew --no-daemon -q assembleDebug
  cp app/build/outputs/apk/debug/app-debug.apk "$ROOT/build/MapaDoBraco.apk"
  echo "ok: build/MapaDoBraco.apk (teste, sem assinatura de loja, versão 1.0.$VC)"
fi

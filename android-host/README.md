# Android hosts for Bunsho, Hyokeisan and Zuhyo

Build each browser candidate from its owning repository using its pinned Amu
compiler and browser build instructions. Run the host build from the app
checkout and pass paths to this shared Office repository and the Kotoba source.

```sh
node OFFICE_REPO/android-host/check-ui.mjs
npm --prefix OFFICE_REPO/android-host/vendor/awai-ui ci
npm --prefix OFFICE_REPO/android-host/vendor/awai-ui run build
node OFFICE_REPO/android-host/prepare.mjs bunsho BROWSER_BUILD KOTOBA_REPO .agent-output/bunsho
cd .agent-output/bunsho
npm ci
npm run tauri -- android init --ci
mkdir -p src-tauri/gen/android/app/src/main/java/network/awai/office
cp OfficeBackupPlugin.kt src-tauri/gen/android/app/src/main/java/network/awai/office/
mkdir -p src-tauri/icons
cp src-tauri/gen/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png src-tauri/icons/icon.png
npm run tauri -- android build --apk --target x86_64 --debug
```

Repeat with `hyokeisan` and `zuhyo` and separate output directories. Use
`aarch64` for ARM Android. Each app has its own launcher and WebView storage.
The host packages the existing editor and binds the Wasm bundle to the browser
build receipt. It copies the digest-pinned canonical Kotoba runtime and
declares no external operations. Build only from trusted source checkouts.

The backup button opens Android's system save dialog. It writes a fresh
backup to local device storage and verifies the bytes before displaying success.
The resulting file can be added to Awai Drive with Drive's file picker.

These are offline development APKs. Publishing signed packages and saving
Office snapshots directly to Drive require separate integration. Browser
candidate storage does not migrate automatically into the Android app.

The app repositories own their Android release and signing. This helper originated
in [Awai OS PR #251](https://github.com/network-awai/awai-os/pull/251) and includes
its native local backup. Awai UI is vendored as a digest-pinned dependency.

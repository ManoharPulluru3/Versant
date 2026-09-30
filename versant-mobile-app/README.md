# ElytEdu — Student Mobile App (Versant monorepo)

React Native CLI app for the ElytEdu student portal. Production API: `https://api.elytedu.com/api` (tenant headers + Bearer token when auth is wired). Local dev defaults to **`versant-api`** on port `4000`.

| Item | Path |
|------|------|
| This app | `versant-mobile-app/` |
| Monorepo root | `Versant App/` |
| Local API | `versant-api/` |

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **>= 22.11** (see `package.json` engines) |
| npm | 10+ |
| JDK | **17** (Android) |
| Android Studio | SDK 36, emulator or physical device |
| Xcode + CocoaPods | macOS only (iOS) |

## Android dev environment (required on Linux)

Bundled **JDK 17** and **ADB/SDK** live under **`.tools/`** at the monorepo root (not committed). One-time link from the ElytEdu platform repo:

```bash
cd "/home/manohar/Documents/My Projects/Versant App"
bash scripts/setup-android-tools.sh
```

Load tools in **every new terminal** before Android commands:

```bash
cd "/home/manohar/Documents/My Projects/Versant App"
source scripts/android-dev-env.sh
```

You should see:

```
Android dev environment loaded:
  JAVA_HOME=.../.tools/jdk17
  ANDROID_HOME=.../.tools/android-sdk
```

Verify:

```bash
java -version
adb version
adb devices
```

Run this **before** `npm run android`. npm commands run from **`versant-mobile-app/`**.

## Quick start

```bash
# 1. Load Android tools (every terminal)
cd "/home/manohar/Documents/My Projects/Versant App"
source scripts/android-dev-env.sh

# 2. Optional: local API (smoke test /health)
cd versant-api && npm install && cp -n .env.example .env && npm run dev

# 3. Install + start Metro
cd ../versant-mobile-app
npm install
npm run start:reset
```

Keep Metro running. In a **second terminal**:

```bash
source "/home/manohar/Documents/My Projects/Versant App/scripts/android-dev-env.sh"
cd "/home/manohar/Documents/My Projects/Versant App/versant-mobile-app"
npm run android    # emulator or USB device
# or
npm run ios        # macOS + Xcode only
```

## Daily development

**Terminal 1 — Metro**

```bash
source "/home/manohar/Documents/My Projects/Versant App/scripts/android-dev-env.sh"
cd versant-mobile-app
npm run start:reset
```

**Terminal 2 — Android**

```bash
source "/home/manohar/Documents/My Projects/Versant App/scripts/android-dev-env.sh"
cd versant-mobile-app
npm run android
```

`prestart`, `preandroid`, and `preios` run `prepare-dev` + `sync-icons` (Iconify hook placeholder until icons are added).

## Useful scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro (prepare + sync-icons first) |
| `npm run start:reset` | Metro with cache reset |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run sync-icons` | Regenerate Iconify bundle from `src/` |
| `npm run verify-icons` | Same as `sync-icons` |
| `npm test` | Jest |
| `npm run lint` | ESLint |
| `npm run build:apk` | Release APK (~30–35 MB, arm64) |
| `npm run build:apk:full` | Release APK, all ABIs (~70+ MB) |

## Build release APK (no Metro after install)

**One-time:** load Android env + `npm install` in `versant-mobile-app`.

```bash
source "/home/manohar/Documents/My Projects/Versant App/scripts/android-dev-env.sh"
cd versant-mobile-app
npm run build:apk
```

**Output:**

```
versant-mobile-app/android/app/build/outputs/apk/release/app-release.apk
```

**Install on device:**

```bash
adb devices
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

| | `npm run android` | `npm run build:apk` |
|--|-------------------|---------------------|
| Metro required | Yes (dev) | No |
| JS in APK | Loaded from Metro | Bundled |
| Use for | Daily dev | Sideload / share |

Release builds use the **debug keystore** until you configure production signing ([RN signed APK](https://reactnative.dev/docs/signed-apk-android)).

## API and environment

`src/config/env.js`:

```js
API_URL: 'https://api.elytedu.com/api'   // release / USE_PRODUCTION_API_IN_DEV
BASE_DOMAIN: 'elytedu.com'
```

In **`__DEV__`**, the app uses local `versant-api` at `http://127.0.0.1:4000`. On a phone or emulator, run `adb reverse tcp:4000 tcp:4000` so that address reaches the computer. Set `USE_PRODUCTION_API_IN_DEV = true` in `env.js` to use the production API instead.

College requests will send:

- `X-Tenant-Host: {subdomain}.elytedu.com`
- `Authorization: Bearer {student token}`

No `.env` file is required for default production URLs.

## Android setup (first time)

**Option A — bundled tools (recommended)**

1. `bash scripts/setup-android-tools.sh` from monorepo root  
2. `source scripts/android-dev-env.sh`  
3. Emulator or USB debugging → `adb devices`  
4. `npm run android` from `versant-mobile-app/`

**Option B — system SDK**

Install Android Studio, SDK 36, set `JAVA_HOME` (17) and `ANDROID_HOME`, then skip `.tools`.

## iOS (macOS)

```bash
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios
```

## Project layout

```
versant-mobile-app/
  android/
  ios/
  src/
    config/env.js       # API URL + tenant domain
    api/                # HTTP helpers
    screens/            # (migrate from versant-web-app/src/screens)
    components/
  scripts/
    prepare-dev.js
    sync-iconify-icons.js
  App.tsx
  index.js
```

## Troubleshooting

**`JAVA_HOME` / `adb: not found`**

```bash
bash scripts/setup-android-tools.sh
source scripts/android-dev-env.sh
```

**Stale Metro bundle**

```bash
npm run start:reset
```

**Gradle clean**

```bash
source ../scripts/android-dev-env.sh
cd android && ./gradlew clean && cd ..
npm run android
```

**Health check fails on emulator**

Start `versant-api` (`npm run dev`) or set `USE_PRODUCTION_API_IN_DEV = true` in `env.js`.

**Node version**

```bash
nvm install 22 && nvm use 22
```

## Stack

- React Native 0.87 · React 19  
- **NativeWind v4** + Tailwind CSS 3 (`global.css`, `className` on RN components)  
- **React Navigation** (native stack; bottom tabs when main shell lands)  
- **react-native-reanimated** · **gesture-handler** · **screens** · **safe-area-context**  
- **Iconify** (`mdi:…` via `Icon` + `npm run sync-icons`)  
- **socket.io-client** (`src/services/socket.ts`)  
- **AsyncStorage** (session — wire with auth screens)

### Icons (Iconify)

Use `mdi:home` style names on the `Icon` component. Icons are scanned from `src/` on every `npm start` / `npm run android`. After adding new icon ids:

```bash
npm run sync-icons && npm run start:reset
```

Generated (do not edit): `src/generated/iconify-bundle.js`, `iconify.icons.generated.json`

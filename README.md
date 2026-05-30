# Notes App

A location-aware note-taking app built with React Native. Create notes, pin them to a map using GPS, and browse via an interactive map with automatic marker clustering.

## Tech Stack & Reasoning

- **React Navigation** (native-stack + bottom-tabs) — standard navigation with typed params, stack inside tabs
- **Redux Toolkit + redux-persist** — predictable state management, notes survive app restarts via AsyncStorage
- **NativeWind (Tailwind CSS)** — utility-first styling, no StyleSheet.create, consistent design tokens
- **@react-native-community/geolocation** — native GPS access for pinning notes
- **react-native-webview + Leaflet** — renders the map without native map SDKs (no API key required)

## How to Install & Run

```sh
npm install
npm start               # Metro dev server
npm run android         # Android device/emulator
```

For iOS: `cd ios && bundle exec pod install && cd ..` then `npm run ios`. Before running iOS, manually fill `NSLocationWhenInUseUsageDescription` in `ios/notesApp/Info.plist`.

## Architectural Decisions

- **Permission guard at app root** — app is unusable until location permission is granted, ensuring `getCurrentLocation()` always has access
- **Async location after note creation** — note is saved immediately with `null` coordinates, then `getCurrentLocation()` fires and `updateNote` merges the coordinates asynchronously
- **Custom marker clustering** — Leaflet markers grouped by rounded coordinates (`toFixed(4)` ≈ 11m), clusters show a green badge with note count and a clickable title popup
- **Single reducer kept behind `combineReducers`** — avoids state shape migration issues with persisted AsyncStorage data

## Known Bugs / Incomplete

- iOS location fails out of the box — `NSLocationWhenInUseUsageDescription` is empty in `Info.plist`
- Map tiles load from CDN — requires internet, no offline fallback
- `npm test` fails — Jest can't parse `global.css`; needs `moduleNameMapper` for `.css` files
- Location timeout with GPS off — no user-facing feedback beyond console log

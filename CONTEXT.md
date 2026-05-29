# notesApp — Context

## Current Phase
Phase 1: Foundation (completed)

## Architecture
- **Framework**: React Native CLI 0.85.3, New Architecture enabled, Hermes engine
- **State**: Redux Toolkit + redux-persist + AsyncStorage
- **Styling**: NativeWind (Tailwind CSS v3) — utility classes only
- **Navigation**: @react-navigation/native-stack with typed params
- **Testing**: Jest with @react-native/jest-preset

## Key Files
| File | Purpose |
|------|---------|
| `src/App.tsx` | Entry point: Provider + PersistGate + NavigationContainer |
| `src/store/notesSlice.ts` | Note type, slice, prepare callback (colocated) |
| `src/store/store.ts` | configureStore + persist config |
| `src/store/hooks.ts` | Typed useAppDispatch / useAppSelector |
| `src/navigation/AppNavigator.tsx` | Stack navigator with typed param list |
| `src/screens/NotesListScreen.tsx` | Note list with inline create form, FAB |
| `src/screens/NoteDetailScreen.tsx` | View/edit note, save/delete actions |
| `src/components/NoteCard.tsx` | Card with tap (navigate), long-press (delete) |
| `src/global.css` | Tailwind directives — must be imported in App.tsx |
| `tailwind.config.js` | App theme: colors, spacing, fonts |

## Conventions
- **Styling**: NativeWind utility classes only, no StyleSheet.create
- **State**: Redux Toolkit slices colocate their data model + reducers
- **Navigation types**: Defined in navigator, imported by screens
- **Testing**: Jest with @react-native/jest-preset
- **Components**: Pressable preferred over TouchableOpacity
- **Imports**: Named exports for screens/components, default exports for App

## Constraints
- **Maximum 5 file edits per session run** — batch changes to stay within this limit. Plan before executing.

## Gotchas
- Jest needs `transformIgnorePatterns` updated when adding ESM dependencies
- `PersistGate` shows no loading state during hydration (acceptable for AsyncStorage)
- `KeyboardAvoidingView` with `behavior="padding"` on iOS only
- `crypto.randomUUID()` requires Hermes — verified compatible
- Release builds still use debug keystore (pre-existing, not yet addressed)

## Next Up (Phase 2)
- Refactor components to use NativeWind (Phase 2)
- Add loading component for PersistGate (Phase 2)
- Add unit tests for notesSlice (Phase 2)
- Upgrade ESLint to v9 (deferred)

## History
See `HISTORY.md` for full changelog.

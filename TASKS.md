# Tasks

## Phase 1: Baseline Setup

### Tooling & Config
- [x] Upgrade Prettier to v3 + update `.prettierrc.js`
- [x] Enable strict TypeScript in `tsconfig.json`

### Dependency Cleanup
- [x] Remove `@react-native/new-app-screen`
- [x] Install Redux Toolkit, react-redux, redux-persist, AsyncStorage, react-native-uuid
- [x] Strip boilerplate from root `App.tsx`

### State & Storage Layer
- [x] `src/types/note.ts` — Note interface
- [x] `src/store/notesSlice.ts` — Redux slice (addNote, updateNote, deleteNote)
- [x] `src/store/store.ts` — configureStore + redux-persist + AsyncStorage

### UI & Navigation
- [x] `src/components/NoteCard.tsx` — reusable card
- [x] `src/screens/NotesListScreen.tsx` — FlatList + FAB
- [x] `src/screens/NoteDetailScreen.tsx` — view/edit
- [x] `src/navigation/AppNavigator.tsx` — stack navigator

### Entry Point & Tests
- [x] `src/App.tsx` — Provider + PersistGate + NavigationContainer
- [x] Update root `App.tsx` → re-export from `src/App.tsx`
- [x] Update `__tests__/App.test.tsx`

### Verification
- [x] Run `npm run lint`
- [x] Run `npx tsc --noEmit`
- [x] Run `npm test`

---

## Phase 2: Polish (next)
- [ ] Refactor components to use NativeWind (Phase 2)
- [ ] Add loading component for PersistGate (Phase 2)
- [ ] Add unit tests for notesSlice (Phase 2)
- [ ] Upgrade ESLint to v9 (deferred)

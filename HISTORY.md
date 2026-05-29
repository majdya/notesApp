# History

## 2026-05-28 — Baseline Setup

### Summary
Set up the initial project scaffold with Redux Toolkit, navigation, and basic CRUD
screens. This was the starting point before any refinement.

### Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | Redux Toolkit | Per technical requirements |
| Persistence | redux-persist + AsyncStorage | Simple, no native module linking needed |
| Navigation | @react-navigation/native-stack | Standard for RN, typed params |
| ID generation | react-native-uuid | Unique IDs for local notes |

### Completed
- Installed Redux Toolkit, react-redux, redux-persist, AsyncStorage, react-native-uuid
- Created src/ with store, screens, components, navigation, types structure
- NotesListScreen with FlatList, inline create form, FAB
- NoteDetailScreen with view/edit, save, delete
- NoteCard with tap to navigate, long-press to delete
- Strict TypeScript enabled
- Jest smoke test passing

### Open Issues
- Business logic (ID gen, timestamps) lives in UI layer — needs refactor
- No keyboard handling on iOS
- Hardcoded colors throughout
- ESLint v8 (maintenance mode)
- No unit tests for slice

---

## 2026-05-29 — Phase 1: Foundation

### Summary
Set up NativeWind for consistent styling, colocated Note type with the slice,
added keyboard handling, simplified the entry point, and removed unnecessary
UUID dependency.

### Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling | NativeWind + Tailwind CSS | Consistent design tokens, reduced boilerplate, maintainable |
| Note type location | Colocated in notesSlice | Single source of truth next to state management |
| ID generation | crypto.randomUUID() | Built-in, no extra dependency needed |
| Entry point | Single src/App.tsx | Removed unnecessary re-export indirection |
| Keyboard handling | KeyboardAvoidingView | Standard RN approach for iOS |
| Persistence errors | Silent degradation | Better UX, data still in Redux |
| TouchableOpacity | Pressable | Modern RN primitive, consistent with NoteCard |

### Completed
- Installed NativeWind + Tailwind CSS
- Created tailwind.config.js with app theme
- Updated babel.config.js + metro.config.js
- Moved Note type into notesSlice with prepare callback
- Deleted types/note.ts and types/ folder
- Merged entry point: src/App.tsx is single source, updated index.js, deleted root App.tsx
- Added KeyboardAvoidingView to both screens
- Replaced TouchableOpacity with Pressable on FAB
- Removed react-native-uuid dependency
- Added typecheck script to package.json
- Updated test import path

### Open Issues
- No loading state for PersistGate during hydration
- No unit tests for notesSlice
- Components still use StyleSheet.create (Phase 2)

---

## 2026-05-29 — Phase 2: Polish

### Summary
TBD

### Decisions
TBD

### Completed
TBD

### Open Issues
TBD

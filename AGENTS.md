# Agents — Rules & Conventions

## Code Style
- No comments in source files unless requested
- Named exports for screens/components, default export for App
- Pressable over TouchableOpacity
- NativeWind utility classes only — no StyleSheet.create
- Redux Toolkit slices colocate data model + reducers
- Navigation types defined in navigator, imported by screens
- Prefer editing existing files over creating new ones
- Only create documentation files if explicitly requested
- No emojis in code unless user asks

## Process
- Maximum 5 file edits per session run — batch changes to stay within limit
- Read files before editing (tool will enforce this)
- Run lint + typecheck + test after making changes
- Only commit when explicitly asked — never commit proactively
- Check existing libraries/frameworks before introducing new dependencies
- Verify the testing approach from README or codebase before running tests
- Use Read/Write/Edit for file operations — never use bash for file content
- Use Glob for file search, Grep for content search
- Chain sequential commands with `&&`, run independent commands in parallel

## Communication
- Be concise: fewer than 4 lines unless asked for detail
- No preamble, postamble, or explanation of code unless user asks
- Output text directly — never use bash to communicate

## Architecture
- State: Redux Toolkit + redux-persist + AsyncStorage
- Styling: NativeWind v4 (Tailwind CSS v3)
- Navigation: @react-navigation/native-stack with typed params
- Testing: Jest with @react-native/jest-preset

## Project Gotchas
- NativeWind `tailwind.config.js` must use `require('nativewind/preset')` (module object), not `require.resolve` (string path)
- `nativewind/babel` is a **preset**, not a plugin (returns a config object, not a visitor)
- `withNativeWind(config)` needs `{ input: path.resolve(__dirname, 'src/global.css') }` to route CSS through Tailwind CLI instead of Babel
- Jest needs `transformIgnorePatterns` updated for `react-native-css-interop` (NativeWind) and other ESM deps
- AsyncStorage console error in Jest tests is expected (native module unavailable in test runner)
- `KeyboardAvoidingView` with `behavior="padding"` on iOS only
- `PersistGate` shows no loading state during hydration (acceptable for AsyncStorage)
- Release builds still use debug keystore (pre-existing)
- ESLint v8 warns on inline styles in `contentContainerStyle` — expected for FlatList/ScrollView

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: {
      prepare: (title: string, content: string) => ({
        payload: {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 10),
          title: title.trim() || 'Untitled',
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      reducer: (state, action: PayloadAction<Note>) => {
        state.notes.unshift(action.payload);
      },
    },
    updateNote(
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>,
    ) {
      const note = state.notes.find(n => n.id === action.payload.id);
      if (note) {
        note.title = action.payload.title;
        note.content = action.payload.content;
        note.updatedAt = new Date().toISOString();
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter(n => n.id !== action.payload);
    },
  },
});

export const { addNote, updateNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;

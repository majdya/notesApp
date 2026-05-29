import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../types/note';

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
    addNote(state, action: PayloadAction<Note>) {
      state.notes.unshift(action.payload);
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

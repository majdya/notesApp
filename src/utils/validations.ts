export const NOTE_TITLE_MAX = 100;
export const NOTE_CONTENT_MAX = 10_000;

export function validateNoteTitle(title: string): string | null {
  if (!title.trim()) return 'Title is required.';
  if (title.trim().length > NOTE_TITLE_MAX)
    return `Title must be under ${NOTE_TITLE_MAX} characters.`;
  return null;
}

export function validateNoteContent(content: string): string | null {
  if (content.length > NOTE_CONTENT_MAX)
    return `Content must be under ${NOTE_CONTENT_MAX} characters.`;
  return null;
}

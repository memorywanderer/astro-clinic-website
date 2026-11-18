/** Split plain text without changing Unicode, punctuation, or whitespace. */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/u).filter(Boolean);
}

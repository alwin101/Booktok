export interface Excerpt {
  id: number;
  text: string;
}

export interface ExcerptResponse {
  excerpts: Excerpt[];
  hasMore: boolean;
}

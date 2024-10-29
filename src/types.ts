export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export type SnippetCategory = string;

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  coverImage: string;
  category: SnippetCategory;
  createdAt: Date;
  updatedAt: Date;
}
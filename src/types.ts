export interface Book {
  id: string;
  title: string;
  genre: string;
  targetAudience: string;
  description: string;
  outline?: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  title: string;
  summary: string;
  order: number;
}

export interface Character {
  id: string;
  bookId: string;
  name: string;
  role: string; // 'protagonist' | 'antagonist' | 'supporting'
  description: string;
  traits: string;
  backstory: string;
}

export interface Manuscript {
  id: string;
  bookId: string;
  chapterId: string;
  title: string;
  content: string;
  lastEdited: string;
}

export interface PublishingProject {
  id: string;
  bookId: string;
  kdpFormat: 'paperback' | 'hardcover' | 'ebook';
  isbn: string;
  coverPlan: string;
  categories: string[];
  keywords: string[];
  metadata: string;
}

export interface LaunchCampaign {
  id: string;
  bookId: string;
  launchDate: string;
  status: 'planning' | 'active' | 'completed';
  calendarEvents: { id: string; date: string; title: string; task: string }[];
  socialPosts: { id: string; channel: string; text: string }[];
}

export interface Product {
  id: string;
  title: string;
  type: 'journal' | 'planner' | 'workbook' | 'coloring_book' | 'pdf';
  description: string;
  pagesCount: number;
  contentStructure: string;
}

export interface Course {
  id: string;
  title: string;
  audience: string;
  description: string;
  syllabus: { id: string; moduleTitle: string; lessons: string[] }[];
}

export interface AuthorWorkspaceState {
  books: Book[];
  chapters: Chapter[];
  manuscripts: Manuscript[];
  characters: Character[];
  publishingProjects: PublishingProject[];
  launches: LaunchCampaign[];
  products: Product[];
  courses: Course[];
}

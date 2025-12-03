export enum Phase {
  HOME = 'HOME',
  EMPATHIZE = 'EMPATHIZE',
  DEFINE = 'DEFINE',
  IDEATE = 'IDEATE',
  PROTOTYPE = 'PROTOTYPE',
  TEST = 'TEST',
  SUMMARY = 'SUMMARY'
}

export interface EmpathyMap {
  says: string;
  thinks: string;
  does: string;
  feels: string;
}

export interface DefineCanvas {
  user: string;
  need: string;
  insight: string; // "Because..."
  problemStatement: string;
}

export interface Idea {
  id: string;
  text: string;
  isFavorite: boolean;
}

export interface PrototypeData {
  description: string;
  features: string;
  imageUrl: string | null;
}

export interface TestGrid {
  worked: string;
  notWorked: string;
  questions: string;
  ideas: string;
}

export interface ProjectData {
  studentName: string;
  projectName: string;
  empathy: EmpathyMap;
  define: DefineCanvas;
  ideate: Idea[];
  prototype: PrototypeData;
  test: TestGrid;
}

export const INITIAL_PROJECT_DATA: ProjectData = {
  studentName: '',
  projectName: '',
  empathy: { says: '', thinks: '', does: '', feels: '' },
  define: { user: '', need: '', insight: '', problemStatement: '' },
  ideate: [],
  prototype: { description: '', features: '', imageUrl: null },
  test: { worked: '', notWorked: '', questions: '', ideas: '' }
};
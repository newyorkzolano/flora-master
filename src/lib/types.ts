
export type QuizQuestionOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: number;
  questionText: string;
  options: QuizQuestionOption[];
};

export type GameImage = {
  id: number;
  name: string;
  url: string;
  type: 'leaf' | 'tree' | 'plant';
  options?: QuizQuestionOption[];
};

export type LeafTreePair = {
  leafId: number;
  treeId: number;
};

export type GameData = {
  questions: QuizQuestion[];
  images: GameImage[];
  pairs: LeafTreePair[];
};

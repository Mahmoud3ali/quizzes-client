import DB_JSON from "./db.json";
import { z } from "zod";
import { getUniqueId, shuffle } from "../utils";

const QuestionAnswerSchema = z
  .object({
    id: z.number(),
    // for security reasons, BE should strip this to a separate endpoint. Ignoring this for simplicity of the demo
    is_true: z.boolean(),
    text: z.string(),
  })
  // transform is used to create abstraction between the API and the UI, so we can change the API response without affecting the UI
  .transform((data) => ({
    id: data.id,
    text: data.text,
    isCorrect: data.is_true,
  }));

const QuestionSchema = z
  .object({
    answer_id: z.string().nullable(),
    feedback_false: z.string(),
    feedback_true: z.string(),
    id: z.number(),
    text: z.string(),
    answers: z.array(QuestionAnswerSchema),
  })
  .transform((data) => ({
    id: data.id,
    questionHead: data.text,
    answers: data.answers.sort(shuffle),
    correctFeedback: data.feedback_true,
    incorrectFeedback: data.feedback_false,
    correctAnswerId: data.answer_id,
  }));

const QuizSchema = z
  .object({
    id: z.number(),
    questions_answers: z.array(QuestionSchema),
    title: z.string(),
    description: z.string().nullable(),
    url: z.string(),
  })
  .transform((data) => {
    const youtubeId = data.url.split("v=")[1];
    return {
      id: data.id,
      questions: data.questions_answers.sort(shuffle),
      title: data.title,
      description: data.description || "",
      url: `https://www.youtube.com/embed/${youtubeId}`,
    };
  });

const QuizzesResponseSchema = z.array(QuizSchema);

export type RawQuestionAnswer = z.input<typeof QuestionAnswerSchema>;
export type QuestionAnswer = z.output<typeof QuestionAnswerSchema>;
export type RawQuestion = z.input<typeof QuestionSchema>;
export type Question = z.output<typeof QuestionSchema>;
export type RawQuiz = z.input<typeof QuizSchema>;
export type Quiz = z.output<typeof QuizSchema>;

const updateDB = (updatedQuizzes: RawQuiz[]) => {
  localStorage.setItem("db", JSON.stringify(updatedQuizzes));
};

const getLocalDB = (): RawQuiz[] => {
  // using this approach to simulate a database, in a real-world scenario, this would be an API call to the backend & real DB after auth layer
  // I could use fs.writeFileSync to write to a file, but this won't work on serverless hosting like Vercel
  // but in case we need to change, we can edit the code in one place
  const userDB = localStorage.getItem("db");

  if (!userDB) {
    updateDB(DB_JSON);
    return DB_JSON;
  }

  return JSON.parse(userDB);
};

export const listQuizzes = async () => {
  const response = await new Promise<RawQuiz[]>((resolve) =>
    // simulating network delay
    setTimeout(() => resolve(getLocalDB()), 1000)
  );

  return QuizzesResponseSchema.parse(response);
};

export const createQuiz = async (_quiz: RawQuiz) => {
  const quiz: RawQuiz & {
    created: string;
    modified: string;
    score: number | null;
  } = {
    ..._quiz,
    id: getUniqueId(),
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    score: null,
  };
  const oldQuizzes = getLocalDB();
  const updatedQuizzes = [...oldQuizzes, quiz];

  updateDB(updatedQuizzes);
  const newQuiz = await new Promise((resolve) =>
    setTimeout(() => resolve(QuizSchema.parse(quiz)), 1000)
  );

  // returning the new quiz to simulate the API response
  // this can be use to surgically update the UI without refetching the whole list
  return newQuiz;
};

export const editQuiz = async (_quiz: RawQuiz) => {
  const quiz: RawQuiz & {
    modified: string;
  } = {
    ..._quiz,
    modified: new Date().toISOString(),
  };
  const oldQuizzes = getLocalDB();
  const updatedQuizzes = oldQuizzes.map((q) => (q.id === quiz.id ? quiz : q));

  updateDB(updatedQuizzes);
  const newQuiz = await new Promise((resolve) =>
    setTimeout(() => resolve(QuizSchema.parse(quiz)), 1000)
  );

  // returning the new quiz to simulate the API response
  // this can be use to surgically update the UI without refetching the whole list
  return newQuiz;
};

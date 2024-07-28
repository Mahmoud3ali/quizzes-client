import DB_JSON from "./db.json";
import { z } from "zod";

const QuestionAnswerSchema = z
  .object({
    id: z.number(),
    // for security reasons, BE should strip this to a separate endpoint. Ignoring this for simplicity of the demo
    is_true: z.boolean(),
    text: z.string(),
  })
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
    answers: data.answers,
    correctFeedback: data.feedback_true,
    incorrectFeedback: data.feedback_false,
    correctAnswerId: data.answer_id,
  }));

const QuizSchema = z
  .object({
    id: z.number(),
    questions_answers: z.array(QuestionSchema),
    title: z.string(),
  })
  .transform((data) => ({
    id: data.id,
    questions: data.questions_answers,
    title: data.title,
  }));

const QuizzesResponseSchema = z.array(QuizSchema);

export type RawQuestionAnswer = z.input<typeof QuestionAnswerSchema>;
export type QuestionAnswer = z.output<typeof QuestionAnswerSchema>;
export type RawQuestion = z.input<typeof QuestionSchema>;
export type Question = z.output<typeof QuestionSchema>;
export type RawQuiz = z.input<typeof QuizSchema>;
export type Quiz = z.output<typeof QuizSchema>;
export const listQuizzes = async () => {
  const response = await new Promise<RawQuiz[]>((resolve) =>
    setTimeout(() => resolve(DB_JSON), 1000)
  );

  return QuizzesResponseSchema.parse(response);
};

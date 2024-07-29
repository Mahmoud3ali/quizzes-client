import { lazy } from "react";

export const NotFoundPage = lazy(() => import("./not-found"));
export const QuizzesPage = lazy(() => import("./quizzes"));
export const SolveQuizPage = lazy(() => import("./solve-quiz"));
export const CreateQuizPage = lazy(() => import("./create-quiz"));

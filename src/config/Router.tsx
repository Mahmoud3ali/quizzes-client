import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MainLayout } from "../pages/components";
import {
  CreateQuizPage,
  NotFoundPage,
  QuizzesPage,
  SolveQuizPage,
  EditQuizPage,
} from "../pages";
import type { PropsWithChildren } from "react";

export const routes = {
  notFound: { path: "/not-found", Component: NotFoundPage },
  newQuiz: {
    path: "/create-quiz",
    name: "New Quiz",
    Component: CreateQuizPage,
  },
  myQuizzes: {
    path: "/",
    name: "My Quizzes",
    Component: QuizzesPage,
  },
  solveQuiz: {
    path: "/solve-quiz/:id",
    pathWithId: (id: number) => `/solve-quiz/${id.toString()}`,
    name: "Solve Quiz",
    Component: SolveQuizPage,
  },
  editQuiz: {
    path: "/edit-quiz/:id",
    pathWithId: (id: number) => `/edit-quiz/${id.toString()}`,
    name: "Edit Quiz",
    Component: EditQuizPage,
  },
} as const;

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
        {Object.values(routes).map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  );
};

export const RouterConfig = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <AppRoutes />
      {children}
    </BrowserRouter>
  );
};

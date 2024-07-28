import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MainLayout } from "../pages/components";
import { NotFoundPage, QuizzesPage } from "../pages";
import type { PropsWithChildren } from "react";

export const routes = {
  notFound: { path: "/not-found", Component: NotFoundPage },
  newQuiz: {
    path: "/create-quiz",
    name: "New Quiz",
    Component: () => <main>New Quiz</main>,
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
    Component: () => <main>Solve Quiz</main>,
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

import { Routes, Route, BrowserRouter } from "react-router-dom";
import { NotFoundPage } from "../pages";
import { MainLayout } from "../pages/components";

type Props = {
  children?: React.ReactNode;
};

const Home = {
  path: "/",
  name: "Home",
  Component: () => <></>,
};
export const routes = { home: Home };

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

export const RouterConfig = ({ children }: Props) => {
  return (
    <BrowserRouter>
      <AppRoutes />
      {children}
    </BrowserRouter>
  );
};

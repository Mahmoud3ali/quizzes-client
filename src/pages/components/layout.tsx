import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { routes } from "../../config";

const NavBar = () => {
  const NAVIGATION = [
    {
      name: "New Quiz",
      path: routes.newQuiz.path,
    },
    {
      name: "My Quizzes",
      path: routes.myQuizzes.path,
    },
  ] as const;
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between">
        <Link
          to={routes.myQuizzes.path}
          className="flex items-center space-x-3"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Crocosoft
          </span>
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {NAVIGATION.map((nav) => (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className="font-bold block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export function MainLayout() {
  const location = useLocation();

  if (location.pathname === routes.notFound.path) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <NavBar />
      <section className="mt-12 px-12">
        {/* routes are lazy loaded, so adding suspense here to display placeholder till route chunk is loaded */}
        {/* we can support prefetching if bundles got bigger, just for simplicity I didn't add it here */}
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </section>
    </div>
  );
}

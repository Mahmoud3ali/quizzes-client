import { useParams, useNavigate } from "react-router-dom";
import { UpdateQuizComponent } from "./components/update-quiz";
import { useQuiz } from "../hooks";
import { useEditQuiz } from "../hooks/useEditQuiz";
import { routes } from "../config";

const EditQuizPage = () => {
  const navigate = useNavigate();
  const { id: quizId } = useParams();
  const { data: quizData, isFetched } = useQuiz({ quizId });
  const { mutate: createQuiz } = useEditQuiz({
    onSuccess: () => navigate(routes.myQuizzes.path),
  });

  if (!isFetched || !quizData) {
    return <div>Loading...</div>;
  }

  return <UpdateQuizComponent onSubmit={createQuiz} quiz={quizData} />;
};

export default EditQuizPage;

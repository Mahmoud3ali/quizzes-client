import { useNavigate } from "react-router-dom";
import { useCreateQuiz } from "../hooks/useCreateQuiz";
import { UpdateQuizComponent } from "./components/update-quiz";
import { routes } from "../config";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { mutate: createQuiz } = useCreateQuiz({
    onSuccess: () => navigate(routes.myQuizzes.path),
  });

  return <UpdateQuizComponent onSubmit={createQuiz} />;
};

export default CreateQuizPage;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuizzes } from "./useQuizzes";
import { Quiz } from "../services";

export const useQuiz = ({ quizId }: { quizId?: string }) => {
  const queryClient = useQueryClient();

  const { isFetched } = useQuizzes();

  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => {
      const quizzes = queryClient.getQueryData(["quizzes"]) as
        | Quiz[]
        | undefined;

      if (!quizzes) {
        return;
      }

      return quizzes.find((quiz) => quiz.id.toString() === quizId) as
        | Quiz
        | undefined;
    },
    enabled: !!quizId && isFetched,
  });
};

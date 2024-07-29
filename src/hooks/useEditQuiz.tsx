import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editQuiz, type RawQuiz } from "../services";

export const useEditQuiz = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["quizzes"],
    mutationFn: async (quiz: RawQuiz) => {
      const response = await editQuiz(quiz);

      // Invalidate the quizzes query to refetch the data with the new quiz
      // This will also refetch the quiz query since it depends on the quizzes query
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
        refetchType: "all",
      });
      return response;
    },
    onSuccess,
  });
};

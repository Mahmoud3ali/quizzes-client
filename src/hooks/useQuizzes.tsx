import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listQuizzes } from "../services";

export const useQuizzes = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await listQuizzes();

      // Invalidate the quiz query to refetch the data with the new quiz
      // we can preload each quiz query here, but for simplicity, we'll just invalidate the quiz query
      queryClient.invalidateQueries({
        queryKey: ["quiz"],
        refetchType: "all",
      });

      return res;
    },
  });
};

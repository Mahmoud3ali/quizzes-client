import { useQuery } from "@tanstack/react-query";
import { listQuizzes } from "../services";

export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: listQuizzes,
  });
};

import { useNavigate } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useQuizzes } from "../hooks";
import { routes } from "../config";

const QuizzesTableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-[52.5px] w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-[52.5px] w-full" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const QuizzesPage = () => {
  const navigate = useNavigate();
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes();

  if (quizzesLoading || !quizzes) {
    return <QuizzesTableSkeleton />;
  }

  return (
    <main>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-white">
            <TableHead>Identifier</TableHead>
            <TableHead>Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow
              key={quiz.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(routes.solveQuiz.pathWithId(quiz.id))}
            >
              <TableCell className="font-medium">{quiz.id}</TableCell>
              <TableCell>{quiz.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default QuizzesPage;

import { useParams } from "react-router-dom";
import { useQuiz } from "../hooks";
import type { Question } from "../services";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { useState } from "react";

const QuestionComponent = ({ question }: { question: Question }) => {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <li>
      <h5 className="text-2xl">{question.questionHead}</h5>
      <RadioGroup className="mt-4 ml-4" onValueChange={(id) => setSelected(id)}>
        {question.answers.map((answer) => {
          const isOptionSelected = selected === answer.id.toString();
          const isOptionCorrect = answer.isCorrect;
          const solvedEmoji = isOptionCorrect ? "✅" : "❌";
          const feedback = isOptionCorrect
            ? question.correctFeedback
            : question.incorrectFeedback;

          return (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={answer.id.toString()}
                  id={answer.id.toString()}
                />
                <Label className="text-lg" htmlFor={answer.id.toString()}>
                  {answer.text}
                </Label>
              </div>
              <p
                className={`text-sm ${
                  isOptionCorrect ? "text-green-500" : "text-red-500"
                } min-h-4`}
              >
                {isOptionSelected ? feedback + " " + solvedEmoji : null}
              </p>
            </div>
          );
        })}
      </RadioGroup>
    </li>
  );
};

const SolveQuizPage = () => {
  const { id: quizId } = useParams();

  const { data: quiz } = useQuiz({ quizId });

  if (!quizId || !quiz) {
    return null;
  }

  return (
    <main>
      <h1 className="text-center text-4xl">{quiz.title}</h1>
      <ul className="mt-8">
        {quiz.questions.map((question) => (
          <QuestionComponent key={question.id} question={question} />
        ))}
      </ul>
    </main>
  );
};

export default SolveQuizPage;

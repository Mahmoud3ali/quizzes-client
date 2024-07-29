import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useCreateQuiz } from "../hooks/useCreateQuiz";
import { RawQuestion, RawQuiz } from "../services";
import { getUniqueId, shuffle } from "../utils";

const QuestionComponent = ({ index }: { index: number }) => {
  const [answerCount, setAnswerCount] = useState(1);
  return (
    <div className="flex flex-col space-y-8">
      <Input
        id={`question-${index}`}
        type="text"
        required={false}
        placeholder={`Question ${index + 1}`}
      />
      <div className="flex flex-row space-x-4">
        <Input
          id={`feedback-true-${index}`}
          type="text"
          className="w-1/2"
          required={false}
          placeholder="Correct feedback ✅"
        />
        <Input
          id={`feedback-false-${index}`}
          type="text"
          className="w-1/2"
          required={false}
          placeholder="Incorrect feedback ❌"
        />
      </div>
      <div className="flex flex-col space-y-2">
        {[...Array(answerCount)].map((_, answerIndex) => {
          const isLast = answerIndex === answerCount - 1;
          return (
            <div key={answerIndex} className="flex flex-row space-x-2">
              <div>
                <Input
                  id={`answer-${index}-${answerIndex}`}
                  className={`w-96 ${isLast ? "border-green-400" : ""}`}
                  type="text"
                  required={false}
                  placeholder={`Answer ${answerIndex + 1}`}
                />
                {isLast && (
                  <p className="text-xs text-green-500 font-bold">
                    This will be the correct answer, it will be shuffled
                  </p>
                )}
              </div>
              {isLast && (
                <>
                  <Button
                    className="rounded-full text-xl px-[16px]"
                    disabled={answerCount === 1}
                    onClick={() => setAnswerCount((p) => p - 1)}
                  >
                    -
                  </Button>
                  <Button
                    className="rounded-full text-xl px-[14px]"
                    onClick={() => setAnswerCount((p) => p + 1)}
                  >
                    +
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const parseQuestion = (
  form: { [key: string]: { value: string } },
  questionIndex: number
): RawQuestion => {
  const question: RawQuestion = {
    id: getUniqueId(),
    text: form[`question-${questionIndex}`].value,
    feedback_false: form[`feedback-false-${questionIndex}`].value,
    feedback_true: form[`feedback-true-${questionIndex}`].value,
    answers: [],
    answer_id: null,
  };

  let answerIndex = 0;
  while (form[`answer-${questionIndex}-${answerIndex}`]) {
    const answer = parseQuestionAnswer(form, questionIndex, answerIndex);
    question.answers.push(answer);
    answerIndex++;
  }

  question.answers[question.answers.length - 1].is_true = true;

  return question;
};

const parseQuestionAnswer = (
  form: { [key: string]: { value: string } },
  questionIndex: number,
  answerIndex: number
) => {
  return {
    id: getUniqueId(),
    text: form[`answer-${questionIndex}-${answerIndex}`].value,
    is_true: false,
  };
};

const CreateQuizPage = () => {
  const { mutate: createQuiz } = useCreateQuiz();
  const [questionsCount, setQuestionsCount] = useState(1);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as unknown as {
      [key: string]: { value: string };
    };

    const quiz: RawQuiz = {
      title: form["title"].value,
      description: form["description"].value || "",
      url: form["url"].value,
      questions_answers: [],
      id: getUniqueId(),
    };

    const questions: RawQuestion[] = [];

    // for loop is used here as it's faster than Array.forEach
    for (let index = 0; index < questionsCount; index++) {
      const question: RawQuestion = parseQuestion(form, index);
      questions.push(question);
    }

    // Shuffle the questions to avoid the answers being in the same order
    createQuiz({ ...quiz, questions_answers: questions.sort(shuffle) });
  };

  return (
    <main className="flex flex-col items-center w-full">
      <form className="flex flex-col items-center w-[80%]" onSubmit={onSubmit}>
        <div className="flex flex-row w-full justify-between">
          <Input
            id="title"
            type="text"
            className="w-1/2"
            required={false}
            placeholder="Quiz Title"
          />
          <Button className="text-xl font-bold px-6" type="submit">
            Save
          </Button>
        </div>

        <Input
          id="url"
          type="url"
          className="self-start w-2/3 mt-4"
          required
          placeholder="Quiz Video URL"
        />

        <Input
          id="description"
          type="text"
          className="min-h-24 self-start mt-4"
          defaultValue=""
          placeholder="Quiz Description"
        />

        <div className="mt-8 flex flex-col w-full space-y-20">
          {[...Array(questionsCount)].map((_, index) => (
            <QuestionComponent key={index} index={index} />
          ))}
        </div>
        <Button
          className="text-xl px-8 py-6 mt-6 self-end"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setQuestionsCount((p) => p + 1);
          }}
        >
          Add
        </Button>
      </form>
    </main>
  );
};

export default CreateQuizPage;

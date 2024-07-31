import { useState } from "react";
import type { RawQuiz, Quiz, Question, RawQuestion } from "../../services";
import { getUniqueId } from "../../utils";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const DEFAULT_ANSWER = {
  id: getUniqueId(),
  text: "",
  isCorrect: true,
};

const DEFAULT_QUESTION = {
  id: getUniqueId(),
  questionHead: "",
  answers: [{ ...DEFAULT_ANSWER }],
  correctAnswerId: null,
  correctFeedback: "",
  incorrectFeedback: "",
};
const DEFAULT_QUIZ: Quiz = {
  id: getUniqueId(),
  title: "",
  description: "",
  url: "",
  questions: [{ ...DEFAULT_QUESTION }],
};

const QuestionComponent = ({
  index,
  question,
}: {
  index: number;
  question: Question;
}) => {
  const [answers, setAnswers] = useState(question.answers);

  return (
    <div className="flex flex-col space-y-8">
      <Input
        id={`question-${index}`}
        type="text"
        required
        placeholder={`Question ${index + 1}`}
        defaultValue={question.questionHead}
      />
      <div className="flex flex-row space-x-4">
        <Input
          id={`feedback-true-${index}`}
          type="text"
          className="w-1/2"
          required
          placeholder="Correct feedback ✅"
          defaultValue={question.correctFeedback}
        />
        <Input
          id={`feedback-false-${index}`}
          type="text"
          className="w-1/2"
          required
          placeholder="Incorrect feedback ❌"
          defaultValue={question.incorrectFeedback}
        />
      </div>
      <div className="flex flex-col space-y-2">
        {answers.map((_answer, answerIndex) => {
          const answerCount = answers.length;
          const isLast = answerIndex === answerCount - 1;
          const answer = question.answers[answerIndex] || {
            id: getUniqueId(),
            text: _answer.text,
            is_true: false,
          };
          return (
            <div key={answerIndex} className="flex flex-row space-x-2">
              <div>
                <Input
                  id={`answer-${index}-${answerIndex}`}
                  className={`w-96 ${isLast ? "border-green-400" : ""}`}
                  type="text"
                  required={answerIndex === 0}
                  placeholder={`Answer ${answerIndex + 1}`}
                  defaultValue={answer.text}
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
                    onClick={() => setAnswers((p) => p.slice(0, -1))}
                  >
                    -
                  </Button>
                  <Button
                    className="rounded-full text-xl px-[14px]"
                    onClick={() =>
                      setAnswers((p) => [...p, { ...DEFAULT_ANSWER }])
                    }
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

export const UpdateQuizComponent = ({
  quiz = { ...DEFAULT_QUIZ },
  onSubmit,
}: {
  quiz?: Quiz;
  onSubmit: (quiz: RawQuiz) => void;
}) => {
  const [questions, setQuestions] = useState<Question[]>(quiz.questions);

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

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as unknown as {
      [key: string]: { value: string };
    };

    const updatedQuiz: RawQuiz = {
      title: form["title"].value,
      description: form["description"].value || "",
      url: form["url"].value,
      questions_answers: [],
      id: quiz.id,
    };

    const updatedQuestions: RawQuestion[] = [];

    for (let index = 0; index < questions.length; index++) {
      const question: RawQuestion = parseQuestion(form, index);
      updatedQuestions.push(question);
    }

    onSubmit({
      ...updatedQuiz,
      questions_answers: updatedQuestions,
    });
  };

  return (
    <main className="flex flex-col items-center w-full">
      <form className="flex flex-col items-center w-[80%]" onSubmit={_onSubmit}>
        <div className="flex flex-row w-full justify-between">
          <Input
            id="title"
            type="text"
            className="w-1/2"
            required
            placeholder="Quiz Title"
            defaultValue={quiz.title}
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
          defaultValue={quiz.url}
        />

        <Input
          id="description"
          type="text"
          className="min-h-24 self-start mt-4"
          defaultValue={quiz.description}
          placeholder="Quiz Description"
        />

        <div className="mt-8 flex flex-col w-full space-y-20">
          {questions.map((question, index) => (
            <QuestionComponent key={index} index={index} question={question} />
          ))}
        </div>
        <Button
          className="text-xl px-8 py-6 mt-6 self-end"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            setQuestions((p) => [...p, { ...DEFAULT_QUESTION }]);
          }}
        >
          Add
        </Button>
      </form>
    </main>
  );
};

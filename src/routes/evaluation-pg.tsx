import { db } from "@/config/firebase.config";
import type { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPg } from "./loader-pg";
import { BreadCrumbCustom } from "@/components/breadcrumb-custom";
import { Headings } from "@/components/headings";
import { InterviewCard } from "@/components/interview-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const EvaluationPg = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState<UserAnswer[]>([]);
  const [activeEvaluate, setActiveEvaluate] = useState("");
  const { userId } = useAuth();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/practice");
    return null;
  }
  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        if (interviewId) {
          try {
            const interviewDoc = await getDoc(
              doc(db, "interviews", interviewId)
            );
            if (interviewDoc.exists()) {
              setInterview({
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview);
            }
          } catch (error) {
            console.log(error);
          }
        }
      };

      const fetchEvaluations = async () => {
        setIsLoading(true);
        try {
          const querSanpRef = query(
            collection(db, "userAnswers"),
            where("userId", "==", userId),
            where("mockIdRef", "==", interviewId)
          );

          const querySnap = await getDocs(querSanpRef);

          const interviewData: UserAnswer[] = querySnap.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as UserAnswer;
          });

          setEvaluations(interviewData);
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInterview();
      fetchEvaluations();
    }
  }, [interviewId, navigate, userId]);

  

  const overAllRating = useMemo(() => {
    if (evaluations.length === 0) return "0.0";

    const totalRatings = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.rating,
      0
    );

    return (totalRatings / evaluations.length).toFixed(1);
  }, [evaluations]);

  useEffect(() => {
    console.log('Evaluations data:', JSON.stringify(evaluations, null, 2));
    if (evaluations.length > 0) {
      console.log('First evaluation item:', evaluations[0]);
      console.log('Evaluation field exists:', 'evaluation' in evaluations[0]);
      console.log('Evaluation value:', evaluations[0].evaluation);
    }
  }, [evaluations]);

  if (isLoading) {
    return <LoaderPg className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <div className="flex items-center justify-between w-full gap-2">
        <BreadCrumbCustom
          breadCrumbPage="Evaluation"
          breadCrumbItems={[
            { 
              link: "/practice", 
              label: "Practice" 
            }
          ]}
        />
        {evaluations.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-blue-800">{overAllRating}/10</span>
          </div>
        )}
      </div>

      <Headings
        title="Congratulations !"
        description="Your personalized evaluation is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewCard interview={interview} onMockPage />}

      <Headings title="Interview Evaluation" isSubHeading />

      {evaluations && (
        <Accordion type="single" collapsible className="space-y-6">
          {evaluations.map((evaluationItem) => (
            <AccordionItem
              key={evaluationItem.id}
              value={evaluationItem.id}
              className="border rounded-lg shadow-md"
            >
              <AccordionTrigger
                onClick={() => setActiveEvaluate(evaluationItem.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeEvaluate === evaluationItem.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{evaluationItem.question}</span>
              </AccordionTrigger>

              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating : {evaluationItem.rating}
                </div>

                <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {evaluationItem.correct_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-yellow-600" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {evaluationItem.user_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-red-600" />
                    Evaluation
                  </CardTitle>

                  <CardDescription 
                    className={cn(
                      "font-medium whitespace-pre-wrap break-words",
                      evaluationItem.evaluation ? "text-gray-700" : "text-gray-400 italic"
                    )}
                  >
                    {evaluationItem.evaluation?.trim() || "No evaluation available yet"}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
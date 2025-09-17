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
import { InterviewCard } from "@/components/interview-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

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

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Interview Evaluation</h1>
          <p className="text-muted-foreground">
            Review your performance and feedback
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {overAllRating}<span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {evaluations.length} question{evaluations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {interview && <InterviewCard interview={interview} onMockPage />}
      </div>

      {evaluations && (
        <Accordion type="single" collapsible className="space-y-6">
          {evaluations.map((evaluationItem) => (
            <AccordionItem
              key={evaluationItem.id}
              value={evaluationItem.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-all"
            >
              <AccordionTrigger
                onClick={() => setActiveEvaluate(evaluationItem.id)}
                className={cn(
                  "px-6 py-4 flex items-center justify-between text-base transition-colors hover:no-underline hover:bg-accent/50",
                  activeEvaluate === evaluationItem.id && "bg-accent/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-medium">
                    {evaluations.findIndex(e => e.id === evaluationItem.id) + 1}
                  </div>
                  <span className="text-left">{evaluationItem.question}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 py-5 bg-white space-y-6">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  evaluationItem.rating >= 8 ? 'bg-green-100 text-green-800' : 
                  evaluationItem.rating >= 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  <Star className={`w-4 h-4 mr-1.5 ${
                    evaluationItem.rating >= 8 ? 'text-green-600' : 
                    evaluationItem.rating >= 5 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`} />
                  Rating: {evaluationItem.rating}/10
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="flex items-center text-sm font-medium text-indigo-600">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                        <span className="text-indigo-600">📝</span>
                      </div>
                      Expected Answer
                    </h3>
                    <div className="bg-indigo-50/60 p-4 rounded-lg text-sm border border-indigo-100 text-gray-700">
                      {evaluationItem.correct_ans}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="flex items-center text-sm font-medium text-blue-600">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-blue-600">✏️</span>
                      </div>
                      Your Answer
                    </h3>
                    <div className="bg-blue-50/60 p-4 rounded-lg text-sm border border-blue-100 text-gray-700">
                      {evaluationItem.user_ans}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="flex items-center text-sm font-medium text-emerald-600 mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                        <span className="text-emerald-600">🔍</span>
                      </div>
                      Detailed Feedback
                    </h3>
                    <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                      <p className={cn(
                        "text-gray-700 leading-relaxed whitespace-pre-line text-sm [&>p]:mb-3 [&>p:last-child]:mb-0",
                        !evaluationItem.evaluation && "text-muted-foreground italic"
                      )}>
                        {evaluationItem.evaluation
                          ?.replace(/^•\s*/gm, '')  // Remove bullet points
                          .trim()
                          .replace(/\n{3,}/g, '\n\n')  // Normalize multiple newlines
                          .replace(/([.!?])([A-Z])/g, '$1 $2')  // Add space after punctuation
                          .split('\n')
                          .map((paragraph, i) => (
                            <p key={i} className="mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))
                          || <span className="text-muted-foreground">No evaluation available yet</span>
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
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
import { Star, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

export const EvaluationPg = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState<UserAnswer[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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

      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Your Performance Breakdown</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Review detailed feedback on each question to understand your strengths and areas for improvement.
          </p>
        </div>

        {evaluations && (
          <Accordion 
            type="multiple" 
            className="space-y-4"
            value={expandedItems}
            onValueChange={setExpandedItems}
          >
            {evaluations.map((evaluationItem, index) => {
              const rating = evaluationItem.rating || 0;
              const ratingColor = rating >= 8 ? 'text-green-600' : rating >= 5 ? 'text-yellow-600' : 'text-red-600';
              const ratingBg = rating >= 8 ? 'bg-green-50' : rating >= 5 ? 'bg-yellow-50' : 'bg-red-50';
              
              return (
                <AccordionItem
                  key={evaluationItem.id}
                  value={evaluationItem.id}
                  className="border rounded-xl overflow-hidden transition-all hover:shadow-md"
                >
                  <AccordionTrigger
                    className={cn(
                      "px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors text-left",
                      expandedItems.includes(evaluationItem.id) && "bg-muted/20"
                    )}
                  >
                    <div className="flex gap-4 w-full">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${ratingBg} flex items-center justify-center`}>
                        <span className={`text-lg font-semibold ${ratingColor}`}>{rating}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">Question {index + 1}</div>
                        <div className={cn(
                          "text-sm text-muted-foreground mt-0.5",
                          expandedItems.includes(evaluationItem.id) ? "whitespace-pre-wrap" : "line-clamp-1"
                        )}>
                          {evaluationItem.question}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-6 py-5 bg-white space-y-6 border-t">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column - Expected Answer */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="flex items-center text-sm font-medium text-foreground">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Expected Answer
                          </h3>
                          <div className="bg-muted/30 p-4 rounded-lg text-sm border text-foreground">
                            {(() => {
                              const formattedAnswer = evaluationItem.correct_ans
                                .replace(/^\s*[-*]\s+(.+)$/gm, '• $1')
                                .replace(/([.!?])([A-Z])/g, '$1 $2')
                                .replace(/^(\d+)\.\s+/gm, '$1. ')
                                .replace(/([.!?])\s*(?=[A-Z])/g, '$1  \n\n');
                              
                              return (
                                <div className="prose prose-sm max-w-none">
                                  {formattedAnswer.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="mb-3 last:mb-0">
                                      {paragraph.trim().split('• ').map((item, j) => 
                                        j === 0 ? item : (
                                          <span key={j} className="block pl-4 -indent-4">
                                            • {item.trim()}
                                          </span>
                                        )
                                      )}
                                    </p>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Key Takeaways */}
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h3 className="flex items-center text-sm font-medium text-foreground">
                            <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                            Key Takeaways
                          </h3>
                          <div className="bg-gradient-to-br from-amber-50/70 to-amber-50/30 p-5 rounded-xl border border-amber-100 shadow-sm">
                            <div className="space-y-4">
                              {/* Performance Summary */}
                              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100">
                                <div className="mt-0.5 flex-shrink-0">
                                  {rating >= 7 ? (
                                    <div className="p-1.5 rounded-full bg-green-50">
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                  ) : (
                                    <div className="p-1.5 rounded-full bg-amber-50">
                                      <AlertCircle className="w-5 h-5 text-amber-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold text-foreground">
                                    {rating >= 7 ? 'Great Work!' : 'Areas to Improve'}
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-snug">
                                    {rating >= 7 
                                      ? 'Your response demonstrates strong understanding.'
                                      : 'Here are some suggestions to enhance your response:'}
                                  </p>
                                </div>
                              </div>

                              {/* Score Visualization */}
                              <div className="space-y-2 p-3 bg-white/50 rounded-lg border border-amber-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-muted-foreground">PERFORMANCE SCORE</span>
                                  <span className={`text-sm font-semibold ${ratingColor}`}>{rating}/10</span>
                                </div>
                                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                                      rating >= 8 ? 'bg-green-500' : rating >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${rating * 10}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>Needs Work</span>
                                  <span>Excellent</span>
                                </div>
                              </div>

                              {/* Quick Tips */}
                              {rating < 8 && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-medium text-foreground">QUICK TIPS</h4>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <span className="text-amber-500 mt-0.5">•</span>
                                      <span>Review the expected answer for key points</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-amber-500 mt-0.5">•</span>
                                      <span>Structure your response clearly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-amber-500 mt-0.5">•</span>
                                      <span>Use specific examples when possible</span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Your Answer - Moved under Key Takeaways */}
                        <div className="space-y-2">
                          <h3 className="flex items-center text-sm font-medium text-foreground">
                            <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                            Your Answer
                          </h3>
                          <div className="bg-blue-50/60 p-4 rounded-lg text-sm border border-blue-100 text-foreground">
                            {evaluationItem.user_ans}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-purple-600" />
                        Detailed Feedback
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        {evaluationItem.evaluation ? (
                          <div className="prose prose-sm max-w-none text-foreground">
                            {evaluationItem.evaluation
                              .replace(/^[•-]\s*/gm, '')  // Remove bullet points and dashes
                              .trim()
                              .split('\n')
                              .filter(para => para.trim())
                              .map((paragraph, i) => (
                                <p key={i} className="mb-4 last:mb-0">
                                  {paragraph.trim()}
                                </p>
                              ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">No detailed feedback available for this response.</p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Interview } from '@/types';
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { motion } from 'framer-motion';
import { Loader2, Lightbulb } from 'lucide-react';
import { BreadCrumbCustom } from '@/components/breadcrumb-custom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionsSection } from '@/components/questions-section';
import type { AIResponse } from '@/components/recorded-answer';

export const MockInterviewPg = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [savedResponses, setSavedResponses] = useState<Record<string, { answer: string; evaluation: AIResponse }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const userId = 'userId'; // Replace with actual user ID

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;
      
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          const data = interviewDoc.data() as Interview;
          setInterview(data);
          
          // Initialize answered questions and saved responses
          if (data.questions) {
            const initialAnswers: Record<string, boolean> = {};
            const initialResponses: Record<string, { answer: string; evaluation: AIResponse }> = {};
            
            // Fetch saved answers if any
            const userAnswersQuery = query(
              collection(db, "userAnswers"),
              where("userId", "==", userId),
              where("mockIdRef", "==", interviewId)
            );
            
            const querySnapshot = await getDocs(userAnswersQuery);
            querySnapshot.forEach((doc) => {
              const answerData = doc.data();
              initialAnswers[answerData.question] = true;
              initialResponses[answerData.question] = {
                answer: answerData.user_ans,
                evaluation: {
                  ratings: answerData.rating,
                  evaluation: answerData.evaluation
                }
              };
            });
            
            setAnsweredQuestions(initialAnswers);
            setSavedResponses(initialResponses);
          }
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, userId]);

  const handleQuestionAnswered = (question: string, response: { answer: string; evaluation: AIResponse }) => {
    setSavedResponses(prev => ({
      ...prev,
      [question]: response
    }));
    
    setAnsweredQuestions(prev => ({
      ...prev,
      [question]: true
    }));
  };

  const handleSubmitInterview = async () => {
    if (!interviewId || !interview) return;
    
    try {
      setIsSubmitting(true);
      
      // Show confirmation dialog if not all questions are answered
      const unansweredCount = interview.questions.length - Object.values(answeredQuestions).filter(Boolean).length;
      if (unansweredCount > 0) {
        const confirmSubmit = window.confirm(
          `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you sure you want to submit your interview?`
        );
        
        if (!confirmSubmit) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Update the interview status in Firestore
      await updateDoc(doc(db, "interviews", interviewId), {
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionsAnswered: Object.values(answeredQuestions).filter(Boolean).length,
        totalQuestions: interview.questions.length
      });
      
      // Navigate to the evaluation page with proper history management
      navigate(`/practice/evaluation/${interviewId}`);
    } catch (error) {
      console.error("Error submitting interview:", error);
      // toast.error("Failed to submit interview. Please try again.");
      setIsSubmitting(false);
    }
  };

  const hasAtLeastOneAnswer = Object.values(answeredQuestions).some(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-muted-foreground">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Interview Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The interview you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()} // Use browser's back navigation
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <BreadCrumbCustom
        breadCrumbPage="Mock Interview"
        breadCrumbItems={[
          { label: "Practice", link: "/practice" },
          { label: "Interview Setup", link: `/practice/interview/${interviewId}` }
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {interview.position || 'Mock Interview'}
          </h1>
          {interview.techStack && (
            <p className="text-muted-foreground">
              {interview.techStack}
            </p>
          )}
        </div>

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <AlertTitle className="text-blue-800 dark:text-blue-200 font-semibold">
              Interview Tips
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300 mt-1">
              Type a response or press the microphone button to record your answer for each question. 
              Take your time to think before responding, just like in a real interview.
            </AlertDescription>
          </div>
        </Alert>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {Object.values(answeredQuestions).filter(Boolean).length} of {interview?.questions?.length || 0} questions answered
          </div>
          <Button 
            onClick={handleSubmitInterview}
            disabled={!hasAtLeastOneAnswer || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Interview'
            )}
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          {interview.questions?.length > 0 ? (
            <QuestionsSection 
              questions={interview.questions} 
              onQuestionAnswered={handleQuestionAnswered}
              savedResponses={savedResponses}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions available for this interview.</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
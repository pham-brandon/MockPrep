import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { motion } from 'framer-motion';
import { Loader2, Lightbulb } from 'lucide-react';
import { BreadCrumbCustom } from '@/components/breadcrumb-custom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { QuestionsSection } from '@/components/questions-section';

export const MockInterviewPg = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;
      
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          setInterview({
            id: interviewDoc.id,
            ...interviewDoc.data(),
          } as Interview);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

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
            onClick={() => navigate("/practice")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Practice
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
          { label: interview.position || "Interview", link: `#` },
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
              Press the microphone button to record your answer for each question. 
              Take your time to think before responding, just like in a real interview.
            </AlertDescription>
          </div>
        </Alert>

        <Card className="p-6">
          {interview.questions?.length > 0 ? (
            <QuestionsSection questions={interview.questions} />
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
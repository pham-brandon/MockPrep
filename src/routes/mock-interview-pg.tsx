import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { LoaderPg } from './loader-pg';
import { BreadCrumbCustom } from '@/components/breadcrumb-custom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import { QuestionsSection } from '@/components/questions-section';

export const MockInterviewPg = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      console.log("🔍 Fetching interview with ID:", interviewId);
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          console.log("📄 Document exists:", interviewDoc.exists());
          if (interviewDoc.exists()) {
            const data = {
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview;
            console.log("✅ Interview data:", data);
            setInterview(data);
          } else {
            console.log("❌ Document does not exist in Firebase");
          }
        } catch (error) {
          console.log("💥 Error fetching interview:", error);
        }
      } else {
        console.log("❌ No interviewId provided");
      }
      setIsLoading(false);
    };

    fetchInterview();
  }, [interviewId]);

  if (isLoading) {
    return <LoaderPg className="w-full h-[70vh]" />;
  }

  if (!interview) {
    return (
      <div className="flex flex-col w-full gap-8 py-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Interview not found</h1>
          <p className="text-gray-600 mb-4">The interview you're looking for doesn't exist or has been removed.</p>
          <div className="bg-gray-100 p-4 rounded mb-4 text-left">
            <p className="text-sm"><strong>Debug Info:</strong></p>
            <p className="text-sm">Interview ID: {interviewId || "No ID"}</p>
            <p className="text-sm">Loading: {isLoading ? "Yes" : "No"}</p>
            <p className="text-sm">Interview data: {interview ? "Found" : "Not found"}</p>
          </div>
          <button 
            onClick={() => navigate("/practice")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <BreadCrumbCustom
        breadCrumbPage="Start"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/practice" },
          {
            label: interview?.position || "Interview",
            link: `/practice/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

        {interview?.questions && interview?.questions.length > 0 && (
          <div className="mt-4 w-full flex flex-col items-start gap-4">
            <QuestionsSection questions={interview?.questions} />
          </div>
        )}
    </div>
  );
};
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { type ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordedAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  evaluation: string;
}

export const RecordedAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordedAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordedUserAnswer = async () => {
    if (isRecording) {
      // Stop recording and process the answer
      stopSpeechToText();

      // Validate that user provided a meaningful answer
      if (userAnswer?.length < 0) {
        toast.error("Error", {
          description: "Your answer should be more than 0 characters",
        });

        return;
      }

      // Generate AI evaluation comparing user's answer to the correct answer
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      setAiResult(aiResult);
    } else {
      // Start recording the user's answer
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    // Clean and parse AI response text to extract valid JSON
    // Step 1: Remove any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove markdown code block markers and "json" labels
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Parse the cleaned text as JSON
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    // Generate AI evaluation for the user's interview answer
    setIsAiGenerating(true);
    
    // Create prompt for AI to compare user answer with correct answer
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer evaluation for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "evaluation" (string).
    `;

    try {
      // Send prompt to AI and get response
      const aiResult = await chatSession.sendMessage(prompt);

      // Parse the AI response and return structured evaluation
      const parsedResult: AIResponse = cleanJsonResponse(
        aiResult.response.text()
      );
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "An error occurred while generating evaluation.",
      });
      // Return default response if AI fails
      return { ratings: 0, evaluation: "Unable to generate evaluation" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordedNewAnswer = () => {
    // Reset the answer and start a new recording session
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    // Save the user's answer and AI evaluation to Firebase
    setLoading(true);

    if (!aiResult) {
      return;
    }

    const currentQuestion = question.question;
    try {
      // Check if user has already answered this question to prevent duplicates
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      // Prevent duplicate answers for the same question
      if (!querySnap.empty) {
        console.log("Query Snap Size", querySnap.size);
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        // Save the user's answer with AI evaluation to Firebase
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          evaluation: aiResult.evaluation,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        toast("Saved", { description: "Your answer has been saved.." });
      }

      // Reset the form after successful save
      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      toast("Error", {
        description: "An error occurred while saving your answer.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(!open);
    }
  };

  useEffect(() => {
    // Combine speech-to-text results into a single answer string
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* Modal for confirming answer save */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      {/* Webcam display area */}
      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      {/* Control buttons for webcam, recording, and saving */}
      <div className="flex items-center justify-center gap-3">
        {/* Webcam toggle button */}
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        {/* Start/Stop recording button */}
        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordedUserAnswer}
        />

        {/* Record again button */}
        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordedNewAnswer}
        />

        {/* Save result button (disabled until AI evaluation is generated) */}
        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disabled={!aiResult}
        />
      </div>

      {/* Display area for user's transcribed answer */}
      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold">Your Answer:</h2>

        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {/* Show real-time speech recognition results */}
        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};
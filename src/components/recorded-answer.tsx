/* eslint-disable @typescript-eslint/no-unused-vars */
// Add type definition for Web Speech API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): ISpeechRecognition;
      prototype: ISpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): ISpeechRecognition;
      prototype: ISpeechRecognition;
    };
  }
}

import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Mic,
  Video,
  VideoOff,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordedAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
  onSaveSuccess?: (response: { answer: string; evaluation: AIResponse }) => void;
  savedResponse?: { answer: string; evaluation: AIResponse };
}

export interface AIResponse {
  ratings: number;
  evaluation: string;
}



export const RecordedAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
  onSaveSuccess,
  savedResponse,
}: RecordedAnswerProps) => {
  const [userAnswer, setUserAnswer] = useState(savedResponse?.answer || "");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [, setAiResult] = useState<AIResponse | null>(savedResponse?.evaluation || null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [, setHasUnsavedChanges] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        finalTranscriptRef.current = finalTranscript.trim();
        setTranscript(finalTranscript + (interimTranscript ? ' ' + interimTranscript : ''));
      };

      recognitionRef.current.onerror = (event: Event) => {
        const errorEvent = event as SpeechRecognitionErrorEvent;
        console.error('Speech recognition error', errorEvent.error);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart recognition if still recording
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      finalTranscriptRef.current = userAnswer;
      setTranscript(userAnswer);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setUserAnswer(transcript);
      setHasUnsavedChanges(true);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    // Focus the textarea when starting/stopping recording
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setUserAnswer(newValue);
    setHasUnsavedChanges(true);
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


  const saveUserAnswer = async () => {
    if (!userAnswer) return;
    
    setLoading(true);

    try {
      // Generate AI evaluation for the answer
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      // Save to Firestore
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: userAnswer,
        evaluation: aiResult.evaluation,
        rating: aiResult.ratings,
        userId,
        createdAt: serverTimestamp(),
        status: 'saved',
      });

      toast.success("Response saved!");
      
      // Notify parent component
      if (onSaveSuccess) {
        onSaveSuccess({
          answer: userAnswer,
          evaluation: aiResult
        });
      }
      
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Error saving response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when question changes
    setUserAnswer(savedResponse?.answer || "");
    setAiResult(savedResponse?.evaluation || null);
    setHasUnsavedChanges(false);
  }, [question.question, savedResponse]);

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Your Answer</h3>
          
          {/* Webcam Toggle */}
          <div className="mb-4">
            <div className="w-48 h-48 mx-auto bg-muted rounded-lg overflow-hidden flex items-center justify-center mb-3 border border-border shadow-sm">
              {isWebCam ? (
                <WebCam 
                  audio={false}
                  mirrored
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
                  <Video className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {navigator.mediaDevices ? 
                      "Camera off" : 
                      "No camera"}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <TooltipButton
                content={isWebCam ? "Turn off" : "Turn on"}
                icon={isWebCam ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                onClick={() => setIsWebCam(!isWebCam)}
                className="h-10 w-10"
                size="sm"
                variant="outline"
              />
              <TooltipButton
                content={isRecording ? "Stop Recording" : "Start Speaking"}
                icon={isRecording ? <CircleStop className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                onClick={toggleRecording}
                variant={isRecording ? 'destructive' : 'outline'}
                className="h-10 w-10"
                size="sm"
              />
            </div>
          </div>

          {/* Combined input area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={isRecording ? transcript : userAnswer}
              onChange={handleTextChange}
              placeholder="Type your answer or click the mic to speak..."
              className="w-full min-h-[120px] p-4 pr-12 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isAiGenerating || loading}
            />
            {isRecording && (
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-red-600">Recording...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={saveUserAnswer}
          disabled={!userAnswer || loading || isRecording}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Response'}
        </button>
      </div>
    </div>
  );
};
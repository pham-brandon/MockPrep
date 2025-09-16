import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordedAnswer } from "./recorded-answer";
import type { AIResponse } from "./recorded-answer";
import { CheckCircle } from "lucide-react";

interface QuestionsSectionProps {
    questions: { question: string; answer: string }[]
    onQuestionAnswered?: (question: string, response: { answer: string; evaluation: AIResponse }) => void;
    savedResponses?: Record<string, { answer: string; evaluation: AIResponse }>;
}

export const QuestionsSection = ({ questions, onQuestionAnswered, savedResponses = {} }: QuestionsSectionProps) => {

    const [isPlaying, setIsPlaying] = useState(false)
    const [isWebCam, setIsWebCam] = useState(false)
    const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null)
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>(
        questions.reduce((acc, q) => ({
            ...acc,
            [q.question]: savedResponses[q.question] !== undefined
        }), {})
    );

    const handleQuestionAnswered = (question: string, response: { answer: string; evaluation: AIResponse }) => {
        setAnsweredQuestions(prev => ({
            ...prev,
            [question]: true
        }));
        
        if (onQuestionAnswered) {
            onQuestionAnswered(question, response);
        }
    };

    const handlePlayQuestion = (qst: string) => {
        if (isPlaying && currentSpeech) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
          setCurrentSpeech(null);
        } else {
          if ("speechSynthesis" in window) {
            const speech = new SpeechSynthesisUtterance(qst);
            window.speechSynthesis.speak(speech);
            setIsPlaying(true);
            setCurrentSpeech(speech);
            speech.onend = () => {
              setIsPlaying(false);
              setCurrentSpeech(null);
            };
          }
        }
    }

    return (
        <div className="w-full min-h-96 border rounded-md p-4">
          <Tabs
            defaultValue={questions[0]?.question}
            className="w-full space-y-12"
            orientation="vertical"
          >
            <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
              {questions?.map((tab, i) => (
                <TabsTrigger
                  className={cn(
                    "data-[state=active]:bg-blue-100 data-[state=active]:shadow-md text-xs px-2 relative",
                    answeredQuestions[tab.question] && "pr-6"
                  )}
                  key={tab.question}
                  value={tab.question}
                >
                  {`Question #${i + 1}`}
                  {answeredQuestions[tab.question] && (
                    <CheckCircle className="h-3 w-3 text-green-500 absolute right-1" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {questions?.map((tab, i) => (
                <TabsContent key={i} value={tab.question}>
                    <div className="flex items-start justify-between gap-4">
                        <p className="text-base text-left tracking-wide text-neutral-500 flex-1">
                            {tab.question}
                        </p>
                        <TooltipButton 
                            content={isPlaying ? "Stop" : "Start"} 
                            icon={isPlaying ? 
                                <VolumeX className="min-w-5 min-h-5 text-muted-foreground" /> : 
                                <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                            } 
                            onClick={(e) => {
                                e.preventDefault();
                                handlePlayQuestion(tab.question);
                            }}
                            buttonClassName="shrink-0 mt-1"
                        />
                    </div>
                    
                    <RecordedAnswer 
                        question={tab} 
                        isWebCam={isWebCam} 
                        setIsWebCam={setIsWebCam} 
                        onSaveSuccess={(response) => handleQuestionAnswered(tab.question, response)}
                        savedResponse={savedResponses[tab.question]}
                    />
                </TabsContent>
            ))}
          </Tabs>
        </div>
      );
  
}

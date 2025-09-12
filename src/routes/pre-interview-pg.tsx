import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoaderPg } from './loader-pg';
import { BreadCrumbCustom } from '@/components/breadcrumb-custom';
import { Lightbulb, Sparkles, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InterviewCard } from '@/components/interview-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Webcam from 'react-webcam';

export const PreInterviewPg = () => {

    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading] = useState(false);
    const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchInterview = async() => {
            if(interviewId) {
                try {
                    const interviewDoc = await getDoc(doc(db, "interviews", interviewId))
                if(interviewDoc.exists()){
                    setInterview({id: interviewDoc.id, ...interviewDoc.data()} as Interview)
                }
    
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchInterview()
    }, [interviewId, navigate])

    if (isLoading) {
        return <LoaderPg className='w-full h-[70vh]'/>
    }

    if (!interviewId) {
        navigate("/practice", { replace: true})
    }

    if (!interview) {
        navigate("/practice", { replace: true})
    }
    
    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <div className='flex items-center justify-between w-full gap-8 py-5'>
                <BreadCrumbCustom
                    breadCrumbPage={interview?.position || ""}
                    breadCrumbItems={[{label: "Mock Interviews", link: "/practice"}]}
                />
            
            <Link to={`/practice/interview/${interviewId}/start`}>
                <Button size={"sm"}>
                    Start <Sparkles />
                </Button>
            
            </Link>
            </div>
            {interview && <InterviewCard interview={interview} onMockPage/>}


            <Alert className="bg-yellow-100/50 border-yellow-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <div>
                <AlertTitle className="text-yellow-800 font-semibold">
                    Important Information
                </AlertTitle>
                <AlertDescription className="text-sm text-yellow-700 mt-1">
                    Please enable your webcam and microphone to start the AI-generated
                    mock interview. The interview consists of five questions. You’ll
                    receive a personalized report based on your responses at the end.{" "}
                    <br />
                    <br />
                    <span className="font-medium">Note:</span> Your video is{" "}
                    <strong>never recorded</strong>. You can disable your webcam at any
                    time.
                </AlertDescription>
                </div>
            </Alert>

            <div className="flex items-center justify-center w-full h-full">
                <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
                {isWebCamEnabled ? (
                    <Webcam
                        onUserMedia={() => setIsWebCamEnabled(true)}
                        onUserMediaError={() => setIsWebCamEnabled(false)}
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
                )}
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Button onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}>
                {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
                </Button>
            </div>
        </div>
    )
}
  
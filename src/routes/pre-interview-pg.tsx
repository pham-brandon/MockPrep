import { db } from '@/config/firebase.config';
import type { Interview } from '@/types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Webcam as WebcamIcon, Loader2, Mic, MicOff, Volume2, Pencil, Save } from 'lucide-react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { BreadCrumbCustom } from '@/components/breadcrumb-custom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const PreInterviewPg = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);
    const [isMicEnabled, setIsMicEnabled] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInterview, setEditedInterview] = useState<Partial<Interview>>({});
    const webcamRef = useRef<Webcam>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterview = async() => {
            if (!interviewId) {
                navigate("/practice", { replace: true });
                return;
            }
            
            try {
                const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                if (interviewDoc.exists()) {
                    setInterview({
                        id: interviewDoc.id,
                        ...interviewDoc.data(),
                    } as Interview);
                } else {
                    navigate("/practice", { replace: true });
                }
            } catch (error) {
                console.error("Error fetching interview:", error);
                navigate("/practice", { replace: true });
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchInterview();
    }, [interviewId, navigate]);

    useEffect(() => {
        if (interview) {
            setEditedInterview({
                position: interview.position,
                techStack: interview.techStack,
                experience: interview.experience,
                description: interview.description
            });
        }
    }, [interview]);

    const handleInputChange = (field: keyof Interview, value: string | number) => {
        setEditedInterview(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!interviewId || !interview) return;
        
        try {
            const interviewRef = doc(db, "interviews", interviewId);
            await updateDoc(interviewRef, {
                ...editedInterview,
                updateAt: new Date()
            });
            
            // Update local state
            setInterview({
                ...interview,
                ...editedInterview
            });
            
            setIsEditing(false);
            toast.success("Interview details updated successfully!");
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to update interview details");
        }
    };

    const toggleWebcam = () => {
        if (isWebCamEnabled) {
            // Stop all media tracks when disabling webcam
            if (webcamRef.current) {
                const stream = webcamRef.current.video?.srcObject as MediaStream;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => {
                        track.stop();
                        stream.removeTrack(track);
                    });
                    if (webcamRef.current?.video) {
                        webcamRef.current.video.srcObject = null;
                    }
                }
            }
        } else {
            // Reset the webcam ref when enabling
            if (webcamRef.current) {
                webcamRef.current.video = null;
            }
        }
        setIsWebCamEnabled(!isWebCamEnabled);
    };

    const toggleMic = async () => {
        if (isMicEnabled) {
            // Stop all audio tracks when disabling mic
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                    mediaStreamRef.current?.removeTrack(track);
                });
                mediaStreamRef.current = null;
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
                setVolumeLevel(0);
            }
            setIsMicActive(false);
            setIsMicEnabled(false);
            return;
        }

        // Enable mic
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            // Set up audio context for volume visualization
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const checkVolume = () => {
                if (!mediaStreamRef.current) return; // Exit if stream was stopped
                
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                setVolumeLevel(Math.min(average / 2, 100));
                
                // Update mic active state based on volume
                setIsMicActive(average > 5);
                
                if (mediaStreamRef.current) { // Check again before requesting next frame
                    animationRef.current = requestAnimationFrame(checkVolume);
                }
            };
            
            checkVolume();
            setIsMicEnabled(true);
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check your browser permissions.');
            setIsMicEnabled(false);
        }
    };

    // Cleanup function for when component unmounts
    useEffect(() => {
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-muted-foreground">Loading interview details...</p>
                </div>
            </div>
        );
    }

    if (!interview) {
        return null; // Redirect handled in useEffect
    }
    
    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <BreadCrumbCustom
                breadCrumbPage="Interview Setup"
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        {isEditing ? (
                            <Input
                                value={editedInterview.position || ''}
                                onChange={(e) => handleInputChange('position', e.target.value)}
                                className="text-3xl font-bold border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold tracking-tight">
                                {interview.position || 'Interview Preparation'}
                            </h1>
                        )}
                        {isEditing ? (
                            <Input
                                value={editedInterview.techStack || ''}
                                onChange={(e) => handleInputChange('techStack', e.target.value)}
                                placeholder="Technologies (e.g., React, Node.js, TypeScript)"
                                className="text-muted-foreground border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2"
                            />
                        ) : (
                            interview.techStack && (
                                <p className="text-muted-foreground">
                                    {interview.techStack}
                                </p>
                            )
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button 
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSave}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Details
                            </Button>
                        )}
                        <Button 
                            asChild
                            className="bg-blue-600 hover:bg-blue-700"
                            size="lg"
                        >
                            <Link to={`/practice/interview/${interviewId}/start`}>
                                Start Interview <Sparkles className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 flex flex-col h-full">
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Interview Details</h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-muted-foreground">Position</h3>
                                        {isEditing ? (
                                            <Input
                                                value={editedInterview.position || ''}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                                className="border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2 w-full"
                                            />
                                        ) : (
                                            <p>{interview.position}</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-muted-foreground">Technologies</h3>
                                        {isEditing ? (
                                            <Input
                                                value={editedInterview.techStack || ''}
                                                onChange={(e) => handleInputChange('techStack', e.target.value)}
                                                placeholder="e.g., React, Node.js, TypeScript"
                                                className="border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2 w-full"
                                            />
                                        ) : (
                                            <p>{interview.techStack || 'Not specified'}</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-muted-foreground">Experience Level (years)</h3>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                min="0"
                                                value={editedInterview.experience ?? ''}
                                                onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                                                className="border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2 w-24"
                                            />
                                        ) : (
                                            <p>{interview.experience || '0'} years</p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-muted-foreground">Job Description</h3>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedInterview.description || ''}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Enter job description..."
                                                className="min-h-[150px] mt-2 border-2 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-3 py-2"
                                            />
                                        ) : (
                                            <p className="whitespace-pre-line">{interview.description || 'No description provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 mt-auto">
                            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <AlertTitle className="text-blue-800 dark:text-blue-200 font-semibold">
                                        Interview Tips
                                    </AlertTitle>
                                    <AlertDescription className="text-blue-700 dark:text-blue-300 mt-1">
                                        Take a moment to prepare before starting.
                                        The interview will consist of several questions relating to the position you are applying for.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Webcam Check</h2>
                                {isWebCamEnabled ? (
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={toggleWebcam}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Disable Webcam
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={toggleWebcam}
                                    >
                                        Enable Camera
                                    </Button>
                                )}
                            </div>
                            <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                {isWebCamEnabled ? (
                                    <Webcam 
                                        ref={webcamRef}
                                        audio={false}
                                        mirrored
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                                        <WebcamIcon className="h-16 w-16 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {navigator.mediaDevices ? 
                                                "Camera access is required for the interview" : 
                                                "Unable to access camera. Please check your browser permissions."}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Your video is never recorded. This is just to help you prepare for a real interview setting.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Microphone Check</h2>
                                {isMicEnabled ? (
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={toggleMic}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Disable Mic
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={toggleMic}
                                    >
                                        Enable Mic
                                    </Button>
                                )}
                            </div>
                            <div className="h-24 bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
                                {isMicEnabled ? (
                                    <div className="flex flex-col items-center w-full p-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-2">
                                            {isMicActive ? (
                                                <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <MicOff className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-100" 
                                                style={{ width: `${volumeLevel}%` }}
                                            />
                                        </div>
                                        <p className="text-xs mt-2 text-muted-foreground">
                                            {isMicActive ? "Mic is working!" : "Speak to test your microphone"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center p-4 text-center">
                                        <Mic className="h-6 w-6 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground px-2">
                                            {navigator.mediaDevices ? 
                                                "Microphone access is required for the interview" : 
                                                "Unable to access microphone. Please check your browser permissions."}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Your voice is never recorded. This is just to help you prepare for a real interview setting.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">What to Expect</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500">•</span>
                                    <span>5 questions relating to the job position</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500">•</span>
                                    <span>Time to think before each response</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500">•</span>
                                    <span>Detailed feedback after completion</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500">•</span>
                                    <span>Option to save your progress</span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
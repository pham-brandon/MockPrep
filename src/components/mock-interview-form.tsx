import type { Interview } from "@/types"
import { BreadCrumbCustom } from "./breadcrumb-custom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { Loader, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { chatSession } from "@/scripts"
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface MockInterviewFormProps {
    initialData : Interview | null
}

const formSchema = z.object({
    position: z
    .string()
    .min(1, "Must enter a position")
    .max(100, "Can only enter 100 characters or less"),
  description: z.string().min(1, "Add a description"),
  experience: z.preprocess((val) => Number(val), z.number().min(0, "Enter years of experience")),
  techStack: z.string().min(1, "Add a teck stack"),
})

export const MockInterviewForm = ({initialData} : MockInterviewFormProps) => {

    // Remove the generic from useForm to let react-hook-form infer types
    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            position: initialData?.position || "",
            description: initialData?.description || "",
            experience: initialData?.experience ?? 0,
            techStack: initialData?.techStack || "",
        }
    })

    const {isValid, isSubmitting} = form.formState;
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const {userId} = useAuth();

    const handleDelete = async () => {
        if (!initialData?.id) return;
        
        if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await deleteDoc(doc(db, "interviews", initialData.id));
                toast.success('Interview deleted successfully');
                navigate('/practice');
            } catch (error) {
                console.error('Error deleting interview:', error);
                toast.error('Failed to delete interview');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleReset = () => {
        form.reset({
            position: "",
            description: "",
            experience: 0,
            techStack: "",
        });
        form.clearErrors();
    };

    
    const breadCrumbPage = initialData?.position ? "Edit" : "Create"
    const actions = initialData ? "Save Changes" : "Create";
    const toastMessage = initialData? { title: "Updated!", description: "Saved changes!" } : { title: "Created!", description: "Practice Mock Interview created!" };

    function cleanAiResponse(responseText: string): any[] {
        // Step 1: Trim whitespace
        let cleanText = responseText.trim();
      
        // Step 2: Remove code block markers ONLY at the start/end
        cleanText = cleanText.replace(/^(```(json)?\s*)|(\s*```$)/gi, "");
      
        // Step 3: Extract JSON array between brackets, allowing for whitespace/newlines
        const jsonArrayMatch = cleanText.match(/\[\s*[\s\S]*\s*\]/);
        if (jsonArrayMatch) {
          cleanText = jsonArrayMatch[0];
        } else {
          // Optionally, try to parse the whole string as JSON, or throw
          throw new Error("No JSON array found in response");
        }
      
        // Step 4: Parse JSON
        try {
          const parsed = JSON.parse(cleanText);
          if (!Array.isArray(parsed)) {
            throw new Error("Parsed JSON is not an array");
          }
          return parsed;
        } catch (error) {
          throw new Error("Invalid JSON format: " + (error as Error)?.message);
        }
      }

    const generateAiResponse = async (data: z.infer<typeof formSchema>) => {
        const prompt = `
            As an expert prompt engineer, generate a JSON array of 5 technical interview questions, each paired with a detailed, high-quality answer, tailored to the following job information. Each array element must be an object with the fields "question" and "answer", formatted exactly as:
    
            [
              { "question": "<Question text>", "answer": "<Answer text>" },
              ...
            ]
    
            Job Information:
            - Job Position: ${data.position}
            - Job Description: ${data.description}
            - Years of Experience Required: ${data.experience}
            - Tech Stacks: ${data.techStack}
    
            Requirements:
            - Questions must be highly relevant to the job description and tech stack, assessing both practical and theoretical knowledge.
            - Cover a mix of fundamental concepts, real-world problem-solving, best practices, and handling complex or ambiguous requirements in ${data.techStack}.
            - Answers should be clear, technically accurate, and demonstrate depth appropriate for a candidate with ${data.experience} years of experience.
            - Do not include any introductory text, explanations, code blocks, or labels—output only the raw JSON array as specified.
            `;
    
        const aiResponse = await chatSession.sendMessage(prompt);
        console.log(aiResponse.response.text().trim())
        const cleanedResponse = cleanAiResponse(aiResponse.response.text());
        return cleanedResponse;
      };

    const onSubmit = async(data: any) => {
        try {
            setLoading(true)
            if(initialData) {
                if (isValid) {
                    const aiResponse = await generateAiResponse(data)
                    await updateDoc(
                      doc(db, "interviews", initialData?.id),
                      {
                        questions: aiResponse,
                        ...data,
                        updatedAt: serverTimestamp(),
                      }
                    );
                }
                toast(toastMessage.title, {description : toastMessage.description})
            } else {
                if(isValid) {
                    const aiResponse = await generateAiResponse(data)
                    await addDoc(collection(db, "interviews"), {
                        ...data,
                        userId,
                        questions : aiResponse,
                        createdAt : serverTimestamp(),

                    })
                    toast(toastMessage.title, {description : toastMessage.description})
                }
            }
            navigate("/practice", {replace : true})
        } catch (error) {
            console.log(error)
            // Remove or comment out the toast usage to avoid runtime error
            // toast.error("Error", {
            //     description: "Please try again later."
            // })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(initialData){
            form.reset({
                position : initialData.position,
                description : initialData.description,
                experience : initialData.experience,
                techStack : initialData.techStack,
            })
        }
    }, [initialData, form])

  return (
    <div className="w-full space-y-6">
      <BreadCrumbCustom
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{ label: "Practice", link: "/practice" }]}
      />
      
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight">
            {initialData ? `Edit ${initialData.position}` : 'Create New Interview'}
          </h1>
          <p className="text-muted-foreground">
            {initialData ? 'Update your interview details' : 'Fill in the details to create a new mock interview'}
          </p>
        </motion.div>
        
        {initialData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
              <span className="sr-only">Delete</span>
            </Button>
          </motion.div>
        )}
      </div>

      <Separator className="my-4" />

      <FormProvider {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={() => form.reset({
            position: initialData?.position || "",
            description: initialData?.description || "",
            experience: initialData?.experience ?? 0,
            techStack: initialData?.techStack || "",
          })}
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Position Field */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Position *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Senior Frontend Developer"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience Field */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Years of Experience *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      className="h-11"
                      value={field.value?.toString() ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tech Stack Field */}
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Skills/Technologies *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., React, TypeScript, Node.js, Problem Solving"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  List the main skills and technologies relevant to this position
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Job Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the job description or describe the role..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
            <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isSubmitting || loading || isDeleting}
          >
            Reset
          </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                actions
              )}
            </Button>
          </div>
        </motion.form>
      </FormProvider>
    </div>
  )
}

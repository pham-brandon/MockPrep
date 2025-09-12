import type { Interview } from "@/types"
import { BreadCrumbCustom } from "./breadcrumb-custom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { Headings } from "./headings"
import { Loader, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { chatSession } from "@/scripts"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/config/firebase.config"
import { toast } from "sonner"

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

    const {isValid, isSubmitting} = form.formState
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {userId} = useAuth()

    const title = initialData?.position ? initialData?.position : "Create a new practice mock interview"
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

  return (<div className="w-full flex-col space-y-4">
  
  <BreadCrumbCustom
        breadCrumbPage={breadCrumbPage}
        breadCrumbItems={[{label: "Mock Interviews", link: "/practice"}]}
    
  />
  <div className="w-full mt-4 items-center justify-between flex">
    <Headings title={title} isSubHeading/>
    {initialData && (
        <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500"/>
        </Button>
    )}
  </div>

    <Separator className="my-4"/>
    <div className="my-6"></div>
    <FormProvider {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={() => form.reset({
                position: initialData?.position || "",
                description: initialData?.description || "",
                experience: initialData?.experience ?? 0,
                techStack: initialData?.techStack || "",
            })}
            className="p-8 w-full rounded-lg flex flex-col items-start justify-start gap-6 shadow-md"
        >
        {/* position */}
        <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
                <FormItem className="space-y-4 w-full">
                    <div className="flex w-full items-center justify-between">
                        <FormLabel>Job Title/Job Role</FormLabel>
                        <FormMessage className="text-sm" />
                    </div>
                    <FormControl>
                        <Input 
                        {...field}
                        disabled={loading} className="h-12"
                            placeholder="ex: Junior Backend Software Engineer"
                            value={typeof field.value === 'string' ? field.value : ''}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        {/* description */}
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem className="space-y-4 w-full">
                    <div className="flex w-full items-center justify-between">
                        <FormLabel>Job Description</FormLabel>
                        <FormMessage className="text-sm" />
                    </div>
                    <FormControl>
                        <Textarea
                            disabled={loading}
                            className="h-12"
                            placeholder="enter the job description of your role..."
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        {/* experience */}
        <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
                <FormItem className="space-y-4 w-full">
                    <div className="flex w-full items-center justify-between">
                        <FormLabel>Years of experience</FormLabel>
                        <FormMessage className="text-sm" />
                    </div>
                    <FormControl>
                        <Input 
                        type="number"
                        disabled={loading} className="h-12"
                        placeholder="enter number of years of experience..."
                        value={field.value === undefined || field.value === null ? '' : String(field.value)}
                        onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        {/* tech stack */}
        <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
                <FormItem className="space-y-4 w-full">
                    <div className="flex w-full items-center justify-between">
                        <FormLabel>Tech Stack</FormLabel>
                        <FormMessage className="text-sm" />
                    </div>
                    <FormControl>
                        <Textarea
                            disabled={loading}
                            className="h-12"
                            placeholder="enter the technologies needed (seperate using commas (react, java, python, etc...))"
                            {...field}
                            value={typeof field.value === 'string' ? field.value : ''}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        <div className="flex w-full items-center justify-end gap-6">
            <Button type="reset" size="sm" variant="outline" disabled={isSubmitting || loading}>
                Reset
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting || loading || !form.formState.isValid}>
                {loading ? <Loader className="text-gray-50 animate-spin" /> : actions}
            </Button>
        </div>

        </form>
    </FormProvider>


  </div>
  )

}

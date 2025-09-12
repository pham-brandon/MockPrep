import { InterviewCard } from "@/components/interview-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/config/firebase.config"
import type { Interview } from "@/types"
import { useAuth } from "@clerk/clerk-react"
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"

export const Dashboard = () => {
  
  const [loading, setLoading] = useState(false)
  const {userId} = useAuth()
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const handleDeleteInterview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "interviews", id));
      toast.success("Interview deleted successfully");
    } catch (error) {
      console.error("Error deleting interview: ", error);
      toast.error("Failed to delete interview");
    }
  };

  useEffect(() => {
    setLoading(true)
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId))

      const unsubscribe = onSnapshot(
        interviewQuery,
        (snapshot) => {
          const interviewList: Interview[] = snapshot.docs.map((doc) => {
            const data = doc.data()
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            const updateAt = data.updateAt?.toDate ? data.updateAt.toDate() : new Date()
            
            return {
              id: doc.id,
              position: data?.position || 'Untitled Interview',
              description: data?.description || '',
              experience: data?.experience || 0,
              userId: data?.userId || userId || '',
              techStack: data?.techStack || '',
              questions: Array.isArray(data?.questions) ? data.questions : [],
              createdAt: { 
                toDate: () => new Date(createdAt),
                toMillis: () => new Date(createdAt).getTime(),
                isEqual: (other: any) => other?.toDate?.()?.getTime() === new Date(createdAt).getTime()
              } as any,
              updateAt: { 
                toDate: () => new Date(updateAt),
                toMillis: () => new Date(updateAt).getTime(),
                isEqual: (other: any) => other?.toDate?.()?.getTime() === new Date(updateAt).getTime()
              } as any
            } as Interview
          })
          
          // Sort interviews by creation date (newest first)
          const sortedInterviews = [...interviewList].sort((a, b) => 
            b.createdAt.toMillis() - a.createdAt.toMillis()
          )
          
          setInterviews(sortedInterviews)
          setLoading(false)
        },
        (error) => {
          console.error("Error fetching interviews: ", error)
          toast.error("Error loading interviews", {
            description: "Please try again later"
          })
          setLoading(false)
        }
      )
      
      return () => unsubscribe()

  }, [userId])



  return (
    <div className="w-full">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-blue-100 dark:border-blue-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300"
              >
                Practice
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-2 text-lg text-blue-600 dark:text-blue-300"
              >
                Start practicing now
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={"/practice/create"}>
                <Button 
                  size="lg"
                  className="px-6 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Interview
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : interviews.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {interviews.map((interview) => (
              <motion.div
                key={interview.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.5
                    }
                  }
                }}
              >
                <InterviewCard 
                  interview={interview} 
                  onDelete={handleDeleteInterview}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-blue-100 dark:border-blue-900/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get started by creating your first mock interview
              </p>
              <Link to="/practice/create">
                <Button 
                  size="lg"
                  className="px-6 py-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Interview
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

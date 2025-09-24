import { useMemo } from 'react';
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Mic, Video, Bot, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";

const features = [
  {
    icon: <Mic className="w-6 h-6 text-blue-500" />,
    title: "Real-time Feedback",
    description: "Get instant analysis on your answers, tone, and body language."
  },
  {
    icon: <Video className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered Mock Interviews",
    description: "Practice with AI that adapts to your responses in real-time."
  },
  {
    icon: <Bot className="w-6 h-6 text-blue-500" />,
    title: "Personalized Coaching",
    description: "Receive tailored tips to improve your interview performance."
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
    title: "Interview Analytics",
    description: "Track your progress with detailed performance metrics and insights."
  }
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-700"
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};



const Home = () => {
  const { isSignedIn } = useAuth();
  const [ref] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const bubbles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 200 + 50, // 50-250px
      duration: Math.random() * 30 + 30, // 30-60s
      delay: Math.random() * -20, // Stagger start times
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotate: Math.random() * 360,
      path: {
        x: [
          0,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          0
        ],
        y: [
          0,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          0
        ]
      }
    })),
    [] // Empty dependency array ensures this only runs once
  );

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-slate-900 dark:to-blue-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-blue-100 dark:bg-grid-blue-900/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.9))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.9))]"></div>
        
        <Container>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Interview Preparation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 px-4">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Ace Your Next Interview
                </span>
                <span className="block text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mt-4">
                  With AI-Powered Mock Interviews
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 px-4">
                Practice with an AI interviewer, get instant feedback, and improve your interview skills
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Link to={isSignedIn ? "/practice" : "/signin"} className="block w-full">
                    <Button 
                      size="lg" 
                      className={`w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        isSignedIn 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}

                    >
                      {isSignedIn ? (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Start Mock Interview
                        </>
                      ) : (
                        <>
                          Get Started Now<ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </Link>
                </motion.div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full bg-gradient-to-br from-blue-200/30 to-blue-300/30 dark:from-blue-800/20 dark:to-blue-900/20 backdrop-blur-sm"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                rotate: bubble.rotate,
              }}
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                x: bubble.path.x,
                y: bubble.path.y,
                rotate: [bubble.rotate, bubble.rotate + 180, bubble.rotate + 360],
                scale: [0.8, 1.2, 1],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
              }}
            />
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 bg-gray-50 dark:bg-slate-800 relative overflow-hidden">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these simple steps to ace your next interview with MockPrep
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-10/12 w-full">
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-2xl">
                  <img 
                    src="/assets/images/practice.png" 
                    alt="Practice Page"
                    className="w-full h-auto max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmM2YzIi8+PHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5QcmFjdGljZSBQYWdlIFByZXZpZXc8L3RleHQ+PC9zdmc+'
                    }}
                  />
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Start from the Practice Page</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Begin your journey from the practice page where you can view your previous interviews or create a new one.
                  Track your progress and see how you've improved over time.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-10/12 w-full">
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-2xl">
                  <img 
                    src="/assets/images/create-interview.png" 
                    alt="Create Interview"
                    className="w-full h-auto max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5DcmVhdGUgSW50ZXJ2aWV3IFByZXZpZXc8L3RleHQ+PC9zdmc+'
                    }}
                  />
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Set Up Your Interview</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Enter the job position, company, and any specific details about the role.
                  Our AI will tailor the interview questions based on your input.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-10/12 w-full">
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-2xl">
                  <img 
                    src="/assets/images/pre-interview.png" 
                    alt="Pre-Interview Setup"
                    className="w-full h-auto max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmOGQ5Ii8+PHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5QcmUtSW50ZXJ2aWV3IFByZXZpZXc8L3RleHQ+PC9zdmc+'
                    }}
                  />
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Prepare for Your Interview</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Review the job description and prepare yourself before starting the interview.
                  Take notes and get in the right mindset for success.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-10/12 w-full">
                <div className="w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 shadow-2xl">
                  <img 
                    src="/assets/images/interview.png" 
                    alt="Live Interview"
                    className="w-full h-auto max-h-[600px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDNmNWY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2Ij5JbnRlcnZpZXcgUHJldmlldzwvdGV4dD48L3N2Zz4='
                    }}
                  />
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold mb-6">
                  4
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ace Your Interview</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Answer questions while being recorded. Our AI analyzes your responses in real-time,
                  providing feedback on your communication skills, confidence, and more.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-auto max-w-full">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="/assets/images/evaluation.png" 
                    alt="Performance Evaluation"
                    className="h-auto max-h-[85vh] w-auto max-w-full object-scale-down object-center"
                    style={{ imageRendering: 'crisp-edges' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlYmVlYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+RXZhbHVhdGlvbiBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold mb-6">
                  5
                </div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Review Your Performance</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Receive detailed feedback showing the expected answer, your response, and expert analysis.
                  Our evaluation highlights your strengths and provides specific, actionable insights to help you
                  improve and excel in future interviews.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <div ref={ref} className="py-28 pb-40 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.9))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.9))]"></div>
        
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              MockPrep provides all the tools and resources to help you ace your next interview.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
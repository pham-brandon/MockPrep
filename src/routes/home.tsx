import { useMemo } from 'react';
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle, Mic, Video, Bot, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import type { Variants } from 'framer-motion';

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

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const letters = text.split("");
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.03, 
        delayChildren: 0.04 * i 
      },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter: string, index: number) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
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
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  <AnimatedText text="Ace Your Next Interview" />
                </span>
                <span className="block text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 mt-4">
                  With AI-Powered Mock Interviews
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Practice with an AI interviewer, get instant feedback, and land your dream job with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to={isSignedIn ? "/practice" : "/signin"}>
                    <Button 
                      size="lg" 
                      className={`px-8 py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
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
                  className="px-8 py-6 text-lg font-semibold border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  How It Works
                </Button>
              </div>
              
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Free</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Unlimited practice</span>
                </div>
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
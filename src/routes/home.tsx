import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Marquee from "react-fast-marquee"

const Home = () => {
  return (
    <div className="w-full pb-24 flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900 dark:via-slate-900 dark:to-blue-950 min-h-[60vh] flex items-center justify-center shadow-xl">
      <Container>
        <div className="flex flex-col items-center justify-center text-center py-20 px-2 md:px-8 animate-fade-in">
          <h1 className="text-[3rem] md:text-[4.5rem] font-extrabold leading-tight mb-2">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 animate-gradient-x drop-shadow-lg" style={{ WebkitTextStroke: '2.5px #2563eb', filter: 'drop-shadow(0 4px 24px #3b82f6aa)' }}>
              MockPrep
            </span>
            <span className="block text-blue-700 font-extrabold text-2xl md:text-3xl mt-2">Your AI Interview Coach</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-2">
            Master your next interview with <span className="text-blue-600">personalized AI guidance</span>
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-blue-900 dark:text-blue-200 mt-2 opacity-90">
            Unlock your potential with MockPrep’s intelligent mock interviews, real-time feedback, and tailored practice sessions. Build confidence, sharpen your skills, and get actionable insights. Walk into every interview ready to succeed!
          </p>
        </div>

        {/* image */}
        <div className="w-full mt-4 rounded-xl bg-blue-100 h-[420px] drop-shadow-md overflow-hidden relative">
          <img
            src="/assets/images/interview.jpg"
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 px-4 py-2 rounded-md bg-blue-200/60 backdrop-blur-md">
            <span className="text-blue-800 font-bold">Get Ready For Your Next Interview!</span>
          </div>

          <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-2 rounded-md bg-blue-50/80 backdrop-blur-md border border-blue-200">
            <h2 className="text-blue-700 font-bold">Practice Makes Perfect!</h2>
            <p className="text-sm text-blue-600 font-semibold">
            MockPrep empowers you to unlock your full potential and confidently ace every interview with the help of AI-driven guidance and support.
            </p> 

            <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
              Practice <Sparkles className="ml-2 w-4 h-4 text-blue-200" />
            </Button>
          </div>
        </div>

        {/* marquee */}
        <div className="mt-10">
          <Marquee gradient={false} speed={40} pauseOnHover className="flex items-center space-x-12">
            <img src="/assets/images/meet-logo.png" alt="Google Meet" className="h-12 mx-8 grayscale hover:grayscale-0 transition duration-300" />
            <img src="/assets/images/zoom-logo.png" alt="Zoom" className="h-10 mx-8 grayscale hover:grayscale-0 transition duration-300" />
            <img src="/assets/images/firebase-logo.png" alt="Firebase" className="h-12 mx-8 grayscale hover:grayscale-0 transition duration-300" />
            <img src="/assets/images/microsoft-logo.png" alt="Microsoft" className="h-12 mx-8 grayscale hover:grayscale-0 transition duration-300" />
            <img src="/assets/images/tailwindcss-logo.png" alt="Tailwind CSS" className="h-10 mx-8 grayscale hover:grayscale-0 transition duration-300" />
            <div className="w-8" />
            <img src="/assets/images/react-logo.png" alt="React" className="h-12 mx-0 grayscale hover:grayscale-0 transition duration-300" />
          </Marquee>
        </div>

      </Container>
    </div>
  )
}

export default Home
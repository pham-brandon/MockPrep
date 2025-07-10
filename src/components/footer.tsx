const Footer = () => {
  return (
    <footer className="w-full bg-blue-700 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-center text-center gap-2">
        <span className="font-bold text-lg">MockPrep</span>
        <span className="text-sm opacity-80">Empowering you to ace every interview with AI-driven practice.</span>
        <span className="text-xs opacity-60">&copy; {new Date().getFullYear()} MockPrep. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
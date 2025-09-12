import { Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/80 dark:via-slate-900/80 dark:to-blue-950/80 border-t border-blue-100 dark:border-blue-900/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="space-y-4 md:w-1/2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                MockPrep
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Empowering you to ace every interview with AI-driven practice and personalized feedback.
            </p>
          </div>
          
          <div className="md:w-1/2 md:pl-8 md:border-l border-blue-100 dark:border-blue-900/50 md:ml-[62%]">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex flex-col space-y-4">
              <a href="https://github.com/pham-brandon" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>pham-brandon</span>
              </a>
              <a href="https://www.linkedin.com/in/pham-brandon2/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>pham-brandon2</span>
              </a>
              <a href="mailto:pham-brandon@outlook.com" className="flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>pham-brandon@outlook.com</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-100 dark:border-blue-900/50 pt-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} MockPrep. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
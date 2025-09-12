import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="group flex items-center px-8 py-4">
      <motion.div 
        className="flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
        <span
          className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 animate-gradient-x group-hover:animate-pulse"
          style={{
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))',
          }}
        >
          MockPrep
        </span>
      </motion.div>
    </Link>
  );
};

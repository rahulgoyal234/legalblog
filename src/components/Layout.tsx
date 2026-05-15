import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './Navbar';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function Layout({ children, isAdmin = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans text-neutral-900">
      {!isAdmin && <Navbar isAdmin={isAdmin} />}
      <div className={cn(
        "bg-white min-h-screen transition-all duration-500 ease-out",
        !isAdmin ? "max-w-2xl mx-auto border-x border-neutral-100 px-8 md:px-12" : "w-full"
      )}>
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn("py-12 md:py-24", isAdmin ? "px-8" : "")}
        >
          {children}
        </motion.main>
        
        {!isAdmin && (
          <footer className="py-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 mt-12 bg-white">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              © {new Date().getFullYear()} Rahul Goyal Studio
            </div>
            <div className="flex gap-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors">Twitter</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

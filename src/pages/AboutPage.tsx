import { Layout } from '../components/Layout';
import { motion } from 'motion/react';

export function AboutPage() {
  return (
    <Layout>
      <header className="mb-16">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 mt-12"
        >
          The Curated Narrative
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-light tracking-tighter leading-tight max-w-2xl text-neutral-900"
        >
          Rahul Goyal.
        </motion.h1>
      </header>

      <div className="prose prose-neutral prose-lg md:prose-xl max-w-none text-neutral-600 font-medium">
        <p className="leading-relaxed mb-12 italic border-l-2 border-neutral-100 pl-8 py-2">
          I am a designer and developer focused on building digital experiences that are as beautiful as they are functional. This blog is a collection of my thoughts, experiments, and learnings along the way.
        </p>
        
        <div className="space-y-8">
          <p>
            With a background in computer science and a passion for minimalist design, I believe in the power of simplicity. Whether I'm writing code or architecting complex systems, I strive to find the most elegant solution.
          </p>
          <p>
            Synthesis is more than a blog; it's a practice of distilling complex ideas into functional insights. Here, utility meets aesthetics.
          </p>
        </div>

        <div className="mt-24 pt-12 border-t border-neutral-100 flex items-center space-x-8">
          <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center font-bold text-white text-xl">RG</div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-2">Get in touch</h3>
            <p className="text-neutral-400 font-medium tracking-tight">rahulgyl48@gmail.com</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

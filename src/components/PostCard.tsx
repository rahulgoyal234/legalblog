import { Link } from 'react-router-dom';
import { Post } from '../services/blogService';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <div className="mb-4 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
        {formatDate(post.createdAt)} — {post.category}
      </div>
      
      <Link to={`/post/${post.slug}`} className="block">
        <h2 className="text-4xl font-light tracking-tight text-neutral-900 mb-6 group-hover:text-neutral-600 transition-colors">
          {post.title}
        </h2>
        <div className="space-y-6 text-neutral-600 leading-relaxed max-w-xl text-sm md:text-base font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {post.excerpt}
        </div>
      </Link>
      
      <div className="mt-8 flex items-center gap-4">
        <Link 
          to={`/post/${post.slug}`}
          className="text-[10px] font-bold text-neutral-900 uppercase tracking-[0.25em] border-b border-neutral-900 pb-0.5 hover:border-transparent transition-all"
        >
          Read Entry
        </Link>
      </div>
    </article>
  );
}

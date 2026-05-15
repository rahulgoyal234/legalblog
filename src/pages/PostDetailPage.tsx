import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, Post } from '../services/blogService';
import { Layout } from '../components/Layout';
import { formatDate } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { ChevronLeft, Clock } from 'lucide-react';

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        const data = await getPostBySlug(slug);
        setPost(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin"></div>
      </div>
    </Layout>
  );

  if (!post) return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <Link to="/" className="text-blue-500 underline">Go back home</Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <header className="mb-16">
        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-8 mt-12">
          <span>{post.category}</span>
          <span className="w-1 h-1 bg-neutral-100 rounded-full"></span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 leading-tight mb-12">
          {post.title}
        </h1>
        <div className="h-px bg-neutral-100 w-full mb-16"></div>
      </header>

      <div className="prose prose-neutral max-w-none prose-lg md:prose-xl font-medium text-neutral-600 leading-relaxed selection:bg-neutral-900 selection:text-white">
         <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="mt-24 pt-12 border-t border-neutral-100">
        <Link to="/" className="text-[10px] font-bold text-neutral-900 uppercase tracking-[0.25em] border-b border-neutral-900 pb-0.5 hover:border-transparent transition-all">
          Back to Index
        </Link>
      </div>
    </Layout>
  );
}

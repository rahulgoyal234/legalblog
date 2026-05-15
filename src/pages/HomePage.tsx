import { useState, useEffect } from 'react';
import { getPublishedPosts, Post } from '../services/blogService';
import { PostCard } from '../components/PostCard';
import { Layout } from '../components/Layout';
import { motion } from 'motion/react';

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPublishedPosts();
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-6 h-6 border-2 border-neutral-100 border-t-neutral-900 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-24">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
        {posts.length === 0 && (
          <div className="py-20 text-center text-neutral-400">
            <p className="text-lg italic font-serif">Awaiting the first entry.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

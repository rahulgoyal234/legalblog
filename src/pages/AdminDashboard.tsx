import { useState, useEffect } from 'react';
import { getAllPosts, deletePost, Post } from '../services/blogService';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getAllPosts();
    setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      fetchPosts();
    }
  };

  return (
    <Layout isAdmin>
      <div className="flex h-screen overflow-hidden bg-[#F7F7F7]">
        {/* Admin Sidebar */}
        <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col h-full shrink-0">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold">RG</div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight">Rahul Goyal</h2>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Administrator</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">Control Panel</div>
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2 bg-neutral-100 rounded text-sm font-medium text-neutral-900 transition-colors">Dashboard</Link>
              <Link to="/" className="flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">View Site</Link>
              <Link to="/admin/new" className="flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">New Post</Link>
            </nav>
          </div>
          
          <div className="mt-auto p-6 border-t border-neutral-100">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-neutral-600">Database Healthy</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-light tracking-tight">Dashboard Overview</h1>
            <Link 
              to="/admin/new" 
              className="px-6 py-2 bg-neutral-900 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Construct Post
            </Link>
          </div>

          <div className="border border-neutral-100 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Post Detail</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm">{post.title}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1 font-bold">{formatDate(post.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                        post.status === 'published' ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-600"
                      )}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/edit/${post.id}`} className="p-2 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-900 transition-colors"><Edit2 size={16}/></Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded text-neutral-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
}

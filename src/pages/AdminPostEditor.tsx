import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createPost, updatePost, getPostById, Post } from '../services/blogService';
import { Layout } from '../components/Layout';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';

export function AdminPostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Design',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const post = await getPostById(id);
        if (post) {
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            status: post.status
          });
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (id) {
        await updatePost(id, formData);
      } else {
        await createPost(formData);
      }
      navigate('/admin');
    } catch (error) {
      alert("Error saving post. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  if (loading) return <Layout isAdmin><Loader2 className="w-8 h-8 animate-spin mx-auto mt-20" /></Layout>;

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
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-neutral-900 rounded text-sm font-medium transition-colors">Dashboard</Link>
              <Link to="/" className="flex items-center gap-3 px-3 py-2 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">View Site</Link>
              <Link to="/admin/new" className="flex items-center gap-3 px-3 py-2 bg-neutral-100 text-neutral-900 text-sm font-medium transition-colors">New Post</Link>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-3xl">
            <Link to="/admin" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 mb-8">
              <ChevronLeft className="w-3 h-3 mr-1" />
              Discard & Return
            </Link>

            <h2 className="text-3xl font-light tracking-tight mb-12">{id ? 'Refine Entry' : 'New Publication'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Post Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full bg-transparent border-b border-neutral-100 py-4 text-3xl font-light tracking-tight focus:border-neutral-900 outline-none transition-colors"
                    placeholder="The silent beauty of..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-transparent border-b border-neutral-100 py-3 text-sm font-medium focus:border-neutral-900 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option>Design</option>
                      <option>Tech</option>
                      <option>Life</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Publication State</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-transparent border-b border-neutral-100 py-3 text-sm font-medium focus:border-neutral-900 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Abstract / Excerpt</label>
                  <textarea 
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full bg-transparent border border-neutral-100 p-4 text-sm font-medium focus:border-neutral-900 outline-none transition-colors rounded"
                    placeholder="A brief distillation of the contents..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Body Composition (Markdown)</label>
                  <textarea 
                    required
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-neutral-50 border-neutral-100 border p-6 text-sm font-mono leading-relaxed focus:border-neutral-900 outline-none transition-colors rounded"
                    placeholder="Compose your thoughts..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-12 py-4 bg-neutral-900 text-white rounded text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center hover:bg-neutral-800 disabled:bg-neutral-200 transition-all shadow-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Save className="w-4 h-4 mr-3" />}
                  {id ? 'Commit Changes' : 'Execute Publication'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Layout>
  );
}

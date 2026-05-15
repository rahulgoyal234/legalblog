import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { setupAdminAccount } from '../services/authService';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const { loginEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowSetup(false);
    try {
      await loginEmail(username, password);
      navigate('/admin');
    } catch (err: any) {
      console.error("Login Error Details:", err);
      setError('Authentication failed. If this is your first time, click "Initialize" below.');
      
      // auth/invalid-credential is the generic error for "not found" or "wrong pass" in newer SDKs
      if (
        username === 'admin' && 
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.message?.includes('not found'))
      ) {
        setShowSetup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      await setupAdminAccount(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Setup failed. Ensure Email/Password auth is enabled in console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-neutral-900 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">Vault Access</div>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900">Entrance</h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Identity</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-neutral-900 transition-colors font-medium text-sm"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Security Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-100 py-3 outline-none focus:border-neutral-900 transition-colors font-medium text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-neutral-50 rounded border border-neutral-100">
               <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-relaxed">
                 <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                 {error}
               </p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-neutral-900 text-white rounded text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center hover:bg-neutral-800 disabled:bg-neutral-200 transition-all shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : 'Authenticate'}
            </button>

            {showSetup && (
              <button 
                type="button"
                onClick={handleSetup}
                className="w-full py-4 border border-neutral-900 text-neutral-900 rounded text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center hover:bg-neutral-50 transition-all"
              >
                Initialize Admin Account
              </button>
            )}
          </div>
          
          <div className="pt-8 text-center">
            <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-400">
              Authorized personnel only
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}

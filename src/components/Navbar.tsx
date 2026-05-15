import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogIn, LogOut, Settings, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const { user, login, logout } = useAuth();

  return (
    <header className="max-w-2xl mx-auto w-full pt-16 px-8 md:px-12 bg-white">
      <div className="border-b border-neutral-100 pb-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors">
            Synthesis — A Journal by Rahul Goyal
          </Link>
          <div className="flex items-center gap-4">
             {user ? (
               <button onClick={logout} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500">Sign Out</button>
             ) : (
               <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">Sign In</Link>
             )}
          </div>
        </div>
        
        <nav className="flex items-center justify-between">
          <div className="flex gap-8 text-sm font-medium text-neutral-900">
            <Link to="/" className="hover:text-neutral-400 transition-colors">Essays</Link>
            <Link to="/about" className="hover:text-neutral-400 transition-colors">About</Link>
            {isAdmin && <Link to="/admin" className="text-neutral-400 hover:text-neutral-900">Admin</Link>}
          </div>
          {isAdmin && (
            <Link to="/admin/new" className="text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-4 py-1.5 rounded">
              New Post
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

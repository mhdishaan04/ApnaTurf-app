import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const words = ["Book.", "Play.", "Conquer."];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-gray-200 p-4">
      <video autoPlay loop muted className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-30">
        <source src="https://cdn.pixabay.com/video/2023/02/28/152652-803732590_large.mp4" type="video/mp4" />
      </video>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto w-full">
        {/* Left Side: Branding and Animated Text */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">ApnaTurf</h1>
          <div className="mt-4 text-3xl md:text-5xl font-bold text-brand-primary h-12 md:h-16">
            <motion.span
              key={words[index]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="block"
            >
              {words[index]}
            </motion.span>
          </div>
          <p className="mt-4 text-md md:text-lg text-gray-300">
            Your ultimate destination for booking sports turfs and connecting with players near you.
          </p>
        </div>

        {/* Right Side: Login Panel */}
        <div className="w-full p-6 md:p-8 bg-brand-card/70 backdrop-blur-lg shadow-lg rounded-2xl border border-gray-700/50">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-white">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white p-3 rounded-lg hover:bg-blue-500 disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-primary hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
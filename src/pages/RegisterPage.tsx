import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          mobile_number: mobileNumber
        }
      }
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Registration successful! Please check your email to confirm your account.');
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-gray-200 p-4">
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-30"
      >
        <source src="https://cdn.pixabay.com/video/2023/02/28/152652-803732590_large.mp4" type="video/mp4" />
      </video>
      <div className="max-w-md w-full p-6 md:p-8 bg-brand-card/80 backdrop-blur-lg shadow-lg rounded-2xl border border-gray-700/50">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Create Your Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
          <input type="tel" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
          <input type="password" placeholder="Password (at least 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
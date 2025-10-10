import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white">ApnaTurf</h3>
          <p className="mt-2 text-sm">Your go-to destination for booking turf grounds.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-white"><Instagram size={20}/></a>
            <a href="#" className="hover:text-white"><Facebook size={20}/></a>
            <a href="#" className="hover:text-white"><Twitter size={20}/></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">Navigate</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/my-games" className="hover:text-white">My Games</Link></li>
            <li><Link to="/list-your-turf" className="hover:text-white">List Your Turf</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">About</h4>
           <ul className="mt-4 space-y-2 text-sm">
            {/* Corrected Links Start Here */}
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            {/* Corrected Links End Here */}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Legal</h4>
           <ul className="mt-4 space-y-2 text-sm">
            {/* Corrected Links Start Here */}
            <li><Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            {/* Corrected Links End Here */}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-10 pt-8 border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} ApnaTurf. All rights reserved.</p>
      </div>
    </footer>
  );
}
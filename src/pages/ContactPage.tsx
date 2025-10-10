import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-card/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-700/50"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Get In Touch</h1>
        <p className="mt-4 text-lg text-gray-300">
          Have a question, a suggestion, or need support? We'd love to hear from you.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-brand-primary" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Email</h3>
                <a href="mailto:support@apnaturf.com" className="text-gray-300 hover:text-brand-primary">support@apnaturf.com</a>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-brand-primary" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Phone</h3>
                <p className="text-gray-300">+91 12345 67890</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-brand-primary" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Address</h3>
                <p className="text-gray-300">Bondathila, Mangalore, Karnataka, India</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input type="text" id="name" placeholder="Your Name" className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input type="email" id="email" placeholder="Your Email" className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea id="message" placeholder="Your Message" rows={5} className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary" required></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-primary text-white p-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
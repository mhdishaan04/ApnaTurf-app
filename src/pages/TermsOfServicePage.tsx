import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-card/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-700/50 prose prose-invert prose-lg"
      >
        <h1 className="text-white">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: October 10, 2025</p>
        
        <p>Welcome to ApnaTurf. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use ApnaTurf if you do not agree to all of the terms and conditions stated on this page.</p>
        
        <h2>2. Bookings and Payments</h2>
        <p>All bookings made through ApnaTurf are subject to turf availability. Payments are processed securely, and a booking is not confirmed until full payment is received or all players in a matchmaking game have committed their share.</p>
        
        <h2>3. User Conduct</h2>
        <p>You agree not to use the service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the service in any way that could damage the platform, the services, or the general business of ApnaTurf.</p>

        <h2>4. Cancellations and Refunds</h2>
        <p>Cancellation policies are determined by the individual turf owners and will be clearly stated at the time of booking. ApnaTurf is not responsible for refunds outside of the stated policy.</p>
        
        <p className="mt-8 text-sm text-yellow-300">Disclaimer: This is a template Terms of Service. It is not legal advice. You should consult with a legal professional to create a policy that fits your specific needs.</p>
      </motion.div>
    </main>
  );
}
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-card/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-700/50 prose prose-invert prose-lg"
      >
        <h1 className="text-white">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: October 10, 2025</p>

        <p>ApnaTurf ("us", "we", or "our") operates the ApnaTurf website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>
        
        <h2>1. Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you. This includes your name, email address, and mobile number provided during registration.</p>
        
        <h2>2. Use of Data</h2>
        <p>ApnaTurf uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service, and to provide customer support.</p>
        
        <h2>3. Data Security</h2>
        <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        
        <h2>4. Service Providers</h2>
        <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

        <p className="mt-8 text-sm text-yellow-300">Disclaimer: This is a template Privacy Policy. It is not legal advice. You should consult with a legal professional to create a policy that is compliant and tailored to your business.</p>
      </motion.div>
    </main>
  );
}
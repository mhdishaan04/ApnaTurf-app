import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const { turfName, slot } = state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg inline-block">
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto" />
          <h1 className="text-4xl font-extrabold text-gray-900 mt-6">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your game at <strong>{turfName || 'the turf'}</strong> on <strong>{slot ? new Date(slot).toLocaleString() : ''}</strong> is all set.
          </p>
          <div className="mt-8">
            <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


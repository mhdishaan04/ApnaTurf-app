import Header from '../components/Header';
import Hero from '../components/Hero';
import SportsGrid from '../components/SportsGrid';
import FeaturedTurfs from '../components/FeaturedTurfs';
import Footer from '../components/Footer'; // We use the new Footer component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Hero />

      {/* Main content area */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Sport</h2>
            <p className="mt-2 text-md text-gray-500">Select a sport to find or host a game.</p>
          </div>
          <div className="mt-10">
            <SportsGrid />
          </div>
        </div>
      </div>

      <FeaturedTurfs />

      {/* How it works section */}
      <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-4">
                <h3 className="text-xl font-semibold">1. Find Your Game</h3>
                <p className="mt-2 text-gray-600">Choose your favorite sport and browse available turfs or join a game hosted by others.</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">2. Book Your Slot</h3>
                <p className="mt-2 text-gray-600">Easily book a turf for your team or pay your share to join a matchmaking game.</p>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">3. Connect & Play</h3>
                <p className="mt-2 text-gray-600">Connect with your new teammates, get on the field, and enjoy the game!</p>
              </div>
            </div>
         </div>
      </section>

      {/* Use the new Footer component */}
      <Footer />
    </div>
  );
}
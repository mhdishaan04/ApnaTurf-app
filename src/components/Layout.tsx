import React from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative z-0 text-gray-200">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-30"
      >
        <source src="https://cdn.pixabay.com/video/2023/02/28/152652-803732590_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* The main content now sits on top of the video */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Problems } from '@/components/landing/Problems';
import { Features } from '@/components/landing/Features';
import { Benefits } from '@/components/landing/Benefits';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Problems />
      <Features />
      <Benefits />
      <Pricing />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}

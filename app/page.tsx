// app/page.tsx
import './home.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CategorySection from './components/CategorySection';
import BestSellers from './components/BestSellers';
import Reviews from './components/Reviews';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import FloatingConsult from './components/FloatingConsult';

export default function Home() {
  return (
    <main className="home-theme-wrapper min-h-screen relative overflow-x-hidden selection:bg-[#00e0c6]/20">
      <div className="home-grain fixed"></div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        
        {/* 现货与预定板块 */}
        <div className="py-12">
          <CategorySection title="Ready To Ship" type="in-stock" />
          <CategorySection title="Upcoming Pre-Orders" type="pre-order" />
        </div>
        
        <BestSellers />
        <Reviews />
        <AboutUs />
        <Footer />
      </div>
      
      {/* <FloatingConsult /> */}
    </main>
  );
}
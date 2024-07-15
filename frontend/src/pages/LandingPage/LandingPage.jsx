import Footer from '@/components/Footer';
import AnalyticsSection from './components/AnalyticsSection';
import Header from './components/Header';
import ListingsCarousel from './components/ListingsCarousel';
import ReviewSection from './components/ReviewSection';

function LandingPage() {
  return (
    <main className="bg-gray-50">
      <Header />
      <div className="w-full h-[500px] bg-blue-200"></div>
      <AnalyticsSection />
      <ListingsCarousel />
      <ReviewSection />
      <Footer />
    </main>
  );
}

export default LandingPage;

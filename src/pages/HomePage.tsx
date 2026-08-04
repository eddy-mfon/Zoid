import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { CollectionsGrid } from '../components/home/CollectionsGrid';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { BrandEthos } from '../components/home/BrandEthos';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturedCollection />
      <CollectionsGrid />
      <TrendingCarousel />
      <BrandEthos />
    </main>
  );
};

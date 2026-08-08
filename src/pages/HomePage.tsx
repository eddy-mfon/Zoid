import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { CollectionsGrid } from '../components/home/CollectionsGrid';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { BrandEthos } from '../components/home/BrandEthos';
import { BirthdaySection } from '../components/home/BirthdaySection';
import { GymKitSection } from '../components/home/GymKitSection';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <BirthdaySection />
      <GymKitSection />
      <FeaturedCollection />
      <CollectionsGrid />
      <TrendingCarousel />
      <BrandEthos />
    </main>
  );
};

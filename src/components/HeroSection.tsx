
import React from 'react';
import { Button } from './components/ui/button';

const HeroSection: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-br from-blue-100 via-white to-green-100 py-20 px-4 flex items-center justify-center min-h-[60vh]">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Welcome to <span className="text-blue-600">Nortimed</span></h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8">Your trusted source for <span className="font-semibold text-green-700">nursery</span> and <span className="font-semibold text-blue-700">physiotherapy</span> products.</p>
                <Button asChild size="lg" className="px-8 py-3 text-lg font-semibold shadow-lg">
                  <a href="#products">Shop Now</a>
                </Button>
            </div>
        </section>
    );
};

export default HeroSection;
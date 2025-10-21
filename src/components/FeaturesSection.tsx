
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: 'High-Quality Materials',
            description: 'Our products are made from the best materials to ensure safety and durability.',
        },
        {
            title: 'Expert Design',
            description: 'Designed by professionals to meet the needs of both nurseries and physiotherapy.',
        },
        {
            title: 'User-Friendly',
            description: 'Easy to use products that enhance the experience for both caregivers and children.',
        },
        {
            title: 'Affordable Pricing',
            description: 'We offer competitive pricing without compromising on quality.',
        },
    ];

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center hover:shadow-xl transition">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-700">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
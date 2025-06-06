"use client"

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import products from '../data/products.json';
import ProductCard from '@/components/ProductCard';

export default function Home() {
    const router = useRouter();

    const handleProductClick = (productId) => {
        router.push(`/products/${productId}`);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div 
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
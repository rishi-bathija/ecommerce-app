"use client"

import Link from 'next/link';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { cartCount, cartTotal } = useCart();

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        ShopStyle
                    </Link>

                    <Link href="/cart" className="relative group">
                        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header; 
"use client"

import Link from 'next/link';
import CartItem from '../../components/CartItem';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';

export default function Cart() {
    const { cart } = useCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-8">
                        <FaShoppingCart className="text-3xl text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <FaShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />
                            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                            <Link href="/">
                                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                                {cart.map((item) => (
                                    <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
                                ))}
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="text-xl font-semibold">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-semibold">Total:</span>
                                        <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                                    </div>
                                    <Link href="/checkout">
                                        <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                            <span className="mr-2">Proceed to Checkout</span>
                                            <FaArrowRight />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
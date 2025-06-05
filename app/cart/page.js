"use client"

import Link from 'next/link';
import CartItem from '../../components/CartItem';
import { useCart } from '../../context/CartContext';

export default function Cart() {
    const { cart } = useCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
                    ))}
                    <div className="mt-4 text-right">
                        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
                        <Link href="/checkout">
                            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                                Proceed to Checkout
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
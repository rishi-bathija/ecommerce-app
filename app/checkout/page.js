"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
    const { cart, dispatch } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.address) {
            alert('Order placed successfully!');
            dispatch({ type: 'CLEAR_CART' });
            router.push('/');
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-md">
                    <div className="mb-4">
                        <label className="block font-semibold">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border p-2"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Place Order
                    </button>
                </form>
            )}
        </div>
    );
}
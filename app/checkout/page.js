"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { FaLock, FaCreditCard, FaShoppingBag, FaExclamationCircle } from "react-icons/fa";
import { memo } from "react";

// Define FormInput as a separate component
const FormInput = memo(({ label, name, type = "text", value, onChange, placeholder, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent transition-colors`}
            required
        />
        {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {error}
            </p>
        )}
    </div>
));

FormInput.displayName = "FormInput";

export default function Checkout() {
    const { cart, dispatch, isClient } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState(null);

    const total = isClient && cart ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    const validateForm = () => {
        const newErrors = {};
        const fields = {
            name: "Full Name",
            email: "Email",
            address: "Address",
            city: "City",
            postalCode: "Postal Code",
            country: "Country"
        };

        Object.entries(fields).forEach(([key, label]) => {
            if (!formData[key].trim()) {
                newErrors[key] = `${label} is required`;
            }
        });

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }, [errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setFormStatus({ type: 'error', message: 'Please fill in all required fields correctly.' });
            return;
        }

        setIsSubmitting(true);
        setFormStatus({ type: 'loading', message: 'Processing your order...' });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setFormStatus({ type: 'success', message: 'Order placed successfully! Redirecting...' });
            
            // First show success message
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Then clear cart and redirect
            dispatch({ type: "CLEAR_CART" });
            router.push("/");
            
        } catch (error) {
            setFormStatus({ type: 'error', message: 'There was an error processing your order. Please try again.' });
            setIsSubmitting(false);
        }
    };

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded max-w-md mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center mb-8">
                        <FaShoppingBag className="text-3xl text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <FaShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
                            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
                            <button
                                onClick={() => router.push('/')}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                                {formStatus && (
                                    <div className={`mb-6 p-4 rounded-lg ${formStatus.type === 'error' ? 'bg-red-50 text-red-700' :
                                        formStatus.type === 'success' ? 'bg-green-50 text-green-700' :
                                            'bg-blue-50 text-blue-700'
                                        }`}>
                                        <p className="flex items-center">
                                            {formStatus.type === 'loading' && (
                                                <span className="inline-block h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            )}
                                            {formStatus.message}
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <FormInput
                                        label="Full Name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                    />
                                    <FormInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                    <FormInput
                                        label="Address"
                                        name="address"
                                        placeholder="123 Main St"
                                        value={formData.address}
                                        onChange={handleChange}
                                        error={errors.address}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="City"
                                            name="city"
                                            placeholder="New York"
                                            value={formData.city}
                                            onChange={handleChange}
                                            error={errors.city}
                                        />
                                        <FormInput
                                            label="Postal Code"
                                            name="postalCode"
                                            placeholder="10001"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            error={errors.postalCode}
                                        />
                                    </div>
                                    <FormInput
                                        label="Country"
                                        name="country"
                                        placeholder="United States"
                                        value={formData.country}
                                        onChange={handleChange}
                                        error={errors.country}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full mt-6 py-4 px-6 rounded-lg flex items-center justify-center transition-colors ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="inline-block h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaLock className="mr-2" />
                                                Complete Order
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div>
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div
                                                key={`${item.id}-${item.size}-${item.color}`}
                                                className="flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {item.size} · {item.color} · Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
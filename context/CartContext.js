"use client"

import { createContext, useContext, useReducer, useState } from 'react';
import Toast from '../components/Toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItemIndex = state.findIndex(
                item => item.id === action.payload.id && 
                       item.size === action.payload.size && 
                       item.color === action.payload.color
            );

            if (existingItemIndex >= 0) {
                const newState = [...state];
                newState[existingItemIndex].quantity = (newState[existingItemIndex].quantity || 1) + 1;
                return newState;
            }

            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE_FROM_CART':
            return state.filter(item => !(
                item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
            ));
        case 'UPDATE_QUANTITY': {
            const { id, size, color, quantity } = action.payload;
            return state.map(item => {
                if (item.id === id && item.size === size && item.color === color) {
                    return { ...item, quantity };
                }
                return item;
            });
        }
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

export function CartProvider({ children }) {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleDispatch = (action) => {
        dispatch(action);
        
        // Show appropriate notifications
        switch (action.type) {
            case 'ADD_TO_CART':
                showNotification('Item added to cart!');
                break;
            case 'REMOVE_FROM_CART':
                showNotification('Item removed from cart', 'warning');
                break;
            case 'CLEAR_CART':
                showNotification('Cart cleared', 'info');
                break;
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            dispatch: handleDispatch, 
            cartTotal, 
            cartCount 
        }}>
            {children}
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
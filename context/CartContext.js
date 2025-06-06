"use client"

import { createContext, useContext, useReducer, useState, useEffect } from 'react';
import Toast from '../components/Toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
    let newState;
    
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItemIndex = state.findIndex(
                item => 
                    item.id === action.payload.id && 
                    item.size === action.payload.size && 
                    item.color === action.payload.color
            );

            if (existingItemIndex >= 0) {
                newState = [...state];
                newState[existingItemIndex] = {
                    ...newState[existingItemIndex],
                    quantity: (newState[existingItemIndex].quantity || 1) + (action.payload.quantity || 1)
                };
            } else {
                newState = [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
            }
            break;
        }

        case 'REMOVE_FROM_CART':
            newState = state.filter(item => !(
                item.id === action.payload.id && 
                item.size === action.payload.size && 
                item.color === action.payload.color
            ));
            break;

        case 'UPDATE_QUANTITY': {
            newState = state.map(item => {
                if (
                    item.id === action.payload.id &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color
                ) {
                    return { ...item, quantity: action.payload.quantity };
                }
                return item;
            });
            break;
        }

        case 'CLEAR_CART':
            newState = [];
            break;

        case 'INIT_CART':
            newState = action.payload;
            break;

        default:
            return state;
    }

    return newState;
};

export function CartProvider({ children }) {
    const [isClient, setIsClient] = useState(false);
    const [cart, dispatch] = useReducer(cartReducer, []);
    const [notification, setNotification] = useState(null);

    // Handle client-side initialization
    useEffect(() => {
        setIsClient(true);
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'INIT_CART', payload: Array.isArray(parsedCart) ? parsedCart : [] });
            }
        } catch (error) {
            console.error('Error reading cart from localStorage:', error);
        }
    }, []);

    // Handle cart updates
    useEffect(() => {
        if (isClient && cart.length >= 0) {
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
        }
    }, [cart, isClient]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        // Auto-hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDispatch = (action) => {
        dispatch(action);
        
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
            cartCount,
            isClient 
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
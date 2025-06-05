"use client"

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ColorSwatch = ({ color, selected, disabled, onClick }) => {
    // Convert color names to CSS colors
    const getColorCode = (colorName) => {
        const colorMap = {
            'Red': '#FF0000',
            'Blue': '#0000FF',
            'Green': '#008000',
            'Black': '#000000',
            'White': '#FFFFFF',
            // Add more colors as needed
        };
        return colorMap[colorName] || colorName;
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-8 h-8 rounded-full mr-2 border-2 transition-all duration-200
                ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-0'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
            style={{
                backgroundColor: getColorCode(color),
                borderColor: color.toLowerCase() === 'white' ? '#e5e5e5' : getColorCode(color)
            }}
            aria-label={color}
            title={disabled ? 'Not available with selected size' : color}
        />
    );
};

const SizeButton = ({ size, selected, disabled, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            px-4 py-2 mr-2 mb-2 rounded-md font-medium transition-all duration-200
            ${selected 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }
            ${disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105'
            }
        `}
    >
        {size}
    </button>
);

const VariantSelector = ({ product }) => {
    const { dispatch } = useCart();
    const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
    const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
    const [addedToCart, setAddedToCart] = useState(false);

    // Get all unique sizes and colors
    const allSizes = [...new Set(product.variants.map(v => v.size))];
    const allColors = [...new Set(product.variants.map(v => v.color))];

    // Get available colors for the selected size
    const availableColors = product.variants
        .filter(v => v.size === selectedSize)
        .map(v => v.color);

    // Get available sizes for the selected color
    const availableSizes = product.variants
        .filter(v => v.color === selectedColor)
        .map(v => v.size);

    // Find the selected variant
    const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );

    // If current combination becomes invalid, find the first valid combination
    useEffect(() => {
        if (!selectedVariant) {
            const firstValidVariant = product.variants[0];
            setSelectedSize(firstValidVariant.size);
            setSelectedColor(firstValidVariant.color);
        }
    }, [selectedSize, selectedColor, product.variants, selectedVariant]);

    const handleAddToCart = () => {
        if (selectedVariant && selectedVariant.stock > 0) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: {
                    id: product.id,
                    name: product.name,
                    size: selectedSize,
                    color: selectedColor,
                    price: selectedVariant.price,
                    image: product.image,
                },
            });
            
            // Show success animation
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } else {
            alert('Out of stock!');
        }
    };

    return (
        <div className="mt-4">
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                </label>
                <div className="flex flex-wrap">
                    {allSizes.map((size) => (
                        <SizeButton
                            key={size}
                            size={size}
                            selected={size === selectedSize}
                            disabled={!availableSizes.includes(size)}
                            onClick={() => setSelectedSize(size)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                </label>
                <div className="flex items-center">
                    {allColors.map((color) => (
                        <ColorSwatch
                            key={color}
                            color={color}
                            selected={color === selectedColor}
                            disabled={!availableColors.includes(color)}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>
            </div>

            {selectedVariant && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                ${selectedVariant.price}
                            </p>
                            <p className={`text-sm ${selectedVariant.stock < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                                {selectedVariant.stock === 0 
                                    ? 'Out of stock' 
                                    : selectedVariant.stock < 5 
                                        ? `Only ${selectedVariant.stock} left!` 
                                        : `${selectedVariant.stock} in stock`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock === 0 || addedToCart}
                        className={`
                            w-full py-3 px-8 rounded-lg font-medium text-white
                            transition-all duration-300 transform
                            ${addedToCart 
                                ? 'bg-green-500' 
                                : selectedVariant.stock === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                            }
                        `}
                    >
                        {addedToCart 
                            ? '✓ Added to Cart!' 
                            : selectedVariant.stock === 0 
                                ? 'Out of Stock' 
                                : 'Add to Cart'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default VariantSelector;
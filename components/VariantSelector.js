"use client"

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ColorSwatch = ({ color, selected, disabled, onClick }) => {
    const getColorCode = (colorName) => {
        const colorMap = {
            'Red': '#FF0000',
            'Blue': '#0000FF',
            'Green': '#008000',
            'Black': '#000000',
            'White': '#FFFFFF',
            'Grey': '#808080',
        };
        return colorMap[colorName] || colorName;
    };

    return (
        <div className="relative">
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    w-10 h-10 rounded-full transition-all duration-300
                    ${selected ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'ring-1 ring-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
                    ${color.toLowerCase() === 'white' ? 'bg-white' : ''}
                `}
                style={{
                    backgroundColor: getColorCode(color),
                }}
                aria-label={color}
                title={disabled ? 'Not available with selected size' : color}
            />
            {selected && (
                <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </span>
            )}
        </div>
    );
};

const SizeButton = ({ size, selected, disabled, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            min-w-[3rem] px-4 py-2.5 rounded-lg font-medium transition-all duration-300
            ${selected 
                ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2' 
                : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-600'
            }
            ${disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-md transform hover:-translate-y-0.5'
            }
            mr-3 mb-3
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

    // Get available combinations
    const getAvailableColors = (size) => {
        return product.variants
            .filter(v => v.size === size && v.stock > 0)
            .map(v => v.color);
    };

    const getAvailableSizes = (color) => {
        return product.variants
            .filter(v => v.color === color && v.stock > 0)
            .map(v => v.size);
    };

    // Find the selected variant
    const selectedVariant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
    );

    const handleSizeChange = (newSize) => {
        setSelectedSize(newSize);
        const availableColorsForSize = getAvailableColors(newSize);
        if (!availableColorsForSize.includes(selectedColor)) {
            setSelectedColor(availableColorsForSize[0]);
        }
    };

    const handleColorChange = (newColor) => {
        setSelectedColor(newColor);
        const availableSizesForColor = getAvailableSizes(newColor);
        if (!availableSizesForColor.includes(selectedSize)) {
            setSelectedSize(availableSizesForColor[0]);
        }
    };

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
                    quantity: 1  // Explicitly set quantity to 1
                },
            });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Size
                </label>
                <div className="flex flex-wrap">
                    {allSizes.map((size) => (
                        <SizeButton
                            key={size}
                            size={size}
                            selected={size === selectedSize}
                            disabled={!product.variants.some(v => v.size === size && v.stock > 0)}
                            onClick={() => handleSizeChange(size)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Color
                </label>
                <div className="flex items-center space-x-4">
                    {allColors.map((color) => (
                        <ColorSwatch
                            key={color}
                            color={color}
                            selected={color === selectedColor}
                            disabled={!product.variants.some(v => v.color === color && v.stock > 0)}
                            onClick={() => handleColorChange(color)}
                        />
                    ))}
                </div>
            </div>

            {selectedVariant && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                ${selectedVariant.price}
                            </p>
                            <p className={`
                                mt-1 text-sm
                                ${selectedVariant.stock < 5 ? 'text-red-500' : 'text-gray-500'}
                            `}>
                                {selectedVariant.stock === 0 
                                    ? 'Out of stock' 
                                    : selectedVariant.stock < 5 
                                        ? `Only ${selectedVariant.stock} left in stock!` 
                                        : `${selectedVariant.stock} available`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock === 0 || addedToCart}
                        className={`
                            w-full py-4 rounded-lg font-medium text-white text-lg
                            transition-all duration-300 transform
                            ${addedToCart 
                                ? 'bg-green-500' 
                                : selectedVariant.stock === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
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
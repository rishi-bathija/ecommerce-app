import Image from 'next/image';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
    const { dispatch } = useCart();

    const handleQuantityChange = (quantity) => {
        if (quantity < 1) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: item });
        } else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity } });
        }
    };

    return (
        <div className="flex items-center border-b py-4">
            <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="object-cover"
            />
            <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>
                    {item.size} / {item.color}
                </p>
                <p>${item.price}</p>
                <div className="flex items-center mt-2">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1"
                    >
                        -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1"
                    >
                        +
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}
                        className="ml-4 text-red-500"
                    >
                        Remove
                    </button>
                </div>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    );
};

export default CartItem;
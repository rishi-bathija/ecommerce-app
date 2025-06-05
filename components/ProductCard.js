import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="object-cover"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600 font-bold">${product.price}</p>
            <Link href={`/products/${product.id}`}>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                    View Details
                </button>
            </Link>
        </div>
    );
};

export default ProductCard;
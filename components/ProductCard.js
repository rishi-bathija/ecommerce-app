import Image from 'next/image';

const ProductCard = ({ product }) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="relative h-72 bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold">${product.variants[0].price}</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
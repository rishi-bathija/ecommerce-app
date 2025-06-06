import Image from "next/image";
import Link from "next/link";
import VariantSelector from "../../../components/VariantSelector";
import products from "../../../data/products.json";

export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

export default function ProductDetail({ params }) {
    const product = products.find((p) => p.id === parseInt(params.id));

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/2 bg-gray-100">
                            <div className="relative h-[500px]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="md:w-1/2 p-8">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {product.description}
                                </p>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <VariantSelector product={product} />
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Premium Quality Materials
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Free Shipping on Orders Over $50
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        30-Day Return Policy
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
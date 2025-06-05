import Image from "next/image";
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
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover"
                />
                <div className="md:ml-8 mt-4 md:mt-0">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                    <VariantSelector product={product} />
                </div>
            </div>
        </div>
    );
}
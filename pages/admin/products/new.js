import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">New Product</h1>
            <ProductForm />
        </Layout>
    )
}
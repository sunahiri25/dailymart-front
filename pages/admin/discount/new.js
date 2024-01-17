import Layout from "@/components/Layout";
import DiscountForm from "@/components/DiscountForm";

export default function NewDiscount() {

    return (
        <Layout>
            <h1 className="text-blue-900 text-lg">New Discount</h1>
            <DiscountForm />
        </Layout>
    )
}
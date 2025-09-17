'use client';
import { Suspense } from 'react'

import { Header } from "@/components/common/Header";
import { ProductResearch } from "@/components/research/ProductResearch";

function ProductResearchPageContent() {
    return (
        <>
            <Header
                title="Product Research"
                description="Generate product ideas from a category and create a comprehensive business report."
            />
            <ProductResearch />
        </>
    )
}

export default function ProductResearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductResearchPageContent />
        </Suspense>
    )
}

import Filters from "@/components/ui/filters";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="grid grid-cols-4 gap-4 container py-10 relative items-start">
            <div className="col-span-1 sticky top-5">
                <Filters />
            </div>
            <div className="col-span-3">
                {children}
            </div>
        </section>
    )
}

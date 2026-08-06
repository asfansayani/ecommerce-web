import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFoundContent() {
  return (
    <div
      className="flex min-h-[80vh] items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 35%, #F5EFE6 0%, #FCFAF7 45%, #FFFFFF 100%)",
      }}
    >
      <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center md:py-28">
        <p className="mb-6 font-boska-medium text-[72px] leading-none tracking-tight text-quaternary/40 md:text-[96px]">
          404
        </p>

        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-quaternary md:text-xs">
          Page Not Found
        </p>

        <h1 className="font-boska-bold text-[32px] leading-[1.15] text-primary md:text-5xl">
          This Page Has Wandered Off
        </h1>

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-500 md:text-[15px]">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-12 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/shop/collections" />}
            className="h-12 w-full rounded-md border-primary/80 bg-transparent px-7 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/5 sm:w-auto"
          >
            Browse Shop
          </Button>

          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/" />}
            className="h-12 w-full rounded-md bg-tertiary px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90 sm:w-auto"
          >
            Back to Home
            <ArrowRight className="size-4 rtl:rotate-180" data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </div>
  );
}

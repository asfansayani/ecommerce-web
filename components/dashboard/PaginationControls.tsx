import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function buildHref(basePath: string, page: number) {
  const [pathname, existingQuery = ""] = basePath.split("?");
  const params = new URLSearchParams(existingQuery);

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];

  if (currentPage > 3) items.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (currentPage < totalPages - 2) items.push("ellipsis");

  items.push(totalPages);
  return items;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages = getPageItems(currentPage, totalPages);
  const prevHref = buildHref(basePath, Math.max(1, currentPage - 1));
  const nextHref = buildHref(basePath, Math.min(totalPages, currentPage + 1));

  return (
    <Pagination>
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious
            href={prevHref}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildHref(basePath, page)}
                isActive={page === currentPage}
                className={page === currentPage ? "bg-[#F0F0F0]" : "text-[#808080]"}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={nextHref}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

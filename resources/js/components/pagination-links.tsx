import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

const EDGE_PAGE_LIMIT = 4;
const SIBLING_PAGE_LIMIT = 1;

type VisiblePaginationLink = PaginationLink | 'ellipsis';

function visiblePaginationLinks(
    links: PaginationLink[],
): VisiblePaginationLink[] {
    const pageLinks = links.filter((link) => /^\d+$/.test(link.label));

    if (pageLinks.length <= EDGE_PAGE_LIMIT * 2) {
        return links;
    }

    const previousLink = links[0];
    const nextLink = links[links.length - 1];
    const currentPageIndex = pageLinks.findIndex((link) => link.active);

    if (currentPageIndex === -1) {
        return links;
    }

    const visiblePages = new Set<PaginationLink>();

    pageLinks
        .slice(0, EDGE_PAGE_LIMIT)
        .forEach((link) => visiblePages.add(link));
    pageLinks.slice(-EDGE_PAGE_LIMIT).forEach((link) => visiblePages.add(link));

    const siblingStart = Math.max(0, currentPageIndex - SIBLING_PAGE_LIMIT);
    const siblingEnd = Math.min(
        pageLinks.length - 1,
        currentPageIndex + SIBLING_PAGE_LIMIT,
    );

    pageLinks
        .slice(siblingStart, siblingEnd + 1)
        .forEach((link) => visiblePages.add(link));

    const visiblePageLinks = pageLinks.filter((link) => visiblePages.has(link));
    const condensedLinks: VisiblePaginationLink[] = [];

    visiblePageLinks.forEach((link, index) => {
        const previousPage = visiblePageLinks[index - 1];

        if (
            previousPage &&
            Number(link.label) - Number(previousPage.label) > 1
        ) {
            condensedLinks.push('ellipsis');
        }

        condensedLinks.push(link);
    });

    return [
        ...(previousLink ? [previousLink] : []),
        ...condensedLinks,
        ...(nextLink ? [nextLink] : []),
    ];
}

export function PaginationLinks({ links }: { links: PaginationLink[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {visiblePaginationLinks(links).map((link, index) => {
                if (link === 'ellipsis') {
                    return (
                        <Button
                            key={`pagination-ellipsis-${index}`}
                            variant="outline"
                            size="sm"
                            disabled
                        >
                            ...
                        </Button>
                    );
                }

                return (
                    <Button
                        key={`${link.label}-${link.url ?? index}`}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        asChild={Boolean(link.url)}
                    >
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveScroll
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}

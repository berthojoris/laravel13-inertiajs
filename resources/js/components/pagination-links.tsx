import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

const EDGE_PAGE_LIMIT = 4;

function visiblePaginationLinks(
    links: PaginationLink[],
): Array<PaginationLink | 'ellipsis'> {
    const pageLinks = links.filter((link) => /^\d+$/.test(link.label));

    if (pageLinks.length <= EDGE_PAGE_LIMIT * 2) {
        return links;
    }

    const firstPageLinks = pageLinks.slice(0, EDGE_PAGE_LIMIT);
    const lastPageLinks = pageLinks.slice(-EDGE_PAGE_LIMIT);
    const previousLink = links[0];
    const nextLink = links[links.length - 1];

    return [
        ...(previousLink ? [previousLink] : []),
        ...firstPageLinks,
        'ellipsis',
        ...lastPageLinks,
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
                            key="pagination-ellipsis"
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

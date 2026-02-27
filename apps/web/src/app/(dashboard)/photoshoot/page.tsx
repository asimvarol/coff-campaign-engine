import Link from 'next/link'

import { Button } from '@repo/ui'

import { Camera01Icon, PlusSignIcon } from '@/lib/icons'
import { PhotoshootCard } from '@/components/photoshoot/photoshoot-card'
import { PhotoshootEmptyState } from '@/components/photoshoot/empty-state'
import { getPhotoshoots } from '@/lib/mock-data/photoshoots'

interface PhotoshootPageProps {
  searchParams: {
    page?: string
    limit?: string
  }
}

/**
 * Photoshoot Studio main page
 * Displays list of all photoshoots with pagination
 */
export default function PhotoshootPage({ searchParams }: PhotoshootPageProps) {
  const page = parseInt(searchParams.page ?? '1', 10)
  const limit = parseInt(searchParams.limit ?? '12', 10)

  const { data: photoshoots, pagination } = getPhotoshoots({ page, limit })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photoshoot Studio</h1>
          <p className="mt-1 text-muted-foreground">
            AI-powered product photography with professional backgrounds
          </p>
        </div>
        <Button asChild>
          <Link href="/photoshoot/create" aria-label="Create new photoshoot">
            <PlusSignIcon className="mr-2 h-5 w-5" />
            New Photoshoot
          </Link>
        </Button>
      </div>

      {photoshoots.length === 0 ? (
        <PhotoshootEmptyState />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photoshoots.map((photoshoot) => (
              <PhotoshootCard key={photoshoot.id} photoshoot={photoshoot} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of{' '}
                {pagination.total} photoshoots
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  asChild={page > 1}
                  aria-label="Previous page"
                >
                  {page > 1 ? (
                    <Link href={`/photoshoot?page=${page - 1}&limit=${limit}`}>Previous</Link>
                  ) : (
                    <span>Previous</span>
                  )}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                    // Show first, last, current, and adjacent pages
                    if (
                      p === 1 ||
                      p === pagination.totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    ) {
                      return (
                        <Button
                          key={p}
                          variant={p === page ? 'default' : 'outline'}
                          size="sm"
                          asChild={p !== page}
                          disabled={p === page}
                          aria-label={`Page ${p}`}
                          aria-current={p === page ? 'page' : undefined}
                        >
                          {p !== page ? (
                            <Link href={`/photoshoot?page=${p}&limit=${limit}`}>{p}</Link>
                          ) : (
                            <span>{p}</span>
                          )}
                        </Button>
                      )
                    }

                    // Show ellipsis
                    if (p === page - 2 || p === page + 2) {
                      return (
                        <span key={p} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }

                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  asChild={page < pagination.totalPages}
                  aria-label="Next page"
                >
                  {page < pagination.totalPages ? (
                    <Link href={`/photoshoot?page=${page + 1}&limit=${limit}`}>Next</Link>
                  ) : (
                    <span>Next</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

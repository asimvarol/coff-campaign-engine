import { ModeCards } from '@/components/photoshoot/mode-cards'
import { PhotoshootStats } from '@/components/photoshoot/photoshoot-stats'
import { PhotoshootCard } from '@/components/photoshoot/photoshoot-card'
import { RECENT_PHOTOSHOOTS, getPhotoshootStats } from '@/lib/mock-data/photoshoots'

export default function PhotoshootPage() {
  const stats = getPhotoshootStats()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Photoshoot Studio</h1>
        <p className="text-muted-foreground">
          AI-powered product photography and creative generation
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <PhotoshootStats
          totalShoots={stats.totalShoots}
          thisMonth={stats.thisMonth}
          creditsUsed={stats.creditsUsed}
        />
      </div>

      {/* Mode Cards */}
      <div className="mb-8">
        <ModeCards />
      </div>

      {/* Recent Photoshoots */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Photoshoots</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECENT_PHOTOSHOOTS.map((photoshoot) => (
            <PhotoshootCard key={photoshoot.id} photoshoot={photoshoot} />
          ))}
        </div>
      </div>
    </div>
  )
}

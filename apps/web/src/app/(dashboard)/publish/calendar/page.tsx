'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContentUI,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
} from '@repo/ui'
import { mockScheduledPosts, getPlatform, type ScheduledPost } from '@/lib/mock-data/publish'
import { toast } from 'sonner'
import {
  ChevronLeft01Icon,
  ChevronRight01Icon,
  Calendar03Icon,
  Edit02Icon,
  Delete02Icon,
} from '@/lib/icons'

type ViewMode = 'month' | 'week'

export default function PublishCalendarPage() {
  useEffect(() => { document.title = 'Content Calendar | Coff' }, [])

  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [posts, setPosts] = useState<ScheduledPost[]>(mockScheduledPosts)
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/publish/posts')
        if (res.ok) {
          const data = await res.json()
          if (data.data && data.data.length > 0) {
            setPosts(data.data)
            return
          }
        }
      } catch {}
    }
    fetchPosts()
  }, [])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getWeekDays = () => {
    const days: Date[] = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    
    return days
  }

  const handleCancelPost = async () => {
    if (!selectedPost) return
    try {
      await fetch(`/api/publish/posts/${selectedPost.id}`, { method: 'DELETE' })
      setPosts(prev => prev.filter(p => p.id !== selectedPost.id))
      toast.success('Post cancelled')
    } catch {
      toast.error('Failed to cancel post')
    }
    setSelectedPost(null)
    setCancelAlertOpen(false)
  }

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledFor)
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const monthDays = viewMode === 'month' ? getMonthDays() : []
  const weekDays = viewMode === 'week' ? getWeekDays() : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Content Calendar</h1>
          <p className="mt-2 text-muted-foreground">
            {viewMode === 'month'
              ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : `Week of ${weekDays[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev'))}
          >
            <ChevronLeft01Icon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (viewMode === 'month' ? navigateMonth('next') : navigateWeek('next'))}
          >
            <ChevronRight01Icon className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild>
          <Link href="/publish/schedule">
            <Calendar03Icon className="mr-2 h-4 w-4" />
            Schedule Post
          </Link>
        </Button>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="border-r border-border p-2 text-center text-sm font-medium last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="min-h-[120px] border-b border-r border-border bg-muted/30" />
              }

              const posts = getPostsForDate(date)
              const today = isToday(date)

              return (
                <div
                  key={date.toISOString()}
                  className={`group min-h-[120px] border-b border-r border-border p-2 transition-colors hover:bg-muted/50 last:border-r-0 ${
                    today ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`mb-2 text-sm font-medium ${today ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {posts.slice(0, 3).map((post) => {
                      const platform = getPlatform(post.platform)
                      const time = new Date(post.scheduledFor)
                      return (
                        <button
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          title={post.caption}
                          className="flex w-full items-center gap-1 rounded border border-border bg-card p-1 text-xs transition-colors hover:bg-muted"
                        >
                          <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded bg-muted">
                            <img
                              src={post.creativeThumbnail}
                              alt="Post preview image"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{platform?.icon}</span>
                          <span className="truncate">
                            {time.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="hidden sm:inline truncate">{post.caption.slice(0, 20)}</span>
                        </button>
                      )
                    })}
                    {posts.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{posts.length - 3} more
                      </div>
                    )}
                  </div>
                  {posts.length === 0 && (
                    <button className="w-full rounded border-2 border-dashed border-transparent py-2 text-xs text-muted-foreground opacity-0 transition-all duration-200 group-hover:border-border group-hover:text-foreground group-hover:opacity-100">
                      + Add Post
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map((date) => {
              const today = isToday(date)
              return (
                <div
                  key={date.toISOString()}
                  className={`border-r border-border p-3 text-center last:border-r-0 ${
                    today ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${today ? 'text-primary' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-7">
            {weekDays.map((date) => {
              const posts = getPostsForDate(date)
              const today = isToday(date)

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-[400px] space-y-2 border-r border-border p-2 last:border-r-0 ${
                    today ? 'bg-primary/5' : ''
                  }`}
                >
                  {posts.map((post) => {
                    const platform = getPlatform(post.platform)
                    const time = new Date(post.scheduledFor)
                    return (
                      <button
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="flex w-full flex-col gap-2 rounded-lg border border-border bg-card p-2 text-left transition-colors hover:bg-muted"
                      >
                        <div className="h-20 w-full overflow-hidden rounded bg-muted">
                          <img
                            src={post.creativeThumbnail}
                            alt="Post preview image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <span>{platform?.icon}</span>
                            <span className="font-medium">
                              {time.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {post.caption}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scheduled Post</DialogTitle>
            <DialogDescription>View and manage this scheduled post</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedPost.creativeThumbnail}
                  alt="Creative"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatform(selectedPost.platform)?.icon}</span>
                    <span className="font-medium">
                      {getPlatform(selectedPost.platform)?.name}
                    </span>
                  </div>
                  <Badge>{selectedPost.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Scheduled for{' '}
                  {new Date(selectedPost.scheduledFor).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-sm">
                  {selectedPost.caption}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/publish/schedule">
                    <Edit02Icon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => setCancelAlertOpen(true)}>
                  <Delete02Icon className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelAlertOpen} onOpenChange={setCancelAlertOpen}>
        <AlertDialogContentUI>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this scheduled post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelPost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContentUI>
      </AlertDialog>
    </div>
  )
}

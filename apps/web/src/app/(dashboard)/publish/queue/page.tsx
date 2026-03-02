'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Checkbox,
} from '@repo/ui'
import { mockScheduledPosts, getPlatform, type PostStatus, type Platform } from '@/lib/mock-data/publish'
import {
  Search01Icon,
  Filter01Icon,
  Edit02Icon,
  Delete02Icon,
  RefreshIcon,
  Calendar03Icon,
} from '@/lib/icons'

export default function PublishQueuePage() {
  const [posts, setPosts] = useState(mockScheduledPosts)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [filterPlatform, setFilterPlatform] = useState<Platform | '__all__'>('__all__')
  const [filterStatus, setFilterStatus] = useState<PostStatus | '__all__'>('__all__')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter((post) => {
    const platformMatch = filterPlatform === '__all__' || post.platform === filterPlatform
    const statusMatch = filterStatus === '__all__' || post.status === filterStatus
    const searchMatch =
      searchQuery === '' ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    return platformMatch && statusMatch && searchMatch
  })

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id))
    }
  }

  const handleSelectPost = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleCancelSelected = () => {
    if (confirm(`Cancel ${selectedIds.length} selected post(s)?`)) {
      setPosts(posts.filter((p) => !selectedIds.includes(p.id)))
      setSelectedIds([])
    }
  }

  const handleRetry = (id: string) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, status: 'queued' as PostStatus, error: undefined } : p
      )
    )
  }

  const handleCancel = (id: string) => {
    if (confirm('Cancel this scheduled post?')) {
      setPosts(posts.filter((p) => p.id !== id))
    }
  }

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  })

  const statusBadgeVariant = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'failed':
        return 'destructive'
      case 'publishing':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const statusLabel = (status: PostStatus) => {
    switch (status) {
      case 'queued':
        return '◷ Queued'
      case 'scheduled':
        return '📅 Scheduled'
      case 'publishing':
        return '⏳ Publishing'
      case 'published':
        return '✓ Published'
      case 'failed':
        return '✗ Failed'
      default:
        return status
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Queue</h1>
          <p className="mt-2 text-muted-foreground">
            Manage scheduled and queued posts
          </p>
        </div>
        <Button>
          <Calendar03Icon className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search01Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterPlatform} onValueChange={(v) => setFilterPlatform(v as Platform | '__all__')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="x">X</SelectItem>
              <SelectItem value="pinterest">Pinterest</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as PostStatus | '__all__')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Status</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="publishing">Publishing</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="border-primary">
          <CardContent className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">
              {selectedIds.length} post(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelSelected}
              >
                Cancel Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue List */}
      <Card>
        <div className="divide-y divide-border">
          {/* Header Row */}
          <div className="flex items-center gap-4 px-4 py-3">
            <Checkbox
              checked={
                filteredPosts.length > 0 && selectedIds.length === filteredPosts.length
              }
              onCheckedChange={handleSelectAll}
            />
            <div className="flex-1 text-sm font-medium text-muted-foreground">
              Post Details
            </div>
            <div className="hidden w-32 text-sm font-medium text-muted-foreground sm:block">
              Status
            </div>
            <div className="w-24 text-sm font-medium text-muted-foreground">Actions</div>
          </div>

          {/* Posts */}
          {sortedPosts.map((post) => {
            const platform = getPlatform(post.platform)
            const scheduledDate = new Date(post.scheduledFor)
            const isUpcoming = scheduledDate > new Date()
            const isSelected = selectedIds.includes(post.id)

            return (
              <div
                key={post.id}
                className={`flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50 ${
                  isSelected ? 'bg-primary/5' : ''
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectPost(post.id)}
                />

                {/* Thumbnail */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={post.creativeThumbnail}
                    alt="Creative"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {platform?.icon} {platform?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {scheduledDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {post.caption}
                  </p>
                  {post.error && (
                    <p className="line-clamp-1 text-xs text-destructive">
                      {post.error}
                    </p>
                  )}
                  {post.postUrl && (
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View Post →
                    </a>
                  )}
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block">
                  <Badge variant={statusBadgeVariant(post.status)}>
                    {statusLabel(post.status)}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  {post.status === 'failed' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetry(post.id)}
                    >
                      <RefreshIcon className="h-4 w-4" />
                    </Button>
                  ) : post.status === 'scheduled' || post.status === 'queued' ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Edit02Icon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(post.id)}
                      >
                        <Delete02Icon className="h-4 w-4" />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            )
          })}

          {filteredPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar03Icon className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No posts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || filterPlatform !== '__all__' || filterStatus !== '__all__'
                  ? 'Try adjusting your filters'
                  : 'Schedule your first post to get started'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, ProgressStepper, type Step } from '@repo/ui'
import { ArrowRight01Icon, Loader2Icon, Sparkles01Icon } from '@/lib/icons'

const ANALYSIS_STEPS: Step[] = [
  { label: 'Scanning website...', description: 'Analyzing page structure and content' },
  { label: 'Extracting colors...', description: 'Identifying brand color palette' },
  { label: 'Analyzing typography...', description: 'Detecting fonts and text styles' },
  { label: 'Learning brand voice...', description: 'Understanding tone and personality' },
  { label: 'Generating summary...', description: 'Creating brand DNA profile' },
]

export default function NewBrandPage() {
  useEffect(() => { document.title = 'New Brand | Coff' }, [])

  const router = useRouter()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Normalize URL: add https:// if missing
    let normalizedUrl = url.trim()
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(normalizedUrl)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        setError('Please enter a valid HTTP/HTTPS URL')
        return
      }
    } catch {
      setError('Please enter a valid URL (e.g. example.com)')
      return
    }

    setError('')
    setIsAnalyzing(true)
    setCurrentStep(0)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Simulate step progress
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        if (controller.signal.aborted) return
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Call API to analyze
      const response = await fetch('/api/brands/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl }),
        signal: controller.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      // Navigate to brand detail page
      router.push(`/brand/${data.data.id}`)
    } catch (err: any) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Failed to analyze brand')
      setIsAnalyzing(false)
      setCurrentStep(-1)
    }
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    setIsAnalyzing(false)
    setCurrentStep(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {!isAnalyzing ? (
          <Card className="p-12">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Sparkles01Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create Brand DNA</h1>
              <p className="text-muted-foreground">
                Enter a website URL to extract brand identity, colors, fonts, and voice
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="url"
                  required
                  placeholder="example.com or www.example.com"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); if (error) setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  className="h-14 text-lg"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'url-error' : undefined}
                  autoFocus
                />
                {error && (
                  <p id="url-error" className="text-sm text-destructive mt-2" role="alert">{error}</p>
                )}
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={handleAnalyze}
              >
                Analyze Brand
                <ArrowRight01Icon className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Analysis takes 5-10 seconds • Uses 20 credits
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-12">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Loader2Icon className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Analyzing Brand DNA</h1>
              <p className="text-muted-foreground">
                Extracting brand identity from <span className="font-medium">{url}</span>
              </p>
            </div>

            <ProgressStepper steps={ANALYSIS_STEPS} currentStep={currentStep} />

            <div className="mt-8 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Please wait, this will take a few moments...
              </p>
              <Button variant="outline" onClick={handleCancel}>Cancel Analysis</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { FileText01Icon, Download04Icon, Calendar03Icon } from '@/lib/icons'
import {
  mockReportTemplates,
  mockGeneratedReports,
  mockScheduledReports,
} from '@/lib/mock-data/analytics'

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true)
    setSelectedTemplate(templateId)
    
    // Mock generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsGenerating(false)
    setSelectedTemplate(null)
    
    // Would normally add to reports history here
    alert('Report generated! Download would start here.')
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate, schedule, and export performance reports
        </p>
      </div>

      {/* Report Templates */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Report Templates</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {mockReportTemplates.map((template) => (
            <Card key={template.id} className="transition-all hover:border-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText01Icon className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.type}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.includesSections.map((section) => (
                      <span
                        key={section}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateReport(template.id)}
                    disabled={isGenerating && selectedTemplate === template.id}
                    className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isGenerating && selectedTemplate === template.id
                      ? 'Generating...'
                      : 'Generate Report'}
                  </button>
                  <button className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
                    Preview
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Choose your preferred export format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <FileText01Icon className="text-destructive" size={24} />
              </div>
              <div>
                <p className="font-medium">PDF Report</p>
                <p className="text-sm text-muted-foreground">
                  Formatted report with charts and branding
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Download04Icon className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-medium">CSV Export</p>
                <p className="text-sm text-muted-foreground">
                  Raw data for further analysis
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Scheduled Reports</h2>
        <Card>
          <CardContent className="p-0">
            {mockScheduledReports.length > 0 ? (
              <div className="divide-y divide-border">
                {mockScheduledReports.map((scheduled) => (
                  <div
                    key={scheduled.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar03Icon className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{scheduled.templateName}</p>
                        <p className="text-sm text-muted-foreground">
                          {scheduled.frequency.charAt(0).toUpperCase() + scheduled.frequency.slice(1)} •{' '}
                          Next: {new Date(scheduled.nextRunAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">Recipients:</p>
                        <p className="font-medium">{scheduled.recipients.length}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-md bg-background px-3 py-1 text-xs font-medium hover:bg-muted">
                          Edit
                        </button>
                        <button className="rounded-md bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20">
                          Pause
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">No scheduled reports</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report History */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Report History</h2>
        <Card>
          <CardContent className="p-0">
            {mockGeneratedReports.length > 0 ? (
              <div className="divide-y divide-border">
                {mockGeneratedReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText01Icon size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{report.templateName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.dateRange.start).toLocaleDateString()} -{' '}
                          {new Date(report.dateRange.end).toLocaleDateString()} •{' '}
                          {report.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                      <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                        <Download04Icon size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">No reports generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

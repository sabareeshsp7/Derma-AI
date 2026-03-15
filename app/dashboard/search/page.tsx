"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Filter, Globe, Info, Search, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SearchResult {
  title: string
  url: string
  snippet: string
  domain: string
  publishedTime: string | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchMode, setSearchMode] = useState("auto")
  const [apiKey, setApiKey] = useState("")
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [domain, setDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [initialQuery])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, this would call your backend API
      // which would then call the xAI Live Search API
      // For demo purposes, we'll simulate results
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockResults: SearchResult[] = [
        {
          title: "Understanding Skin Conditions: Types, Symptoms, and Treatments",
          url: "https://example.com/skin-conditions-guide",
          snippet:
            "Comprehensive guide to different types of skin conditions including melanoma, basal cell conditions, and squamous cell conditions. Learn about early warning signs and treatment options.",
          domain: "example.com",
          publishedTime: "2023-11-15T14:30:00Z",
        },
        {
          title: "Latest Advancements in Dermatological AI Diagnostics",
          url: "https://medjournal.org/ai-dermatology",
          snippet:
            "Recent breakthroughs in artificial intelligence are revolutionizing how dermatologists diagnose skin conditions. AI models can now detect potential skin conditions with accuracy comparable to expert dermatologists.",
          domain: "medjournal.org",
          publishedTime: "2024-02-28T09:15:00Z",
        },
        {
          title: "Preventative Measures for Reducing Skin Cancer Risk",
          url: "https://healthguide.com/skin-protection",
          snippet:
            "Dermatologists recommend daily sunscreen application, regular skin checks, and avoiding tanning beds to reduce the risk of developing skin cancer. Early detection remains crucial for successful treatment.",
          domain: "healthguide.com",
          publishedTime: "2024-04-10T16:45:00Z",
        },
        {
          title: "Machine Learning Models for Carcinoma Detection: A Review",
          url: "https://techmed.ai/ml-carcinoma-review",
          snippet:
            "This comprehensive review examines various machine learning approaches for detecting carcinoma cells in medical imaging, comparing CNN, transformer, and hybrid architectures.",
          domain: "techmed.ai",
          publishedTime: "2024-03-05T11:20:00Z",
        },
        {
          title: "Patient Outcomes Improve with AI-Assisted Diagnosis",
          url: "https://medicalnews.com/ai-diagnosis-outcomes",
          snippet:
            "A recent study shows that when dermatologists use AI tools as a diagnostic aid, patient outcomes improve significantly, with earlier detection and more accurate treatment planning.",
          domain: "medicalnews.com",
          publishedTime: "2024-01-18T08:30:00Z",
        },
      ]

      setResults(mockResults)
    } catch (err) {
      setError("An error occurred while searching. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return "Unknown date"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">xAI Live Search</h1>
        <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Free Beta until June 5, 2025
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search the web with xAI..."
                className="w-full pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Search mode:</span>
              <Select value={searchMode} onValueChange={setSearchMode}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="on">Always On</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Search Filters</h4>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Domain restriction</label>
                    <Input placeholder="e.g., example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {fromDate ? format(fromDate, "PPP") : "From date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {toDate ? format(toDate, "PPP") : "To date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDomain("")
                        setFromDate(undefined)
                        setToDate(undefined)
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowApiKeyInput(!showApiKeyInput)}>
              <Info className="h-3.5 w-3.5 mr-1" />
              API Key
            </Button>
          </div>

          {showApiKeyInput && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">xAI API Key</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowApiKeyInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                For testing only. In production, store your API key securely on the server.
              </div>
              <Input
                type="password"
                placeholder="Enter your xAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}

          <Separator className="my-6" />

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Showing {results.length} results for &quot;{query}&quot;
              </p>

              {results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      {result.title}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </h2>
                  <p className="text-muted-foreground">{result.snippet}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{result.domain}</span>
                    </div>
                    {result.publishedTime && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(result.publishedTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Results</Button>
              </div>
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
            </div>
          ) : null}
        </div>

        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>How to use xAI Live Search API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Get API Key</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Sign up at{" "}
                      <a
                        href="https://console.x.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        https://console.x.ai
                      </a>{" "}
                      to get your API key.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>API Documentation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm space-y-2">
                      <li>
                        <a
                          href="https://docs.x.ai/docs/guides/live-search"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Live Search Guide
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://docs.x.ai/docs/guides/streaming-response"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Streaming Response Guide
                        </a>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Configuration Options</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm space-y-2">
                      <li>
                        <code>search_parameters.mode</code>: auto, on, or off
                      </li>
                      <li>
                        <code>max_search_results</code>: Number of results
                      </li>
                      <li>
                        <code>domain_list</code>: Restrict to domains
                      </li>
                      <li>
                        <code>date_range</code>: Filter by date
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Free Beta Period</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      The xAI Live Search API is free to use during the beta period until June 5, 2025.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Badge className="w-full justify-center py-1.5" variant="secondary">
                Powered by xAI Live Search API
              </Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Understanding AI Search Technology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Medical Research Best Practices
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Latest Dermatology Publications
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Skin Cancer Research Updates
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

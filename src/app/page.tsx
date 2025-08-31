'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowLeft, Filter, Eye, Calendar, MessageCircle, Mail, X } from 'lucide-react';

// ---------- Types ----------
type Role = 'user' | 'assistant'

type Message = {
  role: Role
  content: string
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  date?: string
}

type Dataset = {
  dataset_name: string
  conversations: Conversation[]
}

type ResultItem = {
  conversationId: string
  title: string
  snippetHtml: string
  matchCount: number
}

type DemoKey = 'researcher' | 'consultant' | 'creator'

const DEMO_META: Record<DemoKey, { label: string; icon: string; blurb: string; helper: string; file: string }> = {
  researcher: {
    label: 'Researcher',
    icon: '🔬',
    blurb: 'Explore penguins in Chile: field notes, drone counts, grants.',
    helper: "Try 'drone' to get started.",
    file: '/datasets/dataset_researcher.json',
  },
  consultant: {
    label: 'Consultant',
    icon: '🌍',
    blurb: 'Expand beyond the US: markets, legal, payroll.',
    helper: "Try 'subsidiary' or 'EOR'.",
    file: '/datasets/dataset_consultant.json',
  },
  creator: {
    label: 'Creator',
    icon: '🎥',
    blurb: 'Northern Australia series: scripts, wildlife, gear.',
    helper: "Try 'reef' or 'crocodile'.",
    file: '/datasets/dataset_creator.json',
  },
}

// Mock datasets for demo
const MOCK_DATASETS: Record<DemoKey, Dataset> = {
  researcher: {
    dataset_name: 'Researcher Dataset',
    conversations: [
      {
        id: '1',
        title: 'Penguin Drone Survey Protocol',
        date: '2024-08-15',
        messages: [
          { role: 'user', content: 'I need to design a drone survey protocol for counting penguin colonies in Chile. What are the best practices for aerial wildlife surveys?' },
          { role: 'assistant', content: 'For penguin drone surveys, you\'ll want to consider several key factors: flight altitude (typically 50-100m to minimize disturbance), camera specifications (high-resolution for accurate counting), weather conditions, and timing during breeding season. Let me break down the protocol...' },
          { role: 'user', content: 'What about the legal requirements for drone operations in Chilean protected areas?' },
          { role: 'assistant', content: 'In Chile, drone operations in protected areas require permits from CONAF (National Forest Corporation). You\'ll need to submit a detailed research proposal, flight plan, and demonstrate minimal environmental impact. The process typically takes 30-45 days...' }
        ]
      },
      {
        id: '2',
        title: 'Grant Writing for Antarctic Research',
        date: '2024-08-10',
        messages: [
          { role: 'user', content: 'Help me write a compelling grant proposal for studying penguin behavior changes due to climate change in Antarctica.' },
          { role: 'assistant', content: 'Your grant proposal should emphasize the urgent need to understand how rapid Antarctic warming affects penguin populations. Key elements to include: clear research objectives, methodology using drone surveys and behavioral monitoring, expected outcomes, and broader implications for conservation policy...' }
        ]
      },
      {
        id: '3',
        title: 'Field Equipment Setup Antarctica',
        date: '2024-08-05',
        messages: [
          { role: 'user', content: 'What field equipment do I need for a 6-month penguin research station in Antarctica?' },
          { role: 'assistant', content: 'For Antarctic penguin research, you\'ll need specialized cold-weather equipment: insulated observation hides, weather-resistant cameras with extended battery packs, satellite communication systems, backup power sources, and emergency shelter supplies. Let me detail each category...' }
        ]
      }
    ]
  },
  consultant: {
    dataset_name: 'Consultant Dataset',
    conversations: [
      {
        id: '1',
        title: 'Setting Up European Subsidiary',
        date: '2024-08-20',
        messages: [
          { role: 'user', content: 'My US tech company wants to expand to Europe. Should we set up a subsidiary or use an EOR model?' },
          { role: 'assistant', content: 'The choice between a subsidiary and Employer of Record (EOR) depends on several factors: timeline, number of employees, compliance requirements, and long-term strategy. For initial expansion with under 20 employees, EOR often makes more sense due to faster setup and lower compliance burden...' },
          { role: 'user', content: 'What are the tax implications of each approach in Germany specifically?' },
          { role: 'assistant', content: 'In Germany, subsidiaries are subject to corporate tax (Körperschaftsteuer) at 15% plus solidarity surcharge, plus trade tax varying by municipality. With EOR, you avoid establishing a permanent establishment, so no German corporate tax obligations, but you pay EOR service fees typically 8-15% of gross payroll...' }
        ]
      },
      {
        id: '2',
        title: 'Market Entry Strategy Asia Pacific',
        date: '2024-08-18',
        messages: [
          { role: 'user', content: 'We want to enter the APAC market. Which countries should we prioritize and what\'s the best entry strategy?' },
          { role: 'assistant', content: 'For APAC expansion, I\'d recommend a phased approach starting with English-speaking markets: Australia and Singapore as entry points, then Japan and South Korea for larger markets. Each has different regulatory requirements and business cultures...' }
        ]
      },
      {
        id: '3',
        title: 'Remote Work Compliance Global',
        date: '2024-08-15',
        messages: [
          { role: 'user', content: 'Our employees want to work remotely from different countries. What compliance issues should we be aware of?' },
          { role: 'assistant', content: 'Global remote work creates several compliance challenges: tax obligations in multiple jurisdictions, employment law variations, data privacy requirements (GDPR in EU), and potential permanent establishment risks. You\'ll need country-specific employment agreements...' }
        ]
      }
    ]
  },
  creator: {
    dataset_name: 'Creator Dataset',
    conversations: [
      {
        id: '1',
        title: 'Great Barrier Reef Documentary Script',
        date: '2024-08-25',
        messages: [
          { role: 'user', content: 'I\'m creating a documentary about the Great Barrier Reef. Help me structure the narrative to show both beauty and environmental challenges.' },
          { role: 'assistant', content: 'Your reef documentary should balance wonder with urgency. Consider a three-act structure: Act 1 - showcase the reef\'s incredible biodiversity and beauty, Act 2 - reveal the threats (bleaching, pollution, climate change), Act 3 - highlight conservation efforts and hope. Use the reef itself as your narrator through visual storytelling...' },
          { role: 'user', content: 'What filming techniques work best for underwater coral scenes?' },
          { role: 'assistant', content: 'For stunning coral footage: use macro lenses for detail shots of coral polyps and small fish, wide-angle for reef panoramas, red filters or underwater lights to restore natural colors at depth. Shoot during golden hours when possible, and consider time-lapse for showing coral behavior...' }
        ]
      },
      {
        id: '2',
        title: 'Crocodile Safety Filming Guidelines',
        date: '2024-08-22',
        messages: [
          { role: 'user', content: 'I need safety protocols for filming saltwater crocodiles in Northern Australia. This is for a wildlife series.' },
          { role: 'assistant', content: 'Saltwater crocodile filming requires extreme caution and professional wildlife handlers. Essential safety measures: maintain minimum 6-meter distance, use telephoto lenses 400mm+, have experienced local guides, establish escape routes, use protective barriers when possible. Never film alone or during nesting season...' },
          { role: 'user', content: 'What\'s the best time of year and locations for crocodile filming?' },
          { role: 'assistant', content: 'Dry season (May-October) is optimal for crocodile filming in Northern Australia. Key locations: Kakadu National Park, Adelaide River, and Daintree River. During dry season, crocodiles are more concentrated near water sources, making them easier to locate while maintaining safe distances...' }
        ]
      },
      {
        id: '3',
        title: 'Camera Equipment Tropical Conditions',
        date: '2024-08-20',
        messages: [
          { role: 'user', content: 'What camera gear do I need for filming wildlife in tropical Australia? Need to handle humidity, heat, and dust.' },
          { role: 'assistant', content: 'For Australian tropics, prioritize weather-sealed equipment: cameras like Canon R5 or Sony A7RV with weather sealing, protective UV filters, moisture-absorbing silica gel packs, waterproof cases, and backup batteries (heat drains them faster). Consider lens hoods for sun protection and cleaning supplies for dust/humidity...' }
        ]
      }
    ]
  }
}

// ---------- Utilities ----------
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(text: string, q: string): string {
  if (!q) return text
  const re = new RegExp(`(${escapeRegExp(q)})`, 'ig')
  return text.replace(re, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">$1</mark>')
}

function makeSnippet(text: string, q: string, radius = 60): string {
  if (!q) return text.slice(0, radius * 2) + (text.length > radius * 2 ? '…' : '')
  
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text.slice(0, radius * 2) + (text.length > radius * 2 ? '…' : '')
  
  const start = Math.max(0, idx - radius)
  const end = Math.min(text.length, idx + q.length + radius)
  
  const slice = text.slice(start, end)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  
  return prefix + highlight(slice, q) + suffix
}

function countMatches(text: string, q: string): number {
  if (!q) return 0
  const re = new RegExp(escapeRegExp(q), 'ig')
  return (text.match(re) || []).length
}

// Email capture modal component
function EmailCaptureModal({ 
  open, 
  onClose, 
  source 
}: { 
  open: boolean; 
  onClose: () => void; 
  source: string;
}) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      
      // Track signup - replace with your analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'email_signup', {
          source: source,
          email_domain: email.split('@')[1]
        })
      }
      
    } catch (error) {
      console.error('Signup error:', error)
      alert('Something went wrong. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  const resetModal = () => {
    setEmail('')
    setIsSubmitting(false)
    setIsSubmitted(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={resetModal} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {!isSubmitted ? (
          <>
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Search className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">ChatSherlock</span>
                </div>
                <button 
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get notified when ChatSherlock launches! 🚀
              </h3>
              <p className="text-gray-600">
                Be the first to search your real ChatGPT conversations with detective-level precision.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 pt-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {isSubmitting ? 'Joining...' : 'Notify me when it\'s ready!'}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  We'll only email you about ChatSherlock updates. No spam, unsubscribe anytime.
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                You're on the list! 🎉
              </h3>
              <p className="text-gray-600">
                We'll email you as soon as ChatSherlock is ready to help you find those buried ChatGPT gems.
              </p>
            </div>
            <button
              onClick={resetModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Continue exploring demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Components ----------
function DemoPicker({ onPick, onOpenEmailCapture }: { onPick: (key: DemoKey) => void; onOpenEmailCapture: (source: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="mx-auto max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">ChatSherlock</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try ChatSherlock with demo data</h2>
          <p className="text-xl text-gray-600 mb-6">Pick a profile and search sample chats—no personal data needed.</p>
          
          <button
            onClick={() => onOpenEmailCapture('hero')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
          >
            <Mail className="w-6 h-6 mr-3" />
            Get notified when ChatSherlock launches
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(Object.keys(DEMO_META) as DemoKey[]).map((key) => {
            const m = DEMO_META[key]
            return (
              <button
                key={key}
                onClick={() => onPick(key)}
                className="bg-white rounded-2xl border border-gray-200 p-8 text-left shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                aria-label={`Try ${m.label} demo - ${m.blurb}`}
              >
                <div className="text-5xl mb-6" aria-hidden="true">{m.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-3">{m.label}</div>
                <div className="text-gray-600 mb-6 leading-relaxed">{m.blurb}</div>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Use this demo 
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center mt-16 text-gray-500">
          <p className="mb-6">This is a demonstration with sample data. Your real ChatGPT conversations stay private.</p>
          <button
            onClick={() => onOpenEmailCapture('footer')}
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Join the waitlist
          </button>
        </div>
      </div>
    </div>
  )
}

function ResultsList({ 
  results, 
  activeId, 
  onSelect, 
  onSnippetClick, 
  showFirstTimeHint,
  onHintDismiss 
}: { 
  results: ResultItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  onSnippetClick: (id: string) => void;
  showFirstTimeHint: boolean;
  onHintDismiss: () => void;
}) {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">Search Results</h3>
        <p className="text-sm text-gray-600">{results.length} conversation{results.length !== 1 ? 's' : ''} found</p>
      </div>
      <div className="divide-y divide-gray-200">
        {results.length === 0 ? (
          <div className="text-gray-500 py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No results yet. Try a broader term.</p>
          </div>
        ) : (
          results.map((r, index) => (
            <div key={r.conversationId} className="relative">
              <div
                className={`w-full text-left p-6 hover:bg-gray-50 transition-colors ${
                  activeId === r.conversationId ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {r.matchCount} match{r.matchCount !== 1 ? 'es' : ''} • demo
                  </div>
                  {activeId === r.conversationId && <Eye className="w-4 h-4 text-blue-500" />}
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => {
                    onSelect(r.conversationId)
                    onSnippetClick(r.conversationId)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(r.conversationId)
                      onSnippetClick(r.conversationId)
                    }
                  }}
                  aria-label={`View conversation: ${r.title}`}
                >
                  <div className="font-semibold text-gray-900 mb-2 hover:text-blue-700 transition-colors">{r.title}</div>
                  <div className="relative">
                    <div 
                      className="text-sm text-gray-700 line-clamp-3 hover:bg-gray-100 rounded p-2 -m-2 transition-colors" 
                      dangerouslySetInnerHTML={{ __html: r.snippetHtml }}
                    />
                    {showFirstTimeHint && index === 0 && (
                      <div className="absolute left-2 -bottom-12 bg-white border rounded-xl shadow-lg px-4 py-3 text-sm text-gray-700 z-10 max-w-xs">
                        💡 Click on highlighted snippet to view full conversation
                        <button 
                          className="ml-3 text-gray-400 hover:text-gray-600" 
                          onClick={(e) => {
                            e.stopPropagation()
                            onHintDismiss()
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ConversationView({ 
  conv, 
  query, 
  showMessages, 
  onCollapseConversation 
}: { 
  conv?: Conversation;
  query: string;
  showMessages: boolean;
  onCollapseConversation: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conv || !query || !showMessages) return
    setTimeout(() => {
      const el = containerRef.current?.querySelector('mark') as HTMLElement | null
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [conv?.id, query, showMessages])

  if (!conv) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg">Select a result to view the conversation</p>
          <p className="text-sm">Search and click on any result to see the full chat</p>
        </div>
      </div>
    )
  }

  if (!showMessages) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Ready to view: {conv.title}</p>
          <p className="text-sm">Click on the highlighted snippet to open the full conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <button
          onClick={onCollapseConversation}
          className="w-full text-left hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors group"
        >
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{conv.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {conv.date || 'Demo conversation'}
            <span className="mx-2">•</span>
            <MessageCircle className="w-4 h-4 mr-1" />
            {conv.messages.length} messages
            <span className="ml-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to collapse
            </span>
          </div>
        </button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        <div className="space-y-4 max-w-4xl">
          {conv.messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-2xl px-6 py-4 ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white ml-auto' 
                  : 'bg-white border border-gray-200 mr-auto shadow-sm'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`text-xs font-medium uppercase tracking-wide ${
                    m.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {m.role === 'user' ? 'You' : 'ChatGPT'}
                  </span>
                </div>
                <div 
                  className={`whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{ __html: highlight(m.content, query) }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BrowseAllModal({ 
  open, 
  onClose, 
  conversations, 
  onOpenConversation 
}: { 
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onOpenConversation: (id: string) => void;
}) {
  const [filter, setFilter] = useState('')
  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return conversations
    return conversations.filter((c) => {
      const titleMatch = c.title.toLowerCase().includes(f)
      const contentMatch = c.messages.some(m => 
        m.content.toLowerCase().includes(f)
      )
      return titleMatch || contentMatch
    })
  }, [filter, conversations])

  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Browse all conversations</h3>
            <p className="text-sm text-gray-600">Demo dataset • {conversations.length} total conversations</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by title…"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-96 overflow-auto divide-y divide-gray-200 border rounded-xl">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onClose()
                  onOpenConversation(c.id)
                }}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="font-semibold text-gray-900 mb-1">{c.title}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {c.messages.length} messages • demo data
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchShell({ demoKey, onBack, onOpenEmailCapture }: { demoKey: DemoKey; onBack: () => void; onOpenEmailCapture: (source: string) => void }) {
  const meta = DEMO_META[demoKey]
  const dataset = MOCK_DATASETS[demoKey]
  const [query, setQuery] = useState('')
  const [showHint, setShowHint] = useState(true)
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(true)

  useEffect(() => {
    if (showFirstTimeHint) {
      const timer = setTimeout(() => {
        setShowFirstTimeHint(false)
      }, 7000)
      return () => clearTimeout(timer)
    }
  }, [showFirstTimeHint])

  const results: ResultItem[] = useMemo(() => {
    if (!dataset || !query.trim()) return []
    const q = query.trim()
    const out: ResultItem[] = []
    for (const c of dataset.conversations) {
      const haystackTitle = c.title
      const haystackMsgs = c.messages.map((m) => m.content).join(' \n ')
      const inTitle = haystackTitle.toLowerCase().includes(q.toLowerCase())
      const inMsgs = haystackMsgs.toLowerCase().includes(q.toLowerCase())
      if (inTitle || inMsgs) {
        const matchCount = countMatches(haystackTitle, q) + countMatches(haystackMsgs, q)
        const snippet = inTitle ? haystackTitle : haystackMsgs
        out.push({
          conversationId: c.id,
          title: c.title,
          snippetHtml: makeSnippet(snippet, q),
          matchCount,
        })
      }
    }
    out.sort((a, b) => b.matchCount - a.matchCount)
    return out
  }, [dataset, query])

  const activeConversation = useMemo(() => {
    if (!dataset || !activeId) return undefined
    return dataset.conversations.find((c) => c.id === activeId)
  }, [dataset, activeId])

  useEffect(() => {
    if (results.length > 0) {
      const stillExists = results.find(r => r.conversationId === activeId)
      if (!stillExists) {
        setActiveId(results[0].conversationId)
        setShowMessages(false)
      }
    } else {
      setActiveId(undefined)
      setShowMessages(false)
    }
  }, [results, activeId])

  const handleSnippetClick = (id: string) => {
    setActiveId(id)
    setShowMessages(true)
    setShowFirstTimeHint(false)
  }

  const handleCollapseConversation = () => {
    setShowMessages(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack} 
                className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to demos
              </button>
              <div className="text-sm text-gray-400">|</div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{meta.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{meta.label} Demo</div>
                  <div className="text-xs text-gray-500">Sample ChatGPT conversations</div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Search className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">ChatSherlock</span>
              <button
                onClick={() => onOpenEmailCapture('header')}
                className="ml-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Get notified
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHint(true)}
              placeholder="Search these conversations..."
              className="w-full pl-12 pr-6 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showHint && !query && (
              <div className="absolute left-4 -bottom-12 bg-white border rounded-xl shadow-lg px-4 py-3 text-sm text-gray-700 z-10">
                💡 {meta.helper}
                <button 
                  className="ml-3 text-gray-400 hover:text-gray-600" 
                  onClick={() => setShowHint(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={() => setBrowseOpen(true)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Browse all conversations
            </button>
            <span className="text-sm text-gray-500">
              {dataset.conversations.length} conversations in this demo
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <ResultsList 
            results={results} 
            activeId={activeId} 
            onSelect={setActiveId}
            onSnippetClick={handleSnippetClick}
            showFirstTimeHint={showFirstTimeHint && results.length > 0}
            onHintDismiss={() => setShowFirstTimeHint(false)}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <ConversationView 
            conv={activeConversation} 
            query={query} 
            showMessages={showMessages} 
            onCollapseConversation={handleCollapseConversation}
          />
        </div>
      </div>

      <BrowseAllModal
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        conversations={dataset.conversations}
        onOpenConversation={(id) => {
          setActiveId(id)
          setBrowseOpen(false)
        }}
      />
    </div>
  )
}

export default function ChatSherlock() {
  const [demoKey, setDemoKey] = useState<DemoKey | null>(null)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailSource, setEmailSource] = useState('')

  const handleOpenEmailCapture = (source: string) => {
    setEmailSource(source)
    setEmailModalOpen(true)
  }

  return (
    <div>
      {demoKey ? (
        <SearchShell 
          demoKey={demoKey} 
          onBack={() => setDemoKey(null)} 
          onOpenEmailCapture={handleOpenEmailCapture}
        />
      ) : (
        <DemoPicker 
          onPick={(k) => setDemoKey(k)} 
          onOpenEmailCapture={handleOpenEmailCapture}
        />
      )}
      
      <EmailCaptureModal 
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        source={emailSource}
      />
    </div>
  )
}

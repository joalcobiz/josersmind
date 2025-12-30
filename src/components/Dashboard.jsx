import React, { useState, useEffect } from 'react';
import { Calendar, Brain, Target, Sparkles, Video, Plus, TrendingUp, AlertCircle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { encrypt, decrypt } from '../services/encryption';
import { getFunctions, httpsCallable } from 'firebase/functions';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [showSummarizePrompt, setShowSummarizePrompt] = useState(false);
  const [currentEntryForSummary, setCurrentEntryForSummary] = useState(null);
  const [entryCategory, setEntryCategory] = useState('');
  const [entryMood, setEntryMood] = useState('');
  const [expandedEntries, setExpandedEntries] = useState({});
  const [answeringQuestion, setAnsweringQuestion] = useState(null);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  const compiledProfile = {
    lastCompiled: new Date().toISOString(),
    corePatterns: [
      "Exceptional pattern-recognition intelligence masked by working memory deficits",
      "Trauma response creating paralysis around survival-critical tasks",
      "Neurodivergent profile (likely ADHD-inattentive) requiring external cognitive scaffolding",
      "Identity crisis: successful persona vs. financial collapse reality",
      "Neurochemical sensitivity (SSRI withdrawal, bupropion response)",
      "Pattern: High intention, low completion - 'smart person who can't execute'",
      "Rebellion against obligation; engagement with curiosity"
    ],
    currentCrisis: {
      financial: "Operating on wife's income, debt forcing business in her name for 5 years",
      practical: "Must make TikTok shop work as primary income - no employment alternatives",
      social: "Maintaining successful facade while feeling fraudulent",
      cognitive: "Focus deteriorating even for preferred content (documentaries)",
      medical: "In Colombia without medical history, insurance won't cover pre-existing conditions"
    }
  };

  const priorityTasks = [
    {
      priority: 1,
      urgency: "CRITICAL - DO TODAY",
      task: "Establish External Brain System",
      rationale: "Your working memory deficit requires immediate external scaffolding.",
      steps: [
        "Buy dedicated notebook (physical, not digital)",
        "Write today's date on first page",
        "Write: 'External Brain - Active'",
        "Keep it within arm's reach at all times"
      ],
      timeEstimate: "10 minutes",
      completionCriteria: "Notebook purchased and initialized",
      blockers: "None - this is foundational"
    },
    {
      priority: 2,
      urgency: "CRITICAL - THIS WEEK",
      task: "Secure Psychiatric Continuity in Colombia",
      rationale: "You're on bupropion + lexapro microdose + alprazolam. Operating without medical oversight is dangerous.",
      steps: [
        "Google: 'psychiatrist [your city] English speaking private'",
        "Check expat forums for recommendations",
        "Make list of 3 names with phone numbers",
        "Call first one: Ask cost, explain self-pay",
        "Book appointment within 2 weeks"
      ],
      timeEstimate: "45 minutes across 3 days",
      completionCriteria: "Appointment scheduled",
      blockers: "Cost anxiety (solution: life-or-death infrastructure)"
    },
    {
      priority: 3,
      urgency: "HIGH - THIS WEEK",
      task: "TikTok Course Reconnaissance",
      rationale: "Survival income depends on this. Bypass paralysis with micro-recon.",
      steps: [
        "Open course login. Stare 30 seconds. Close. (Day 1)",
        "Open first module. Screenshot. Close. (Day 2)",
        "Open TikTok app. Watch 3 shop videos. (Day 3)",
        "Write one question about TikTok shops (Day 4)"
      ],
      timeEstimate: "2 minutes per day for 4 days",
      completionCriteria: "All 4 micro-recon missions completed",
      blockers: "Paralysis reflex (solution: just observing)"
    }
  ];

  const dailyDeclarations = [
    "I am intellectually exceptional but executively impaired. This is not a character flaw—it's neurological architecture.",
    "I rebel against obligation but engage deeply with curiosity. The solution is to reframe survival tasks as pattern-recognition challenges.",
    "My creativity flows when I feel free and freezes when I feel forced. I need to trick my brain into seeing necessity as discovery.",
    "I have spent my life building sophisticated systems to avoid doing what terrifies me. That's trauma-informed self-protection.",
    "The TikTok course represents survival, but also identity death. My resistance is about who I'm afraid of becoming.",
    "I can complete creative projects that interest me. The family app proves I can execute—when the task aligns with how my brain works.",
    "I am not a fraud. My public success and private collapse are both real. The dissonance is painful but doesn't make either false.",
    "My preference for solitude is authentic self-knowledge, not avoidance. I can be charming when needed.",
    "Paralysis around the TikTok course is my nervous system saying: 'This feels like death either way.' I acknowledge this.",
    "I use intellectual work as both genuine problem-solving AND sophisticated procrastination. Recognizing this is the first step.",
    "My working memory deficit means I will forget this clarity tomorrow. That's why I'm building external systems.",
    "Today I don't need to complete anything. One pattern, one question, one 2-minute action. That is enough."
  ];

  const microActions = [
    {
      category: "TikTok Shop Survival Mission",
      actions: [
        "Open course. Note Module 1 title. Close. (2 min)",
        "Write: 'What product category am I curious about?' (1 min)",
        "Watch 3 TikTok shop videos. Note which held attention. (5 min)",
        "Screenshot ONE course page. Save. Done. (1 min)"
      ]
    },
    {
      category: "Cognitive Support Systems",
      actions: [
        "Write today's date in External Brain. (30 sec)",
        "5-min task sprint. Pick any micro-action. (5 min)",
        "Voice memo: 'One thing I noticed about focus today.' (1 min)",
        "Create tomorrow's 3 micro-tasks checklist. (3 min)"
      ]
    },
    {
      category: "Nervous System Regulation",
      actions: [
        "30-min pressure valve: documentary/debate/walk. (30 min)",
        "Alprazolam check: Rate anxiety 1-10. If 7+, take .5mg. (1 min)",
        "Body scan: Notice 3 physical sensations. (2 min)",
        "Secret writing: 'Today I felt fraudulent when...' (5 min)"
      ]
    }
  ];

  const curatedResources = {
    videos: [
      { title: "How ADHD Affects Working Memory", why: "Explains your memory gaps", length: "14 min" },
      { title: "The Neuroscience of Trauma Paralysis", why: "Why you can't engage with TikTok course", length: "18 min" },
      { title: "High IQ Masking in Adult ADHD", why: "How you were top student despite deficits", length: "22 min" }
    ]
  };

  const categories = ['Business', 'Family', 'Medical', 'Creative', 'TikTok', 'Mental Health', 'Daily Life'];
  const moods = ['😊 Good', '😐 Neutral', '😟 Anxious', '😢 Down', '😤 Frustrated', '🤔 Thoughtful'];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'entries'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loadedEntries = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          timestamp: data.timestamp,
          content: decrypt(data.content),
          category: data.category,
          mood: data.mood,
          summarized: data.summarized || false,
          summary: data.summary || null,
          clarifications: data.clarifications || [],
          dismissedQuestions: data.dismissedQuestions || []
        };
      });
      
      setEntries(loadedEntries);
      setLoading(false);
    } catch (error) {
      console.error('Error loading entries:', error);
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!newEntry.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, 'entries'), {
        timestamp: new Date().toISOString(),
        content: encrypt(newEntry),
        category: entryCategory || 'Uncategorized',
        mood: entryMood || null,
        summarized: false,
        summary: null,
        clarifications: [],
        dismissedQuestions: []
      });
      
      setCurrentEntryForSummary({
        id: docRef.id,
        timestamp: new Date().toISOString(),
        content: newEntry,
        category: entryCategory || 'Uncategorized',
        mood: entryMood || null,
        summarized: false,
        summary: null,
        clarifications: [],
        dismissedQuestions: []
      });
      setShowSummarizePrompt(true);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    }
  };

 const handleSummarizeDecision = async (shouldSummarize) => {
  if (shouldSummarize) {
    try {
      // Call Cloud Function for AI recompilation
      const functions = getFunctions();
      const recompileEntry = httpsCallable(functions, 'recompileEntry');
      
      setLoading(true);
      
      const result = await recompileEntry({
        entryContent: currentEntryForSummary.content,
        entryId: currentEntryForSummary.id
      });
      
      console.log('AI recompilation result:', result.data);
      
      await loadEntries();
      setLoading(false);
    } catch (error) {
      console.error('Error calling recompile function:', error);
      alert('Failed to generate AI summary. Check console for details.');
      setLoading(false);
    }
  } else {
    await loadEntries();
  }
  
  setShowSummarizePrompt(false);
  setCurrentEntryForSummary(null);
  setNewEntry('');
  setEntryCategory('');
  setEntryMood('');
  setShowEntryForm(false);
};
    
    await loadEntries();
    setShowSummarizePrompt(false);
    setCurrentEntryForSummary(null);
    setNewEntry('');
    setEntryCategory('');
    setEntryMood('');
    setShowEntryForm(false);
  };

  const answerClarification = async (entryId, questionId) => {
    if (!questionAnswer.trim()) {
      alert('Please enter an answer');
      return;
    }
    
    try {
      const entry = entries.find(e => e.id === entryId);
      const updatedClarifications = entry.clarifications.map(q => 
        q.id === questionId ? { ...q, answered: true, answer: questionAnswer } : q
      );
      
      await updateDoc(doc(db, 'entries', entryId), {
        clarifications: updatedClarifications
      });
      
      await loadEntries();
      setAnsweringQuestion(null);
      setQuestionAnswer('');
    } catch (error) {
      console.error('Error answering:', error);
    }
  };

  const dismissQuestion = async (entryId, questionId) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      const q = entry.clarifications.find(x => x.id === questionId);
      const updatedClarifications = entry.clarifications.filter(x => x.id !== questionId);
      const updatedDismissed = [...(entry.dismissedQuestions || []), q];
      
      await updateDoc(doc(db, 'entries', entryId), {
        clarifications: updatedClarifications,
        dismissedQuestions: updatedDismissed
      });
      
      await loadEntries();
    } catch (error) {
      console.error('Error dismissing:', error);
    }
  };

  const getFilteredEntries = () => {
    let filtered = [...entries];
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterDate !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (filterDate === 'today') cutoff.setHours(0, 0, 0, 0);
      else if (filterDate === 'week') cutoff.setDate(now.getDate() - 7);
      else if (filterDate === 'month') cutoff.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(e => new Date(e.timestamp) >= cutoff);
    }
    return filtered;
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await deleteDoc(doc(db, 'entries', id));
      await loadEntries();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const toggleEntryExpansion = (id) => {
    setExpandedEntries(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getUnsummarizedCount = () => entries.filter(e => !e.summarized).length;
  const getPendingClarificationsCount = () => entries.reduce((c, e) => c + (e.clarifications?.filter(q => !q.answered).length || 0), 0);

  const exportEntries = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-400">Loading your journal...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-light mb-2 flex items-center gap-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                Life Journal & Command Center
              </h1>
              <p className="text-slate-400 text-sm">
                Last compiled: {new Date(compiledProfile.lastCompiled).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-slate-300 text-sm transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'priorities', 'declarations', 'actions', 'resources', 'journal', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap relative ${
                activeTab === tab ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'journal' && (getUnsummarizedCount() > 0 || getPendingClarificationsCount() > 0) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getUnsummarizedCount() + getPendingClarificationsCount()}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Core Pattern Recognition
              </h2>
              <div className="space-y-3">
                {compiledProfile.corePatterns.map((pattern, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <p className="text-slate-300 text-sm leading-relaxed">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Current Crisis Context
              </h2>
              <div className="grid gap-4">
                {Object.entries(compiledProfile.currentCrisis).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-amber-400 text-xs uppercase tracking-wider font-medium">{key}</span>
                    <p className="text-slate-300 text-sm mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'priorities' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur rounded-lg p-4 border border-red-500/30 mb-6">
              <p className="text-red-200 text-sm">
                <strong>Dynamic Priorities:</strong> This list recompiles with every journal entry.
              </p>
            </div>

            {priorityTasks.map((task, i) => (
              <div key={i} className={`bg-slate-800/50 backdrop-blur rounded-lg p-6 border-l-4 ${
                task.priority === 1 ? 'border-red-500' : 
                task.priority === 2 ? 'border-orange-500' : 'border-yellow-500'
              } border-t border-r border-b border-slate-700`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        task.priority === 1 ? 'bg-red-500 text-white' : 
                        task.priority === 2 ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-slate-900'
                      }`}>
                        PRIORITY {task.priority}
                      </span>
                      <span className="text-xs text-slate-400 uppercase tracking-wider">{task.urgency}</span>
                    </div>
                    <h3 className="text-xl font-light text-slate-100 mt-2">{task.task}</h3>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">~{task.timeEstimate}</span>
                </div>

                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-slate-400 italic mb-2">Why this matters:</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{task.rationale}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-400 italic mb-2">Action steps:</p>
                    <div className="space-y-2">
                      {task.steps.map((step, j) => (
                        <div key={j} className="flex gap-3 items-start group hover:bg-slate-700/30 p-2 rounded transition">
                          <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-slate-600 text-cyan-500" />
                          <label className="text-slate-300 text-sm leading-relaxed cursor-pointer flex-1">{step}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3 border-t border-slate-700/50 text-xs">
                    <div>
                      <span className="text-slate-500">Success looks like:</span>
                      <p className="text-green-400 mt-1">{task.completionCriteria}</p>
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-500">Potential blockers:</span>
                      <p className="text-amber-400 mt-1">{task.blockers}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'declarations' && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-light mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Daily Declarations (Read One Aloud Each Morning)
            </h2>
            <div className="space-y-4">
              {dailyDeclarations.map((declaration, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-slate-200 leading-relaxed">{declaration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            {microActions.map((section, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                <h2 className="text-lg font-light mb-4 text-cyan-400">{section.category}</h2>
                <div className="space-y-3">
                  {section.actions.map((action, j) => (
                    <div key={j} className="flex gap-3 items-start group hover:bg-slate-700/30 p-2 rounded transition">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-600 text-cyan-500" />
                      <label className="text-slate-300 text-sm leading-relaxed cursor-pointer flex-1">{action}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-light mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              Curated Videos
            </h2>
            <div className="space-y-4">
              {curatedResources.videos.map((video, i) => (
                <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-200 font-medium">{video.title}</h3>
                    <span className="text-xs text-slate-500">{video.length}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{video.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-6">
            
            {(getUnsummarizedCount() > 0 || getPendingClarificationsCount() > 0) && (
              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Action Required</h3>
                <div className="space-y-2">
                  {getUnsummarizedCount() > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-300">
                      <AlertCircle className="w-4 h-4" />
                      <span>{getUnsummarizedCount()} unsummarized entries - view in History tab</span>
                    </div>
                  )}
                  {getPendingClarificationsCount() > 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-300">
                      <AlertCircle className="w-4 h-4" />
                      <span>{getPendingClarificationsCount()} clarification questions pending - view in History tab</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  New Entry
                </h2>
                {!showEntryForm && (
                  <button
                    onClick={() => setShowEntryForm(true)}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </button>
                )}
              </div>

              {showEntryForm && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">Category (optional)</label>
                      <select
                        value={entryCategory}
                        onChange={(e) => setEntryCategory(e.target.value)}
                        className="w-full bg-slate-900 text-slate-200 rounded p-3 border border-slate-600 focus:border-cyan-500 outline-none text-sm"
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">Mood (optional)</label>
                      <select
                        value={entryMood}
                        onChange={(e) => setEntryMood(e.target.value)}
                        className="w-full bg-slate-900 text-slate-200 rounded p-3 border border-slate-600 focus:border-cyan-500 outline-none text-sm"
                      >
                        <option value="">Select mood...</option>
                        {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    placeholder="Write anything... thoughts, feelings, events, observations."
                    className="w-full bg-slate-900 text-slate-200 rounded p-3 border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none min-h-32 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addEntry}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                      Save Entry
                    </button>
                    <button
                      onClick={() => {
                        setShowEntryForm(false);
                        setNewEntry('');
                        setEntryCategory('');
                        setEntryMood('');
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {showSummarizePrompt && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
                  <h3 className="text-lg font-medium mb-4">Summarize this entry?</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    AI will generate a summary and ask clarifying questions.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSummarizeDecision(true)}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition"
                    >
                      Yes, Summarize
                    </button>
                    <button
                      onClick={() => handleSummarizeDecision(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded transition"
                    >
                      No, Save As-Is
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
{activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Complete Entry History ({entries.length} total)
                </h2>
                <button
                  onClick={exportEntries}
                  disabled={entries.length === 0}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded text-sm transition disabled:opacity-50"
                >
                  Export All
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Search entries</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-slate-900 text-slate-200 rounded p-3 border border-slate-600 focus:border-cyan-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Filter by date</label>
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 rounded p-3 border border-slate-600 focus:border-cyan-500 outline-none text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {getFilteredEntries().length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-sm">
                    {entries.length === 0 ? 'No entries yet.' : 'No matches.'}
                  </p>
                ) : (
                  getFilteredEntries().map(entry => (
                    <div key={entry.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </span>
                            {entry.category && (
                              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">{entry.category}</span>
                            )}
                            {entry.mood && (
                              <span className="text-xs">{entry.mood}</span>
                            )}
                            {!entry.summarized && (
                              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                                Unsummarized
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-300 text-xs ml-2"
                        >
                          Delete
                        </button>
                      </div>

                      {entry.summarized && entry.summary && (
                        <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded">
                          <p className="text-xs text-cyan-300 mb-1 font-medium">AI Summary:</p>
                          <p className="text-slate-300 text-sm">{decrypt(entry.summary)}</p>
                        </div>
                      )}

                      <div className={expandedEntries[entry.id] ? '' : 'line-clamp-3'}>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      </div>

                      {entry.content.length > 200 && (
                        <button
                          onClick={() => toggleEntryExpansion(entry.id)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs mt-2 flex items-center gap-1"
                        >
                          {expandedEntries[entry.id] ? (
                            <><ChevronUp className="w-3 h-3" /> Show less</>
                          ) : (
                            <><ChevronDown className="w-3 h-3" /> Show more</>
                          )}
                        </button>
                      )}

                      {entry.clarifications && entry.clarifications.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <p className="text-xs text-slate-400 mb-3">Clarification Questions:</p>
                          <div className="space-y-2">
                            {entry.clarifications.map(q => (
                              <div key={q.id} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                <p className="text-sm text-slate-300 mb-2">{q.question}</p>
                                {q.answered ? (
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-green-300">{q.answer}</p>
                                  </div>
                                ) : answeringQuestion === `${entry.id}-${q.id}` ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={questionAnswer}
                                      onChange={(e) => setQuestionAnswer(e.target.value)}
                                      placeholder="Type your answer..."
                                      className="w-full bg-slate-900 text-slate-200 rounded p-2 border border-slate-600 focus:border-cyan-500 outline-none text-sm"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => answerClarification(entry.id, q.id)}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-xs transition"
                                      >
                                        Save Answer
                                      </button>
                                      <button
                                        onClick={() => {
                                          setAnsweringQuestion(null);
                                          setQuestionAnswer('');
                                        }}
                                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded text-xs transition"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setAnsweringQuestion(`${entry.id}-${q.id}`)}
                                      className="text-cyan-400 hover:text-cyan-300 text-xs"
                                    >
                                      Answer
                                    </button>
                                    <button
                                      onClick={() => dismissQuestion(entry.id, q.id)}
                                      className="text-slate-500 hover:text-slate-400 text-xs"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.dismissedQuestions && entry.dismissedQuestions.length > 0 && (
                        <details className="mt-3">
                          <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                            {entry.dismissedQuestions.length} dismissed questions
                          </summary>
                          <div className="mt-2 space-y-1 ml-4">
                            {entry.dismissedQuestions.map((q, i) => (
                              <p key={i} className="text-xs text-slate-600">{q.question}</p>
                            ))}
                          </div>
                        </details>
                      )}

                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                        <span>{entry.content.split(/\s+/).length} words</span>
                        <span>{entry.content.length} characters</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {entries.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light text-cyan-400">{entries.length}</div>
                    <div className="text-xs text-slate-500 mt-1">Total Entries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-cyan-400">
                      {entries.filter(e => !e.summarized).length}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Unsummarized</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-cyan-400">
                      {entries.length > 0 ? Math.round(entries.reduce((acc, e) => acc + e.content.split(/\s+/).length, 0) / entries.length) : 0}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Avg Words/Entry</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;         
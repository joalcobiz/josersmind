import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Brain, Target, Sparkles, Plus, TrendingUp, AlertCircle,
  ChevronDown, ChevronUp, Calendar, Clock, Tag, Smile,
  Frown, Meh, Zap, Heart, Search, Trash2, CheckCircle,
  X, Sun, Moon, BarChart2, Flame, Award, ArrowRight,
  Layers, Activity, BookOpen, ListTodo
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// THEME CONTEXT
// ═══════════════════════════════════════════════════════════════
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false; // Light mode default
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggle: () => setIsDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const Dashboard = () => {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
};

const DashboardContent = () => {
  const { isDark, toggle } = useTheme();

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal-entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMood, setFilterMood] = useState('all');
  const [expandedEntries, setExpandedEntries] = useState({});

  const [newEntry, setNewEntry] = useState({
    content: '',
    category: 'reflection',
    mood: 'neutral',
    tags: ''
  });

  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  // ─────────────────────────────────────────────────────────────
  // PROFILE DATA
  // ─────────────────────────────────────────────────────────────
  const compiledProfile = {
    lastCompiled: new Date().toLocaleDateString(),
    corePatterns: [
      "Exceptional pattern-recognition masked by working memory deficits",
      "Trauma response creating paralysis around survival-critical tasks",
      "Neurodivergent profile requiring external cognitive scaffolding",
      "High intention, low completion — needs momentum triggers",
      "Rebellion against obligation; engagement through curiosity"
    ],
    strengths: [
      "Deep analytical thinking",
      "Creative problem solving",
      "Authentic self-awareness",
      "Resilience through adversity"
    ],
    currentFocus: {
      primary: "Build sustainable income through TikTok shop",
      secondary: "Establish daily cognitive scaffolding system",
      tertiary: "Maintain relationship and mental health balance"
    }
  };

  // ─────────────────────────────────────────────────────────────
  // TASKS
  // ─────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([
    { id: 1, urgency: "critical", task: "Daily Brain Dump", description: "Externalize all thoughts to reduce cognitive load", timeEstimate: "10 min", completed: false },
    { id: 2, urgency: "high", task: "TikTok Content Block", description: "Create and schedule 3 product videos", timeEstimate: "2 hours", completed: false },
    { id: 3, urgency: "medium", task: "Review Weekly Patterns", description: "Identify what worked and what didn't", timeEstimate: "15 min", completed: false },
    { id: 4, urgency: "low", task: "Organize Digital Files", description: "Clean up downloads and desktop", timeEstimate: "30 min", completed: false }
  ]);

  // ─────────────────────────────────────────────────────────────
  // CONSTANTS
  // ─────────────────────────────────────────────────────────────
  const categories = [
    { value: 'reflection', label: 'Reflection', color: 'indigo' },
    { value: 'insight', label: 'Insight', color: 'emerald' },
    { value: 'challenge', label: 'Challenge', color: 'amber' },
    { value: 'win', label: 'Win', color: 'green' },
    { value: 'plan', label: 'Plan', color: 'blue' },
    { value: 'vent', label: 'Vent', color: 'rose' }
  ];

  const moods = [
    { value: 'great', label: 'Great', icon: Zap, color: 'text-green-500' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-emerald-500' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-slate-400' },
    { value: 'low', label: 'Low', icon: Frown, color: 'text-amber-500' },
    { value: 'struggling', label: 'Struggling', icon: Heart, color: 'text-rose-500' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'profile', label: 'Profile', icon: Brain }
  ];

  // ─────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleAddEntry = () => {
    if (!newEntry.content.trim()) return;
    const entry = {
      id: Date.now(),
      ...newEntry,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEntries(prev => [entry, ...prev]);
    setNewEntry({ content: '', category: 'reflection', mood: 'neutral', tags: '' });
    setShowEntryForm(false);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleExpanded = (id) => {
    setExpandedEntries(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ─────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesCategory && matchesMood;
  });

  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toLocaleDateString();
      const hasEntry = entries.some(e => new Date(e.timestamp).toLocaleDateString() === dateStr);
      if (hasEntry) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const stats = {
    totalEntries: entries.length,
    thisWeek: entries.filter(e => {
      const entryDate = new Date(e.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    streak: calculateStreak(),
    completedTasks: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length
  };

  const moodStats = moods.map(m => ({
    ...m,
    count: entries.filter(e => e.mood === m.value).length,
    percentage: entries.length ? Math.round((entries.filter(e => e.mood === m.value).length / entries.length) * 100) : 0
  }));

  // ─────────────────────────────────────────────────────────────
  // STYLE UTILITIES
  // ─────────────────────────────────────────────────────────────
  const getCategoryStyle = (cat) => {
    const styles = {
      reflection: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
      insight: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
      challenge: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
      win: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
      plan: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
      vent: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' }
    };
    return styles[cat] || styles.reflection;
  };

  const getMoodIcon = (moodValue) => moods.find(m => m.value === moodValue)?.icon || Meh;
  const getMoodColor = (moodValue) => moods.find(m => m.value === moodValue)?.color || 'text-slate-400';

  const getUrgencyStyle = (urgency) => {
    const styles = {
      critical: { bg: 'bg-gradient-to-r from-rose-500/10 to-orange-500/10', border: 'border-rose-500/30', badge: 'bg-rose-500 text-white' },
      high: { bg: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500 text-white' },
      medium: { bg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/30', badge: 'bg-blue-500 text-white' },
      low: { bg: 'bg-slate-500/5 dark:bg-slate-500/10', border: 'border-slate-300 dark:border-slate-600', badge: 'bg-slate-400 text-white' }
    };
    return styles[urgency] || styles.low;
  };

  // ─────────────────────────────────────────────────────────────
  // THEME-AWARE CLASS HELPERS
  // ─────────────────────────────────────────────────────────────
  const cx = {
    // Backgrounds
    pageBg: 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30',
    cardBg: 'bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl',
    cardBgSolid: 'bg-white dark:bg-slate-800',
    glassBg: 'bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl',
    
    // Borders
    border: 'border border-slate-200/80 dark:border-slate-700/50',
    borderSubtle: 'border border-slate-100 dark:border-slate-700/30',
    
    // Text
    textPrimary: 'text-slate-900 dark:text-white',
    textSecondary: 'text-slate-600 dark:text-slate-300',
    textMuted: 'text-slate-500 dark:text-slate-400',
    textFaint: 'text-slate-400 dark:text-slate-500',
    
    // Interactive
    hoverBg: 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50',
    activeBg: 'bg-slate-100 dark:bg-slate-700',
    
    // Shadows
    shadowSm: 'shadow-sm shadow-slate-200/50 dark:shadow-slate-900/50',
    shadowMd: 'shadow-md shadow-slate-200/50 dark:shadow-slate-900/50',
    shadowLg: 'shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60',
    shadowXl: 'shadow-xl shadow-slate-300/50 dark:shadow-slate-900/70',
    
    // Accent
    accentGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    accentGradientSubtle: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    accentBorder: 'border-indigo-500/30'
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={`min-h-screen ${cx.pageBg} ${cx.textPrimary} transition-colors duration-300`}>
      
      {/* ══════════════════ HEADER ══════════════════ */}
      <header className={`sticky top-0 z-50 ${cx.glassBg} ${cx.border} border-t-0 border-x-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-2xl ${cx.accentGradient} shadow-lg shadow-indigo-500/25`}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold tracking-tight">Command Center</h1>
                <p className={`text-xs ${cx.textMuted} -mt-0.5`}>External Brain System</p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? `${cx.cardBgSolid} ${cx.shadowSm} ${cx.textPrimary}` 
                        : `${cx.textMuted} hover:text-slate-700 dark:hover:text-slate-200`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className={`p-2 rounded-xl ${cx.hoverBg} ${cx.textMuted} transition-all`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowEntryForm(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${cx.accentGradient} text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Entry</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* ════════════════ OVERVIEW TAB ════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Entries', value: stats.totalEntries, icon: BookOpen, color: 'indigo' },
                { label: 'This Week', value: stats.thisWeek, icon: Calendar, color: 'emerald' },
                { label: 'Day Streak', value: stats.streak, icon: Flame, color: 'amber', suffix: 'days' },
                { label: 'Tasks Done', value: `${stats.completedTasks}/${stats.totalTasks}`, icon: CheckCircle, color: 'green' }
              ].map((stat, i) => (
                <div key={i} className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium uppercase tracking-wider ${cx.textMuted}`}>{stat.label}</span>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                    {stat.suffix && <span className={`text-sm font-normal ${cx.textMuted} ml-1`}>{stat.suffix}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Entries */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${cx.textMuted}`}>Recent Entries</h2>
                  <button onClick={() => setActiveTab('journal')} className={`text-xs ${cx.accentText} font-medium flex items-center gap-1 hover:gap-2 transition-all`}>
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {entries.slice(0, 4).map(entry => {
                    const MoodIcon = getMoodIcon(entry.mood);
                    const catStyle = getCategoryStyle(entry.category);
                    return (
                      <div key={entry.id} className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-4 hover:scale-[1.01] transition-all duration-200 group`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${catStyle.bg} ${catStyle.border} border`}>
                            <MoodIcon className={`w-4 h-4 ${getMoodColor(entry.mood)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}>
                                {entry.category}
                              </span>
                              <span className={`text-xs ${cx.textFaint}`}>{entry.date} · {entry.time}</span>
                            </div>
                            <p className={`text-sm ${cx.textSecondary} line-clamp-2`}>{entry.content}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {entries.length === 0 && (
                    <div className={`${cx.cardBg} ${cx.border} rounded-2xl p-8 text-center`}>
                      <BookOpen className={`w-10 h-10 mx-auto mb-3 ${cx.textFaint}`} />
                      <p className={cx.textMuted}>No entries yet. Start journaling!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Focus Card */}
                <div className={`${cx.accentGradientSubtle} ${cx.accentBorder} border rounded-2xl p-4 ${cx.shadowSm}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${cx.accentText}`}>Current Focus</span>
                  </div>
                  <p className={`text-sm font-medium ${cx.textPrimary}`}>{compiledProfile.currentFocus.primary}</p>
                </div>

                {/* Priority Tasks */}
                <div className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${cx.textMuted}`}>Priority Today</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.urgency === 'critical' || t.urgency === 'high').slice(0, 3).map(task => (
                      <div key={task.id} className={`flex items-center gap-3 p-2 rounded-xl ${getUrgencyStyle(task.urgency).bg} ${task.completed ? 'opacity-50' : ''}`}>
                        <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'}`}>
                          {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-sm ${task.completed ? 'line-through' : ''} ${cx.textSecondary}`}>{task.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mood Distribution */}
                <div className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${cx.textMuted}`}>Mood Trends</span>
                  </div>
                  <div className="space-y-2">
                    {moodStats.filter(m => m.count > 0).map(mood => (
                      <div key={mood.value} className="flex items-center gap-2">
                        <mood.icon className={`w-4 h-4 ${mood.color}`} />
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${mood.color.replace('text-', 'bg-')}`} style={{ width: `${mood.percentage}%` }} />
                        </div>
                        <span className={`text-xs ${cx.textMuted} w-8`}>{mood.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ JOURNAL TAB ════════════════ */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-4`}>
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${cx.textMuted}`} />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl ${cx.cardBgSolid} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                  />
                </div>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`px-4 py-2 rounded-xl ${cx.cardBgSolid} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)} className={`px-4 py-2 rounded-xl ${cx.cardBgSolid} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}>
                  <option value="all">All Moods</option>
                  {moods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-3">
              {filteredEntries.map(entry => {
                const MoodIcon = getMoodIcon(entry.mood);
                const catStyle = getCategoryStyle(entry.category);
                const isExpanded = expandedEntries[entry.id];
                return (
                  <div key={entry.id} className={`${cx.cardBg} ${cx.border} ${cx.shadowSm} rounded-2xl p-5 transition-all duration-200`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${catStyle.bg} ${catStyle.border} border`}>
                        <MoodIcon className={`w-5 h-5 ${getMoodColor(entry.mood)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text} border ${catStyle.border}`}>
                            {entry.category}
                          </span>
                          <span className={`text-xs ${cx.textFaint}`}>{entry.date} · {entry.time}</span>
                        </div>
                        <p className={`text-sm ${cx.textSecondary} whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>{entry.content}</p>
                        {entry.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {entry.tags.map(tag => (
                              <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${cx.cardBgSolid} ${cx.border} ${cx.textMuted}`}>#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleExpanded(entry.id)} className={`p-2 rounded-xl ${cx.hoverBg} ${cx.textMuted} transition-all`}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDeleteEntry(entry.id)} className={`p-2 rounded-xl hover:bg-rose-500/10 ${cx.textMuted} hover:text-rose-500 transition-all`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredEntries.length === 0 && (
                <div className={`${cx.cardBg} ${cx.border} rounded-2xl p-12 text-center`}>
                  <Search className={`w-10 h-10 mx-auto mb-3 ${cx.textFaint}`} />
                  <p className={cx.textMuted}>No entries found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════ TASKS TAB ════════════════ */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {['critical', 'high', 'medium', 'low'].map(urgency => {
              const urgencyTasks = tasks.filter(t => t.urgency === urgency);
              if (urgencyTasks.length === 0) return null;
              const style = getUrgencyStyle(urgency);
              return (
                <div key={urgency} className="space-y-2">
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${cx.textMuted} mb-2`}>{urgency}</h3>
                  {urgencyTasks.map(task => (
                    <div key={task.id} className={`${cx.cardBg} ${style.border} border ${cx.shadowSm} rounded-2xl p-4 transition-all duration-200 ${task.completed ? 'opacity-60' : ''}`}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600 hover:border-green-500'}`}>
                          {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>{urgency}</span>
                            <span className={`text-xs ${cx.textFaint}`}>{task.timeEstimate}</span>
                          </div>
                          <p className={`font-medium ${task.completed ? 'line-through' : ''} ${cx.textPrimary}`}>{task.task}</p>
                          <p className={`text-sm ${cx.textMuted} mt-0.5`}>{task.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════ PROFILE TAB ════════════════ */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className={`${cx.cardBg} ${cx.border} ${cx.shadowMd} rounded-2xl p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-500" />
                <h2 className="font-semibold">Core Patterns</h2>
              </div>
              <ul className="space-y-3">
                {compiledProfile.corePatterns.map((pattern, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full ${cx.accentGradientSubtle} ${cx.accentText} flex items-center justify-center text-xs font-medium flex-shrink-0 border ${cx.accentBorder}`}>{i + 1}</span>
                    <span className={`text-sm ${cx.textSecondary}`}>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${cx.cardBg} ${cx.border} ${cx.shadowMd} rounded-2xl p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-emerald-500" />
                <h2 className="font-semibold">Strengths</h2>
              </div>
              <ul className="space-y-3">
                {compiledProfile.strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className={`text-sm ${cx.textSecondary}`}>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`lg:col-span-2 ${cx.accentGradientSubtle} ${cx.accentBorder} border ${cx.shadowMd} rounded-2xl p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-500" />
                <h2 className="font-semibold">Focus Areas</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Primary', value: compiledProfile.currentFocus.primary, highlight: true },
                  { label: 'Secondary', value: compiledProfile.currentFocus.secondary },
                  { label: 'Tertiary', value: compiledProfile.currentFocus.tertiary }
                ].map((focus, i) => (
                  <div key={i} className={`p-4 rounded-xl ${cx.cardBg} ${cx.border}`}>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${focus.highlight ? cx.accentText : cx.textMuted}`}>{focus.label}</p>
                    <p className={`text-sm ${cx.textSecondary}`}>{focus.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ══════════════════ NEW ENTRY MODAL ══════════════════ */}
      {showEntryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowEntryForm(false)}>
          <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-lg ${cx.cardBgSolid} ${cx.border} ${cx.shadowXl} rounded-3xl p-6 transform transition-all duration-300 scale-100`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">New Entry</h2>
              <button onClick={() => setShowEntryForm(false)} className={`p-2 rounded-xl ${cx.hoverBg} ${cx.textMuted} transition-all`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                autoFocus
                placeholder="What's on your mind?"
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                rows={5}
                className={`w-full p-4 rounded-2xl ${cx.cardBg} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all`}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${cx.textMuted} mb-1.5 block`}>Category</label>
                  <select value={newEntry.category} onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))} className={`w-full px-4 py-2.5 rounded-xl ${cx.cardBg} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${cx.textMuted} mb-1.5 block`}>Mood</label>
                  <select value={newEntry.mood} onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))} className={`w-full px-4 py-2.5 rounded-xl ${cx.cardBg} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}>
                    {moods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium ${cx.textMuted} mb-1.5 block`}>Tags</label>
                <input
                  type="text"
                  placeholder="work, idea, personal (comma separated)"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl ${cx.cardBg} ${cx.border} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                />
              </div>
              <button
                onClick={handleAddEntry}
                disabled={!newEntry.content.trim()}
                className={`w-full py-3 rounded-xl ${cx.accentGradient} text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all duration-200`}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect, useMemo } from 'react';

interface Quote {
  id: string;
  content: string;
  author: string;
  category: 'teacher' | 'friend' | 'family' | 'stranger' | 'book' | 'other';
  rating: number;
  createdAt: string;
  tags: string[];
}

interface DailyWord {
  quoteId: string;
  date: string;
  practiced: boolean;
  practiceNote?: string;
}

interface ActionPlan {
  id: string;
  quoteId: string;
  title: string;
  description: string;
  steps: { id: string; content: string; completed: boolean }[];
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

interface Benefactor {
  id: string;
  name: string;
  relation: string;
  stage: string;
  influence: string;
  avatar?: string;
  metAt: string;
  keyMoments: string[];
  connectedTo: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  teacher: '师长',
  friend: '朋友',
  family: '家人',
  stranger: '陌生人',
  book: '书中',
  other: '其他',
};

const STAGE_OPTIONS = ['童年', '小学', '初中', '高中', '大学', '职场初期', '职场中期', '现在'];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const STORAGE_KEYS = {
  quotes: 'mj-quotes',
  dailyWords: 'mj-daily-words',
  actionPlans: 'mj-action-plans',
  benefactors: 'mj-benefactors',
  activeTab: 'mj-active-tab',
};

const DEFAULT_QUOTES: Quote[] = [
  {
    id: '1',
    content: '人生就像一盒巧克力，你永远不知道下一颗是什么味道。',
    author: '阿甘妈妈',
    category: 'book',
    rating: 5,
    createdAt: new Date().toISOString(),
    tags: ['人生', '未知'],
  },
  {
    id: '2',
    content: '读书是在别人思想的帮助下，建立起自己的思想。',
    author: '张老师',
    category: 'teacher',
    rating: 4,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['读书', '思想'],
  },
  {
    id: '3',
    content: '别怕，有我在。',
    author: '爸爸',
    category: 'family',
    rating: 5,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    tags: ['亲情', '勇气'],
  },
];

const ComboShell: React.FC<{
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, subtitle, primaryColor, icon, children }) => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, #1a1a2e 50%, #0f0f23 100%)` }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: primaryColor }}>
            {title}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl ${onClick ? 'cursor-pointer hover:bg-white/10 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}> = ({ label, value, icon, color, trend }) => {
  return (
    <GlassCard className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs md:text-sm mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold" style={{ color }}>{value}</p>
          {trend && <p className="text-xs text-green-400 mt-1">{trend}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </GlassCard>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  primaryColor: string;
}> = ({ active, onClick, icon, label, primaryColor }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 ${
        active ? 'shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
      style={active ? { backgroundColor: `${primaryColor}30`, color: primaryColor } : {}}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const StarRating: React.FC<{
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}> = ({ value, onChange, size = 'md', readOnly = false }) => {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={readOnly ? '' : 'cursor-pointer hover:scale-110 transition-transform'}
          style={{ color: star <= value ? '#ffd89a' : '#4a4a5a' }}
          onClick={() => !readOnly && onChange?.(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const QuoteCollection: React.FC<{
  quotes: Quote[];
  setQuotes: (quotes: Quote[] | ((prev: Quote[]) => Quote[])) => void;
  primaryColor: string;
}> = ({ quotes, setQuotes, primaryColor }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newQuote, setNewQuote] = useState({
    content: '',
    author: '',
    category: 'other' as Quote['category'],
    rating: 0,
    tags: '',
  });

  const filteredQuotes = useMemo(() => {
    if (filterCategory === 'all') return quotes;
    return quotes.filter((q) => q.category === filterCategory);
  }, [quotes, filterCategory]);

  const stats = useMemo(() => {
    const total = quotes.length;
    const avgRating = total > 0 ? (quotes.reduce((sum, q) => sum + q.rating, 0) / total).toFixed(1) : '0';
    const fiveStarCount = quotes.filter((q) => q.rating === 5).length;
    return { total, avgRating, fiveStarCount };
  }, [quotes]);

  const handleAddQuote = () => {
    if (!newQuote.content.trim()) return;
    const quote: Quote = {
      id: Date.now().toString(),
      content: newQuote.content,
      author: newQuote.author || '佚名',
      category: newQuote.category,
      rating: newQuote.rating,
      createdAt: new Date().toISOString(),
      tags: newQuote.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    };
    setQuotes((prev) => [quote, ...prev]);
    setNewQuote({ content: '', author: '', category: 'other', rating: 0, tags: '' });
    setShowForm(false);
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleUpdateRating = (id: string, rating: number) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, rating } : q)));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="语录总数" value={stats.total} icon="📚" color={primaryColor} />
        <StatCard label="平均评分" value={stats.avgRating} icon="⭐" color={primaryColor} />
        <StatCard label="五星珍藏" value={stats.fiveStarCount} icon="💎" color={primaryColor} />
      </div>

      <GlassCard className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filterCategory === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={filterCategory === 'all' ? { backgroundColor: `${primaryColor}40` } : {}}
            >
              全部
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filterCategory === key ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={filterCategory === key ? { backgroundColor: `${primaryColor}40` } : {}}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
          >
            {showForm ? '取消' : '+ 收录语录'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">语录内容 *</label>
              <textarea
                value={newQuote.content}
                onChange={(e) => setNewQuote({ ...newQuote, content: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none"
                rows={3}
                placeholder="写下那句触动你的话..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">谁说的</label>
                <input
                  type="text"
                  value={newQuote.author}
                  onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  placeholder="作者/来源"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">分类</label>
                <select
                  value={newQuote.category}
                  onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value as Quote['category'] })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key} className="bg-gray-800">
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">标签（用逗号分隔）</label>
              <input
                type="text"
                value={newQuote.tags}
                onChange={(e) => setNewQuote({ ...newQuote, tags: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                placeholder="例如：人生, 励志, 成长"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">评分</label>
              <StarRating
                value={newQuote.rating}
                onChange={(v) => setNewQuote({ ...newQuote, rating: v })}
                size="lg"
              />
            </div>
            <button
              onClick={handleAddQuote}
              disabled={!newQuote.content.trim()}
              className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
            >
              收录这条语录
            </button>
          </div>
        )}

        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">📝</div>
              <p>还没有收录语录</p>
              <p className="text-sm mt-1">点击上方按钮，开始收集贵人的智慧</p>
            </div>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    {CATEGORY_LABELS[quote.category]}
                  </span>
                  <button
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-sm"
                  >
                    删除
                  </button>
                </div>
                <p className="text-white text-base md:text-lg mb-3 leading-relaxed">"{quote.content}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">— {quote.author}</span>
                  </div>
                  <StarRating value={quote.rating} onChange={(v) => handleUpdateRating(quote.id, v)} size="sm" />
                </div>
                {quote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                    {quote.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📜 最近收录</h3>
        <div className="space-y-3">
          {quotes.slice(0, 5).map((quote) => (
            <div key={quote.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{quote.content}</p>
                <p className="text-gray-500 text-xs">— {quote.author}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(quote.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          ))}
          {quotes.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">暂无记录</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

const DailyWordModule: React.FC<{
  quotes: Quote[];
  dailyWords: DailyWord[];
  setDailyWords: (words: DailyWord[] | ((prev: DailyWord[]) => DailyWord[])) => void;
  primaryColor: string;
}> = ({ quotes, dailyWords, setDailyWords, primaryColor }) => {
  const today = new Date().toISOString().split('T')[0];

  const todayWord = useMemo(() => {
    return dailyWords.find((dw) => dw.date === today);
  }, [dailyWords, today]);

  const stats = useMemo(() => {
    const totalDays = dailyWords.length;
    const practicedDays = dailyWords.filter((dw) => dw.practiced).length;
    const streak = (() => {
      let count = 0;
      const sorted = [...dailyWords].sort((a, b) => b.date.localeCompare(a.date));
      for (const dw of sorted) {
        if (dw.practiced) count++;
        else break;
      }
      return count;
    })();
    return { totalDays, practicedDays, streak };
  }, [dailyWords]);

  const todayQuote = useMemo(() => {
    if (todayWord) {
      return quotes.find((q) => q.id === todayWord.quoteId);
    }
    return null;
  }, [todayWord, quotes]);

  const handleDrawToday = () => {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    const newDailyWord: DailyWord = {
      quoteId: selectedQuote.id,
      date: today,
      practiced: false,
    };
    setDailyWords((prev) => {
      const existing = prev.find((dw) => dw.date === today);
      if (existing) {
        return prev.map((dw) => (dw.date === today ? newDailyWord : dw));
      }
      return [...prev, newDailyWord];
    });
  };

  const handleTogglePractice = () => {
    setDailyWords((prev) =>
      prev.map((dw) =>
        dw.date === today ? { ...dw, practiced: !dw.practiced } : dw
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="累计天数" value={stats.totalDays} icon="📅" color={primaryColor} />
        <StatCard label="践行天数" value={stats.practicedDays} icon="✅" color={primaryColor} />
        <StatCard label="连续践行" value={`${stats.streak}天`} icon="🔥" color={primaryColor} />
      </div>

      <GlassCard className="p-6 md:p-8 text-center">
        <h3 className="text-lg font-semibold text-white mb-6">🌅 今日箴言</h3>
        {todayQuote ? (
          <div className="space-y-6">
            <div className="text-5xl mb-4">💫</div>
            <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-4">
              "{todayQuote.content}"
            </blockquote>
            <p className="text-gray-400">— {todayQuote.author}</p>
            <div className="flex justify-center gap-2 mt-4">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
              >
                {CATEGORY_LABELS[todayQuote.category]}
              </span>
              <StarRating value={todayQuote.rating} readOnly size="sm" />
            </div>
            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={handleTogglePractice}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  todayWord?.practiced
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : ''
                }`}
                style={
                  !todayWord?.practiced
                    ? { backgroundColor: primaryColor, color: '#1a1a2e' }
                    : {}
                }
              >
                {todayWord?.practiced ? '✓ 今日已践行' : '标记今日践行'}
              </button>
              {todayWord?.practiced && (
                <p className="text-green-400 text-sm mt-3">太棒了！继续保持这份觉知 💪</p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="text-6xl mb-4">🎲</div>
            <p className="text-gray-400 mb-6">今天的箴言还未揭晓</p>
            <button
              onClick={handleDrawToday}
              disabled={quotes.length === 0}
              className="px-8 py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
            >
              {quotes.length === 0 ? '请先收录语录' : '抽取今日箴言'}
            </button>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📆 历史记录</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {[...dailyWords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((dw) => {
            const quote = quotes.find((q) => q.id === dw.quoteId);
            if (!quote) return null;
            return (
              <div
                key={dw.date}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="text-center min-w-16">
                  <p className="text-white font-semibold">
                    {new Date(dw.date).getDate()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(dw.date).toLocaleDateString('zh-CN', { month: 'short' })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{quote.content}</p>
                  <p className="text-gray-500 text-xs">— {quote.author}</p>
                </div>
                <div className={dw.practiced ? 'text-green-400' : 'text-gray-600'}>
                  {dw.practiced ? '✓' : '○'}
                </div>
              </div>
            );
          })}
          {dailyWords.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">暂无历史记录</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

const WisdomPractice: React.FC<{
  quotes: Quote[];
  actionPlans: ActionPlan[];
  setActionPlans: (plans: ActionPlan[] | ((prev: ActionPlan[]) => ActionPlan[])) => void;
  primaryColor: string;
}> = ({ quotes, actionPlans, setActionPlans, primaryColor }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    steps: [{ id: '1', content: '', completed: false }],
    deadline: '',
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPlans = useMemo(() => {
    if (filterStatus === 'all') return actionPlans;
    return actionPlans.filter((p) => p.status === filterStatus);
  }, [actionPlans, filterStatus]);

  const stats = useMemo(() => {
    const total = actionPlans.length;
    const completed = actionPlans.filter((p) => p.status === 'completed').length;
    const inProgress = actionPlans.filter((p) => p.status === 'in_progress').length;
    return { total, completed, inProgress };
  }, [actionPlans]);

  const handleAddStep = () => {
    setNewPlan((prev) => ({
      ...prev,
      steps: [...prev.steps, { id: Date.now().toString(), content: '', completed: false }],
    }));
  };

  const handleRemoveStep = (stepId: string) => {
    if (newPlan.steps.length <= 1) return;
    setNewPlan((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }));
  };

  const handleStepContentChange = (stepId: string, content: string) => {
    setNewPlan((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, content } : s)),
    }));
  };

  const handleCreatePlan = () => {
    if (!selectedQuoteId || !newPlan.title.trim()) return;
    const plan: ActionPlan = {
      id: Date.now().toString(),
      quoteId: selectedQuoteId,
      title: newPlan.title,
      description: newPlan.description,
      steps: newPlan.steps.filter((s) => s.content.trim()),
      deadline: newPlan.deadline || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setActionPlans((prev) => [plan, ...prev]);
    setNewPlan({ title: '', description: '', steps: [{ id: '1', content: '', completed: false }], deadline: '' });
    setSelectedQuoteId('');
    setShowForm(false);
  };

  const handleToggleStep = (planId: string, stepId: string) => {
    setActionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const newSteps = plan.steps.map((s) =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        const allCompleted = newSteps.length > 0 && newSteps.every((s) => s.completed);
        const anyCompleted = newSteps.some((s) => s.completed);
        let newStatus: ActionPlan['status'] = plan.status;
        if (allCompleted) {
          newStatus = 'completed';
        } else if (anyCompleted) {
          newStatus = 'in_progress';
        }
        return {
          ...plan,
          steps: newSteps,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const handleDeletePlan = (planId: string) => {
    setActionPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待开始';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#c8c2ba';
      case 'in_progress': return primaryColor;
      case 'completed': return '#4ade80';
      default: return primaryColor;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="行动方案" value={stats.total} icon="📋" color={primaryColor} />
        <StatCard label="进行中" value={stats.inProgress} icon="🚀" color={primaryColor} />
        <StatCard label="已完成" value={stats.completed} icon="🏆" color={primaryColor} />
      </div>

      <GlassCard className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待开始' },
              { key: 'in_progress', label: '进行中' },
              { key: 'completed', label: '已完成' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilterStatus(item.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filterStatus === item.key ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={filterStatus === item.key ? { backgroundColor: `${primaryColor}40` } : {}}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
          >
            {showForm ? '取消' : '+ 制定方案'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">选择语录 *</label>
              <select
                value={selectedQuoteId}
                onChange={(e) => setSelectedQuoteId(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
              >
                <option value="" className="bg-gray-800">选择一条语录作为指引</option>
                {quotes.map((q) => (
                  <option key={q.id} value={q.id} className="bg-gray-800">
                    {q.content.slice(0, 30)}... — {q.author}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">行动标题 *</label>
              <input
                type="text"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                placeholder="用一句话概括你的行动目标"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">详细描述</label>
              <textarea
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none"
                rows={2}
                placeholder="描述你想要达成的具体成果..."
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-400">行动步骤</label>
                <button
                  onClick={handleAddStep}
                  className="text-sm"
                  style={{ color: primaryColor }}
                >
                  + 添加步骤
                </button>
              </div>
              <div className="space-y-2">
                {newPlan.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-2">
                    <span className="text-gray-500 pt-3 text-sm w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={step.content}
                      onChange={(e) => handleStepContentChange(step.id, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 text-sm"
                      placeholder="具体做什么..."
                    />
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-gray-500 hover:text-red-400 px-2 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">目标日期（可选）</label>
              <input
                type="date"
                value={newPlan.deadline}
                onChange={(e) => setNewPlan({ ...newPlan, deadline: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
              />
            </div>
            <button
              onClick={handleCreatePlan}
              disabled={!selectedQuoteId || !newPlan.title.trim()}
              className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
            >
              创建行动方案
            </button>
          </div>
        )}

        <div className="space-y-4">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">🎯</div>
              <p>还没有行动方案</p>
              <p className="text-sm mt-1">把一句智慧变成具体的行动吧</p>
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const quote = quotes.find((q) => q.id === plan.quoteId);
              const completedSteps = plan.steps.filter((s) => s.completed).length;
              const progress = plan.steps.length > 0 ? (completedSteps / plan.steps.length) * 100 : 0;
              return (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium mb-1">{plan.title}</h4>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getStatusColor(plan.status)}20`, color: getStatusColor(plan.status) }}
                      >
                        {getStatusLabel(plan.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-sm"
                    >
                      删除
                    </button>
                  </div>

                  {quote && (
                    <div className="mb-4 p-3 rounded-lg bg-white/5 border-l-2" style={{ borderLeftColor: primaryColor }}>
                      <p className="text-gray-300 text-sm italic">"{quote.content}"</p>
                      <p className="text-gray-500 text-xs mt-1">— {quote.author}</p>
                    </div>
                  )}

                  {plan.description && (
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  )}

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>进度</span>
                      <span>{completedSteps}/{plan.steps.length} 步</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                        onClick={() => handleToggleStep(plan.id, step.id)}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            step.completed ? 'border-green-400 bg-green-400/20' : 'border-gray-600'
                          }`}
                        >
                          {step.completed && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${step.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                          {index + 1}. {step.content}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.deadline && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs text-gray-500">
                      <span>目标日期：{plan.deadline}</span>
                      {plan.completedAt && (
                        <span>完成于：{new Date(plan.completedAt).toLocaleDateString('zh-CN')}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 践行足迹</h3>
        <div className="space-y-3">
          {[...actionPlans].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((plan) => {
            const quote = quotes.find((q) => q.id === plan.quoteId);
            return (
              <div key={plan.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(plan.status) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{plan.title}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {quote ? `"${quote.content.slice(0, 20)}..."` : '无关联语录'}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(plan.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            );
          })}
          {actionPlans.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">暂无记录</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

const BenefactorMap: React.FC<{
  benefactors: Benefactor[];
  setBenefactors: (b: Benefactor[] | ((prev: Benefactor[]) => Benefactor[])) => void;
  primaryColor: string;
}> = ({ benefactors, setBenefactors, primaryColor }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBenefactor, setSelectedBenefactor] = useState<Benefactor | null>(null);
  const [newBenefactor, setNewBenefactor] = useState({
    name: '',
    relation: '',
    stage: '现在',
    influence: '',
    metAt: new Date().toISOString().split('T')[0],
    keyMoments: '',
  });

  const stats = useMemo(() => {
    const total = benefactors.length;
    const stages = new Set(benefactors.map((b) => b.stage)).size;
    const avgInfluence = total > 0
      ? (benefactors.reduce((sum, b) => sum + b.keyMoments.length, 0) / total).toFixed(1)
      : '0';
    return { total, stages, avgInfluence };
  }, [benefactors]);

  const handleAddBenefactor = () => {
    if (!newBenefactor.name.trim()) return;
    const benefactor: Benefactor = {
      id: Date.now().toString(),
      name: newBenefactor.name,
      relation: newBenefactor.relation,
      stage: newBenefactor.stage,
      influence: newBenefactor.influence,
      metAt: newBenefactor.metAt,
      keyMoments: newBenefactor.keyMoments.split(/[,，\n]/).map((m) => m.trim()).filter(Boolean),
      connectedTo: [],
    };
    setBenefactors((prev) => [...prev, benefactor]);
    setNewBenefactor({
      name: '',
      relation: '',
      stage: '现在',
      influence: '',
      metAt: new Date().toISOString().split('T')[0],
      keyMoments: '',
    });
    setShowForm(false);
  };

  const handleDeleteBenefactor = (id: string) => {
    setBenefactors((prev) => prev.filter((b) => b.id !== id));
    if (selectedBenefactor?.id === id) {
      setSelectedBenefactor(null);
    }
  };

  const benefactorsByStage = useMemo(() => {
    const grouped: Record<string, Benefactor[]> = {};
    benefactors.forEach((b) => {
      if (!grouped[b.stage]) grouped[b.stage] = [];
      grouped[b.stage].push(b);
    });
    return grouped;
  }, [benefactors]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="贵人总数" value={stats.total} icon="👥" color={primaryColor} />
        <StatCard label="人生阶段" value={stats.stages} icon="🌱" color={primaryColor} />
        <StatCard label="平均关键时刻" value={stats.avgInfluence} icon="✨" color={primaryColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">🗺️ 贵人地图</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
            >
              {showForm ? '取消' : '+ 添加贵人'}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">姓名/称呼 *</label>
                  <input
                    type="text"
                    value={newBenefactor.name}
                    onChange={(e) => setNewBenefactor({ ...newBenefactor, name: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                    placeholder="例如：李老师"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">关系</label>
                  <input
                    type="text"
                    value={newBenefactor.relation}
                    onChange={(e) => setNewBenefactor({ ...newBenefactor, relation: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                    placeholder="例如：高中班主任"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">相遇阶段</label>
                  <select
                    value={newBenefactor.stage}
                    onChange={(e) => setNewBenefactor({ ...newBenefactor, stage: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
                  >
                    {STAGE_OPTIONS.map((stage) => (
                      <option key={stage} value={stage} className="bg-gray-800">
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">相遇时间</label>
                  <input
                    type="date"
                    value={newBenefactor.metAt}
                    onChange={(e) => setNewBenefactor({ ...newBenefactor, metAt: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">TA如何影响了你</label>
                <textarea
                  value={newBenefactor.influence}
                  onChange={(e) => setNewBenefactor({ ...newBenefactor, influence: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none"
                  rows={2}
                  placeholder="描述TA对你的影响..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">关键时刻（用逗号或换行分隔）</label>
                <textarea
                  value={newBenefactor.keyMoments}
                  onChange={(e) => setNewBenefactor({ ...newBenefactor, keyMoments: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 resize-none"
                  rows={2}
                  placeholder="例如：高考前的鼓励, 第一次实习推荐..."
                />
              </div>
              <button
                onClick={handleAddBenefactor}
                disabled={!newBenefactor.name.trim()}
                className="w-full py-3 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: primaryColor, color: '#1a1a2e' }}
              >
                添加到贵人地图
              </button>
            </div>
          )}

          {benefactors.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4">🌟</div>
              <p>你的贵人地图还是空白的</p>
              <p className="text-sm mt-2">回想生命中帮助过你的人，把他们记录下来</p>
            </div>
          ) : (
            <div className="space-y-6">
              {STAGE_OPTIONS.filter((stage) => benefactorsByStage[stage]?.length > 0).map((stage) => (
                <div key={stage}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <h4 className="text-white font-medium">{stage}</h4>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-gray-500 text-sm">{benefactorsByStage[stage].length}人</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {benefactorsByStage[stage].map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBenefactor(b)}
                        className={`p-4 rounded-xl cursor-pointer transition-all group ${
                          selectedBenefactor?.id === b.id
                            ? 'bg-white/10 border-white/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } border`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                            style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                          >
                            {b.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{b.name}</p>
                            <p className="text-gray-500 text-xs truncate">{b.relation}</p>
                          </div>
                        </div>
                        {b.influence && (
                          <p className="text-gray-400 text-xs line-clamp-2">{b.influence}</p>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            {b.keyMoments.length}个关键时刻
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBenefactor(b.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-all"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 贵人详情</h3>
          {selectedBenefactor ? (
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-white/10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
                  style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                >
                  {selectedBenefactor.name.charAt(0)}
                </div>
                <h4 className="text-white text-lg font-semibold">{selectedBenefactor.name}</h4>
                <p className="text-gray-400 text-sm">{selectedBenefactor.relation}</p>
                <p className="text-gray-500 text-xs mt-1">相遇于 {selectedBenefactor.stage}</p>
              </div>

              {selectedBenefactor.influence && (
                <div>
                  <h5 className="text-sm text-gray-400 mb-2">影响</h5>
                  <p className="text-white text-sm leading-relaxed">{selectedBenefactor.influence}</p>
                </div>
              )}

              {selectedBenefactor.keyMoments.length > 0 && (
                <div>
                  <h5 className="text-sm text-gray-400 mb-2">关键时刻</h5>
                  <div className="space-y-2">
                    {selectedBenefactor.keyMoments.map((moment, i) => (
                      <div key={i} className="flex gap-2 p-2 rounded-lg bg-white/5">
                        <span style={{ color: primaryColor }}>✦</span>
                        <span className="text-gray-300 text-sm">{moment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-500 text-xs text-center">
                  相遇时间：{selectedBenefactor.metAt}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">👆</div>
              <p className="text-sm">点击左侧贵人卡片查看详情</p>
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📜 最近添加的贵人</h3>
        <div className="space-y-3">
          {[...benefactors].sort((a, b) => b.metAt.localeCompare(a.metAt)).slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
              >
                {b.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{b.name}</p>
                <p className="text-gray-500 text-xs">{b.relation} · {b.stage}</p>
              </div>
              <span className="text-xs text-gray-500">{b.metAt}</span>
            </div>
          ))}
          {benefactors.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">暂无记录</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

const MercuryJupiterPage: React.FC = () => {
  const primaryColor = '#ffd89a';
  const secondaryColor = '#c8c2ba';

  const [quotes, setQuotes] = useLocalStorage<Quote[]>(STORAGE_KEYS.quotes, DEFAULT_QUOTES);
  const [dailyWords, setDailyWords] = useLocalStorage<DailyWord[]>(STORAGE_KEYS.dailyWords, []);
  const [actionPlans, setActionPlans] = useLocalStorage<ActionPlan[]>(STORAGE_KEYS.actionPlans, []);
  const [benefactors, setBenefactors] = useLocalStorage<Benefactor[]>(STORAGE_KEYS.benefactors, []);
  const [activeTab, setActiveTab] = useLocalStorage<string>(STORAGE_KEYS.activeTab, 'quotes');

  const tabs = [
    { id: 'quotes', icon: '📚', label: '语录收藏' },
    { id: 'daily', icon: '🎯', label: '每日一言' },
    { id: 'practice', icon: '🌟', label: '智慧践行' },
    { id: 'map', icon: '🗺️', label: '贵人地图' },
  ];

  return (
    <ComboShell
      title="水星 × 木星 贵人语录"
      subtitle="收集生命中的智慧话语，让贵人的光芒指引前行"
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      icon="🌟"
    >
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
            primaryColor={primaryColor}
          />
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'quotes' && (
          <QuoteCollection quotes={quotes} setQuotes={setQuotes} primaryColor={primaryColor} />
        )}
        {activeTab === 'daily' && (
          <DailyWordModule
            quotes={quotes}
            dailyWords={dailyWords}
            setDailyWords={setDailyWords}
            primaryColor={primaryColor}
          />
        )}
        {activeTab === 'practice' && (
          <WisdomPractice
            quotes={quotes}
            actionPlans={actionPlans}
            setActionPlans={setActionPlans}
            primaryColor={primaryColor}
          />
        )}
        {activeTab === 'map' && (
          <BenefactorMap
            benefactors={benefactors}
            setBenefactors={setBenefactors}
            primaryColor={primaryColor}
          />
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </ComboShell>
  );
};

export default MercuryJupiterPage;

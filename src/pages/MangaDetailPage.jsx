import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { mangaService, commentService, getImageUrl } from '../services/api'
import { useBookmarkStore, useAuthStore } from '../store/useAuthStore'

function StarIcon({ filled }) {
  return (
    <svg className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 20 20" stroke="currentColor" strokeWidth={filled ? 0 : 1}>
      <path className="text-yellow-400" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function MangaDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore()
  const [localLikes, setLocalLikes] = useState(new Set());

  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [chaptersExpanded, setChaptersExpanded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const bookmarked = isBookmarked(id)
const firstChapterId = chapters.length > 0 ? chapters[0].id : null;

  useEffect(() => {
  // Проверка: если id нет, или это строка "undefined", или это не число — СТОП
  const mangaId = parseInt(id);
  if (!id || id === 'undefined' || isNaN(mangaId)) {
    console.log("Ожидание корректного ID...");
    return;
  }

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Теперь запросы полетят только с валидным числом
      const [mangaData, chaptersData, commentsData] = await Promise.all([
        mangaService.getById(mangaId),
        mangaService.getChapters(mangaId),
        commentService.getByManga(mangaId)
      ]);
      
      setManga(mangaData);
      setChapters(chaptersData || []);
      setComments(commentsData || []);
      
      const likedIds = new Set();
      (commentsData || []).forEach(c => {
        if (c.is_liked) likedIds.add(c.id);
        c.replies?.forEach(r => { if (r.is_liked) likedIds.add(r.id); });
      });
      setLocalLikes(likedIds);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [id]);
  const postComment = async () => {
    if (!commentText.trim() || isPosting) return
    setIsPosting(true)
    try {
      const newComment = await commentService.create({
        manga_id: parseInt(id),
        body: commentText.trim()
      })
      // Добавляем новый коммент в начало списка
      setComments(prev => [newComment, ...prev])
      setCommentText('')
    } catch (err) {
      alert("Failed to post comment. Make sure you are logged in.")
    } finally {
      setIsPosting(false)
    }
  }

  const [likedComments, setLikedComments] = useState(new Set()); // Локальное состояние лайков

const handleToggleLike = async (commentId) => {
  if (!user) return alert("Please login to like comments");
  const numericId = Number(commentId);

  try {
    const response = await commentService.toggleLike(numericId);
    
    // Берем action из любого возможного места в ответе
    const action = response.data?.action || response.action;

    // 1. Обновляем визуальное состояние сердечка
    setLocalLikes(prev => {
      const next = new Set(prev);
      if (action === 'liked') next.add(numericId);
      else next.delete(numericId);
      return next;
    });

    // 2. Обновляем цифру в массиве комментариев
    setComments(prev => prev.map(c => {
      if (Number(c.id) === numericId) {
        return { 
          ...c, 
          likes: action === 'liked' ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1) 
        };
      }
      return c;
    }));
  } catch (err) {
    console.error("Like error:", err);
  }
};
const { isAuthenticated } = useAuthStore();
const { fetchBookmarks, bookmarks } = useBookmarkStore();

useEffect(() => {
  if (isAuthenticated) {
    // Спрашиваем бэкенд: "Какие закладки у меня сейчас в базе?"
    fetchBookmarks();
  }
}, [isAuthenticated, id]); 

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neon-blue font-mono">LOADING DATA...</div>
  if (!manga) return <div className="min-h-screen flex items-center justify-center text-white">Manga not found</div>

  const displayChapters = chaptersExpanded ? chapters : chapters.slice(0, 10)
  const stars = Math.round((manga.avg_rating || 0) / 2) // База от 1 до 10, звезды от 1 до 5

  return (
    <div className="min-h-screen pt-16">
      {/* ── Cinematic backdrop ─────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 42vh, 480px)' }}>
        <img
          src={getImageUrl(manga.cover)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'blur(10px) saturate(0.6)', transform: 'scale(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 -mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-12">
          {/* Cover poster */}
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="flex-none">
            <div className="relative">
              <img
                src={getImageUrl(manga.cover)}
                alt={manga.title}
                className="relative w-44 sm:w-52 lg:w-56 rounded-[4px] shadow-2xl border border-white/10"
              />
            </div>
          </motion.div>

          {/* Text info */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 min-w-0 pt-44 lg:pt-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-sm status-${manga.status}`}>
                {manga.status?.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display font-black text-text-primary leading-tight mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {manga.title}
            </h1>
            <p className="text-sm font-jp text-text-muted mb-4 tracking-widest opacity-70">{manga.alt_title}</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= stars} />)}
              </div>
              <span className="font-mono font-bold text-yellow-400">{manga.avg_rating || '0.0'}</span>
              <span className="text-text-muted text-xs font-mono">/ 10</span>
            </div>

            <div className="flex flex-wrap gap-5 mb-5 text-sm">
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase mb-0.5">Author</p>
                <p className="font-semibold text-text-primary">{manga.author || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase mb-0.5">Views</p>
                <p className="font-semibold text-text-primary">{manga.views}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase mb-0.5">Year</p>
                <p className="font-semibold text-text-primary">{manga.year}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {manga.genres?.map(g => (
                <Link key={g.id || g} to={`/catalog?genre_id=${g.id || ''}`} className="px-2.5 py-1 text-xs font-mono bg-surface-3 border border-border text-text-secondary rounded-sm hover:text-neon-blue">
                  {g.name || g}
                </Link>
              ))}
            </div>

            <p className="text-text-secondary leading-relaxed mb-7 max-w-2xl">{manga.description}</p>

            <div className="flex flex-wrap gap-3">
              <Link
  to={firstChapterId ? `/reader/${manga.id}/${firstChapterId}` : '#'}
  className="..."
>
  Read Now
</Link>

              <button
  onClick={() => bookmarked ? removeBookmark(manga.id) : addBookmark(manga)}
  className={`flex items-center gap-2.5 px-6 py-3.5 border font-medium text-sm rounded-sm transition-all duration-300 ${
    bookmarked
      ? 'bg-red-500/10 border-red-500/50 text-red-500' // Если сохранено — красная рамка
      : 'bg-surface-2 border-border text-text-secondary hover:border-neon-blue hover:text-white'
  }`}
>
  <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
  {bookmarked ? 'Remove from Library' : 'Save to Library'}
</button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            {/* Chapter list */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="section-label">Contents</div>
                  <h2 className="text-xl font-display font-bold text-text-primary">Chapters</h2>
                </div>
              </div>

              <div className="space-y-1.5">
                {displayChapters.map((ch, i) => (
                  <motion.div key={ch.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                    <Link to={`/reader/${manga.id}/${ch.id}`} className="flex items-center gap-4 px-4 py-3.5 bg-surface-card border border-border rounded-[4px] hover:bg-surface-2 group">
                      <span className="text-xs font-mono text-text-muted w-10 flex-none text-right">{ch.number}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">{ch.title || `Chapter ${ch.number}`}</span>
                      </div>
                      <div className="text-[11px] font-mono text-text-muted">{new Date(ch.created_at).toLocaleDateString()}</div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {chapters.length > 10 && (
                <button onClick={() => setChaptersExpanded(!chaptersExpanded)} className="mt-3 w-full py-3 bg-surface-2 border border-border text-sm text-text-secondary hover:text-text-primary font-medium">
                  {chaptersExpanded ? 'Show Less' : `Show All ${chapters.length} Chapters`}
                </button>
              )}
            </div>

            {/* Discussion */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="section-label">Community</div>
                <h2 className="text-xl font-display font-bold text-text-primary">Discussion</h2>
              </div>

              {/* Comment form */}
              <div className="flex gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-void text-xs font-bold flex-none">
                  {user?.username?.slice(0, 2).toUpperCase() || '??'}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                    disabled={!user || isPosting}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-2 border border-border rounded-[4px] text-sm text-text-primary outline-none focus:border-neon-blue/40 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button onClick={postComment} disabled={!user || !commentText.trim() || isPosting} className="px-4 py-2 bg-neon-blue/12 border border-neon-blue/30 text-neon-blue text-sm font-medium hover:bg-neon-blue/20">
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-3 flex items-center justify-center text-white text-[10px] font-bold flex-none overflow-hidden">
                      {c.author?.avatar ? <img src={getImageUrl(c.author.avatar)} /> : (c.author?.username?.slice(0, 2).toUpperCase() || '??')}
                    </div>
                    <div className="flex-1 bg-surface-card border border-border rounded-[4px] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-text-primary">{c.author?.username || 'Deleted User'}</span>
                        <span className="text-xs text-text-muted font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3">{c.body}</p>
                     <button 
  onClick={() => handleToggleLike(c.id)}
  className={`flex items-center gap-1.5 text-xs font-mono transition-all ${
    localLikes.has(Number(c.id)) // <-- Важно Number(c.id)
      ? 'text-red-500 font-bold' 
      : 'text-text-muted hover:text-white'
  }`}
>
  <svg 
    className="w-4 h-4" 
    fill={localLikes.has(Number(c.id)) ? 'currentColor' : 'none'} 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  {c.likes || 0}
</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-surface-card border border-border rounded-[4px] p-5">
              <h3 className="text-sm font-display font-bold text-text-primary mb-4">Manga Details</h3>
              <div className="space-y-3">
                {[
                  { k: 'Artist', v: manga.artist || 'N/A' },
                  { k: 'Age Rating', v: manga.age_rating },
                  { k: 'Status', v: manga.status },
                  { k: 'Chapters', v: chapters.length },
                ].map(({ k, v }) => (
                  <div key={k} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-xs font-mono text-text-muted uppercase">{k}</span>
                    <span className="text-xs font-semibold text-text-primary">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
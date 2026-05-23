import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function AdminUserEdit() {
  const { id } = useParams() // Берем ID из URL
  const navigate = useNavigate()
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: 'user',
    bio: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Жёсткая проверка: если id это строка "undefined" или его нет - ничего не делаем
    if (!id || id === 'undefined') {
      console.log("Ждем появления ID в URL...");
      return; 
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log("Отправляем запрос для юзера ID:", id);
        const data = await authService.getProfile(id);
        
        if (data) {
          setUserData({
            username: data.Username || data.username || '',
            email: data.Email || data.email || '',
            role: data.Role || data.role || 'user',
            bio: data.Bio || data.bio || ''
          });
        }
      } catch (err) {
        console.error("Ошибка при получении профиля:", err);
        // Если юзер реально не найден (404), тогда выходим
        if (err.response?.status === 404) {
          alert("Пользователь не найден в базе данных");
          navigate('/admin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]); // Следим за изменением id

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      // Важно: передаем id и объект с данными
      await authService.updateUser(id, {
        username: userData.username,
        role: userData.role,
        bio: userData.bio
      })
      alert("Данные успешно обновлены в системе!");
      navigate('/admin');
    } catch (err) {
      alert("Ошибка при сохранении: " + (err.response?.data?.message || err.message));
    }
  }

  // Пока id нет или идет загрузка — показываем индикатор
  if (!id || id === 'undefined' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void">
        <div className="text-neon-pink font-mono animate-pulse tracking-[0.5em]">
          INITIALIZING_SECURE_CONNECTION...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-3xl mx-auto">
      <button onClick={() => navigate('/admin')} className="mb-8 text-text-muted hover:text-white transition-colors text-sm font-mono">
        ← BACK TO CONTROL CENTER
      </button>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">
            User Settings
          </h1>
          <p className="text-neon-pink font-mono text-xs mt-2">UID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 bg-surface-card border border-border p-8 rounded-sm shadow-2xl">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Username</label>
          <input 
            className="w-full bg-void border border-border p-4 text-white outline-none focus:border-neon-pink transition-all"
            value={userData.username}
            onChange={e => setUserData({...userData, username: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Email Address</label>
          <input className="w-full bg-surface-3 border border-border p-4 text-text-muted cursor-not-allowed" value={userData.email} disabled />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">System Role</label>
          <select 
            className="w-full bg-void border border-border p-4 text-white outline-none focus:border-neon-pink transition-all appearance-none"
            value={userData.role}
            onChange={e => setUserData({...userData, role: e.target.value})}
          >
            <option value="user">USER</option>
            <option value="admin">ADMIN</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Biography</label>
          <textarea 
            className="w-full bg-void border border-border p-4 text-white h-32 outline-none focus:border-neon-pink transition-all resize-none"
            value={userData.bio}
            onChange={e => setUserData({...userData, bio: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-neon-pink text-void font-black py-4 tracking-[0.3em] hover:bg-pink-400 transition-all shadow-lg">
          CONFIRM CHANGES
        </button>
      </form>
    </div>
  )
}
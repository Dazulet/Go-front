import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import MangaDetailPage from './pages/MangaDetailPage'
import ReaderPage from './pages/ReaderPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AdminMangaDetails from './pages/AdminMangaDetails'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <div className="text-8xl font-display font-black gradient-text mb-4">404</div>
        <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="px-6 py-3 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-sm text-sm font-medium hover:bg-neon-blue/20 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Auth routes - no main layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Reader - own layout */}
      <Route path="/reader/:mangaId/:chapterId" element={<ReaderPage />} />
      {/* Main layout routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/catalog" element={<MainLayout><CatalogPage /></MainLayout>} />
      <Route path="/manga/:id" element={<MainLayout><MangaDetailPage /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      <Route path="/admin" element={<MainLayout><AdminPage /></MainLayout>} />
<Route path="/admin/manga/:id" element={<MainLayout><AdminMangaDetails /></MainLayout>} />

    </Routes>
  )
}

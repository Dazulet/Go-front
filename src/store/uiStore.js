import { create } from 'zustand'

const useUIStore = create((set, get) => ({
  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Search
  searchOpen: false,
  searchQuery: '',
  setSearchOpen: (open) => set({ searchOpen: open, searchQuery: open ? get().searchQuery : '' }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  // Reader
  readerMode: false,
  readerSettings: {
    brightness: 100,
    fitMode: 'width', // 'width' | 'height' | 'original'
  },
  setReaderMode: (mode) => set({ readerMode: mode }),
  updateReaderSettings: (settings) => set(s => ({ readerSettings: { ...s.readerSettings, ...settings } })),

  // Modal
  activeModal: null,
  modalData: null,
  openModal: (id, data = null) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Scroll position
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),
}))

export default useUIStore

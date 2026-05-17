import { useQuery } from '@tanstack/react-query'
import { MOCK_MANGA, MOCK_CHAPTERS, MOCK_PAGES } from '../constants/manga'

export const useAllManga = (params = {}) =>
  useQuery({
    queryKey: ['manga', params],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return MOCK_MANGA },
  })

export const useMangaById = (id) =>
  useQuery({
    queryKey: ['manga', id],
    queryFn: async () => { await new Promise(r => setTimeout(r, 200)); return MOCK_MANGA.find(m => m.id === id) || null },
    enabled: !!id,
  })

export const useChapters = (mangaId) =>
  useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: async () => { await new Promise(r => setTimeout(r, 200)); return MOCK_CHAPTERS },
    enabled: !!mangaId,
  })

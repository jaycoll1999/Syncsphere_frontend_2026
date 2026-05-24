import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Local events store — persists events to localStorage.
 * Used as a fallback when POST /events/ returns 403 (e.g. INTERN backend role).
 * EventsPage merges these with API events so interns see their own events.
 */
export const useEventsStore = create(
  persist(
    (set) => ({
      localEvents: [],
      addLocalEvent: (event) =>
        set((state) => ({ localEvents: [...state.localEvents, event] })),
      removeLocalEvent: (id) =>
        set((state) => ({
          localEvents: state.localEvents.filter((ev) => ev.id !== id),
        })),
      clearLocalEvents: () => set({ localEvents: [] }),
    }),
    {
      name: 'syncsphere-local-events',
    }
  )
)

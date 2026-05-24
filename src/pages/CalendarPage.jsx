import React, { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  AlignLeft, 
  Trash2, 
  X, 
  Filter, 
  Check, 
  MapPin,
  Tag
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-toastify'

// Predefined categories with colors
const CATEGORIES = [
  { name: 'Work', color: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', bgLight: 'bg-indigo-50 dark:bg-indigo-950/30', badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' },
  { name: 'Meeting', color: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30', badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' },
  { name: 'Personal', color: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500', bgLight: 'bg-sky-50 dark:bg-sky-950/30', badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' },
  { name: 'Holiday', color: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', bgLight: 'bg-rose-50 dark:bg-rose-950/30', badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' },
  { name: 'Leave', color: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', bgLight: 'bg-amber-50 dark:bg-amber-950/30', badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' }
]

const CalendarPage = () => {
  const { user } = useAuthStore()
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN'

  // View States: 'month' | 'week' | 'day' | 'agenda'
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 23)) // Defaulting to system time matching May 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 23))
  
  // Event state
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'SyncSphere Core Sync',
      date: '2026-05-23',
      startTime: '10:00',
      endTime: '11:30',
      category: 'Meeting',
      description: 'Weekly team updates on frontend and design specifications.',
      location: 'Main Conference Room'
    },
    {
      id: '2',
      title: 'Database Architecture Review',
      date: '2026-05-24',
      startTime: '14:00',
      endTime: '15:30',
      category: 'Work',
      description: 'Review database normalization schemas and performance tuning metrics.',
      location: 'Virtual Zoom Call'
    },
    {
      id: '3',
      title: 'Memorial Day Holiday',
      date: '2026-05-25',
      startTime: '00:00',
      endTime: '23:59',
      category: 'Holiday',
      description: 'Public Holiday - Office Closed.',
      location: 'National'
    },
    {
      id: '4',
      title: 'Frontend Refactoring',
      date: '2026-05-20',
      startTime: '09:00',
      endTime: '12:00',
      category: 'Work',
      description: 'Refactor Tailwind components and modularize sidebar guards.',
      location: 'Workstation 4'
    },
    {
      id: '5',
      title: 'Doctor Appointment',
      date: '2026-05-23',
      startTime: '16:00',
      endTime: '17:00',
      category: 'Personal',
      description: 'Routine healthcare checkup.',
      location: 'Downtown Clinic'
    },
    {
      id: '6',
      title: 'Leave: Rahul Sharma',
      date: '2026-05-27',
      startTime: '09:00',
      endTime: '18:00',
      category: 'Leave',
      description: 'Annual privilege leave requested and approved by HR.',
      location: 'Out of Office'
    }
  ])

  // UI States
  const [activeCategories, setActiveCategories] = useState(['Work', 'Meeting', 'Personal', 'Holiday', 'Leave'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form States
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState('2026-05-23')
  const [formStartTime, setFormStartTime] = useState('09:00')
  const [formEndTime, setFormEndTime] = useState('10:00')
  const [formCategory, setFormCategory] = useState('Work')
  const [formDescription, setFormDescription] = useState('')
  const [formLocation, setFormLocation] = useState('')

  // Simulate loading states
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [view, currentDate])

  // Helper: Format Date headers
  const getHeaderMonthYear = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // Navigate dates
  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === 'agenda') {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === 'agenda') {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date(2026, 4, 23)) // Resets to system/preset target date
  }

  // Toggle categories filter
  const toggleCategory = (catName) => {
    if (activeCategories.includes(catName)) {
      setActiveCategories(activeCategories.filter(c => c !== catName))
    } else {
      setActiveCategories([...activeCategories, catName])
    }
  }

  // Compute month days grid
  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const prevTotalDays = new Date(year, month, 0).getDate()

    const days = []

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevTotalDays - i)
      days.push({ date: d, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i)
      days.push({ date: d, isCurrentMonth: true })
    }

    // Next month leading days
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i)
      days.push({ date: d, isCurrentMonth: false })
    }

    return days
  }

  // Get days of the current week starting Sunday
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      days.push(d)
    }
    return days
  }

  // Check if dates are identical
  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  // Filter and display events for a specific day string (YYYY-MM-DD)
  const getEventsForDay = (dateStr) => {
    return events.filter(e => e.date === dateStr && activeCategories.includes(e.category))
  }

  const getEventsForDate = (dateObj) => {
    const formatted = formatDateString(dateObj)
    return getEventsForDay(formatted)
  }

  const formatDateString = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // HTML5 Drag and Drop Event Handlers
  const handleDragStart = (e, eventId) => {
    if (!isAdmin) {
      toast.info('Only Administrators can reschedule events.')
      e.preventDefault()
      return
    }
    e.dataTransfer.setData('text/plain', eventId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e, targetDate) => {
    e.preventDefault()
    const eventId = e.dataTransfer.getData('text/plain')
    const targetDateStr = formatDateString(targetDate)

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        toast.success(`Rescheduled "${evt.title}" to ${targetDate.toLocaleDateString()}`)
        return { ...evt, date: targetDateStr }
      }
      return evt
    }))
  }

  // Trigger Create Modal on grid double click or "+" click
  const openCreateModal = (date = new Date(2026, 4, 23)) => {
    setModalMode('create')
    setFormTitle('')
    setFormDate(formatDateString(date))
    setFormStartTime('09:00')
    setFormEndTime('10:00')
    setFormCategory('Work')
    setFormDescription('')
    setFormLocation('')
    setIsModalOpen(true)
  }

  // Trigger Edit Modal on event click
  const openEditModal = (evt, e) => {
    e.stopPropagation()
    setSelectedEvent(evt)
    setModalMode('edit')
    setFormTitle(evt.title)
    setFormDate(evt.date)
    setFormStartTime(evt.startTime)
    setFormEndTime(evt.endTime)
    setFormCategory(evt.category)
    setFormDescription(evt.description || '')
    setFormLocation(evt.location || '')
    setIsModalOpen(true)
  }

  // Save Event Action
  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      toast.error('Event title is required!')
      return
    }

    if (modalMode === 'create') {
      const newEvent = {
        id: Date.now().toString(),
        title: formTitle,
        date: formDate,
        startTime: formStartTime,
        endTime: formEndTime,
        category: formCategory,
        description: formDescription,
        location: formLocation
      }
      setEvents([...events, newEvent])
      toast.success(`Event "${formTitle}" created successfully!`)
    } else {
      setEvents(events.map(evt => {
        if (evt.id === selectedEvent.id) {
          return {
            ...evt,
            title: formTitle,
            date: formDate,
            startTime: formStartTime,
            endTime: formEndTime,
            category: formCategory,
            description: formDescription,
            location: formLocation
          }
        }
        return evt
      }))
      toast.success(`Event "${formTitle}" updated successfully!`)
    }
    setIsModalOpen(false)
  }

  // Delete Event Action
  const handleDeleteEvent = () => {
    if (!selectedEvent) return
    setEvents(events.filter(evt => evt.id !== selectedEvent.id))
    toast.error(`Event "${selectedEvent.title}" deleted.`)
    setIsModalOpen(false)
  }

  // Standard CSS Helpers for categories
  const getCategoryTheme = (catName) => {
    return CATEGORIES.find(c => c.name === catName) || CATEGORIES[0]
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-100px)] p-1 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* LEFT SIDEBAR: Controls, Mini-Cal, Filters */}
      <div className="w-full lg:w-64 flex flex-col gap-6 flex-shrink-0">
        
        {/* Create Button */}
        <button 
          onClick={() => openCreateModal(selectedDate)}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-semibold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
        >
          <Plus className="h-5 w-5" />
          <span>Create Event</span>
        </button>

        {/* Mini Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
            </span>
            <div className="flex gap-1">
              <button onClick={handlePrev} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 text-center gap-y-1 text-xs">
            {getMonthDays().slice(0, 35).map((cell, idx) => {
              const isTodayDay = isSameDay(cell.date, new Date(2026, 4, 23)) // Highlight preset Today
              const isSelected = isSameDay(cell.date, selectedDate)
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDate(cell.date)
                    setCurrentDate(new Date(cell.date))
                  }}
                  className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-all ${
                    !cell.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'
                  } ${
                    isSelected ? 'bg-indigo-600 text-white font-bold' : ''
                  } ${
                    isTodayDay && !isSelected ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : ''
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  {cell.date.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1 text-gray-400 dark:text-gray-500">
            <Filter className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filter Calendars</span>
          </div>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(cat => {
              const active = activeCategories.includes(cat.name)
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${cat.color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                  </div>
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                    active ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300 dark:border-gray-600 bg-transparent'
                  }`}>
                    {active && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Main Calendar grid and header */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden min-h-[600px]">
        
        {/* Calendar Header toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-1 shadow-sm">
              <button 
                onClick={handlePrev}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleToday}
                className="px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors border-x border-gray-150 dark:border-gray-600"
              >
                Today
              </button>
              <button 
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white pl-2">
              {getHeaderMonthYear()}
            </h2>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-200/50 dark:border-gray-600 p-1 rounded-xl shadow-inner w-full md:w-auto">
            {['month', 'week', 'day', 'agenda'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  view === v 
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* View Grid Layout */}
        <div className="flex-1 relative overflow-y-auto">
          {isLoading ? (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
            </div>
          ) : null}

          {/* 1. MONTH VIEW */}
          {view === 'month' && (
            <div className="grid grid-cols-7 h-full min-h-[500px]">
              {/* Day names headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2 text-center text-xs font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/10">
                  {d}
                </div>
              ))}
              
              {/* Month Grid cells */}
              {getMonthDays().map((cell, idx) => {
                const dayEvents = getEventsForDate(cell.date)
                const isTodayDay = isSameDay(cell.date, new Date(2026, 4, 23))
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, cell.date)}
                    onDoubleClick={() => openCreateModal(cell.date)}
                    className={`min-h-[90px] border-b border-r border-gray-100 dark:border-gray-700 p-1 flex flex-col gap-1 transition-colors hover:bg-gray-50/30 dark:hover:bg-gray-700/10 relative ${
                      !cell.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/5' : 'bg-transparent'
                    }`}
                  >
                    {/* Day number header */}
                    <div className="flex justify-between items-center px-1">
                      <span className={`text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center transition-all ${
                        isTodayDay 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : cell.isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'
                      }`}>
                        {cell.date.getDate()}
                      </span>
                    </div>

                    {/* Day Events list */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[75px] scrollbar-thin">
                      {dayEvents.map(evt => {
                        const theme = getCategoryTheme(evt.category)
                        return (
                          <div
                            key={evt.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, evt.id)}
                            onClick={(e) => openEditModal(evt, e)}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-md border-l-4 cursor-pointer truncate shadow-sm transition-all hover:brightness-95 dark:hover:brightness-110 ${theme.bgLight} ${theme.text} ${theme.border}`}
                            title={`${evt.title} (${evt.startTime} - ${evt.endTime})`}
                          >
                            <span className="font-bold mr-1">{evt.startTime}</span>
                            {evt.title}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 2. WEEK VIEW */}
          {view === 'week' && (
            <div className="flex flex-col h-full min-h-[500px]">
              <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 text-center">
                {/* Empty corner cell */}
                <div className="py-3 border-r border-gray-150 dark:border-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-500">GMT+5.5</div>
                
                {getWeekDays().map((d, i) => {
                  const isTodayDay = isSameDay(d, new Date(2026, 4, 23))
                  return (
                    <div key={i} className={`py-2 border-r border-gray-150 dark:border-gray-700 flex flex-col items-center justify-center ${
                      isTodayDay ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
                    }`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {d.toLocaleDateString('default', { weekday: 'short' })}
                      </span>
                      <span className={`text-base font-bold h-7 w-7 flex items-center justify-center rounded-full mt-0.5 ${
                        isTodayDay ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {d.getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Time Grid Layout */}
              <div className="flex-1 grid grid-cols-8 overflow-y-auto max-h-[500px]">
                {/* Hour Labels */}
                <div className="flex flex-col text-right pr-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 border-r border-gray-150 dark:border-gray-700">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="h-16 flex items-start justify-end pt-1 pr-1 border-b border-gray-100/50 dark:border-gray-700/30">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </div>
                  ))}
                </div>

                {/* Days columns */}
                {getWeekDays().map((day, idx) => {
                  const dayEvents = getEventsForDate(day)
                  return (
                    <div
                      key={idx}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, day)}
                      onDoubleClick={() => openCreateModal(day)}
                      className="relative border-r border-gray-150 dark:border-gray-700 bg-transparent flex flex-col"
                    >
                      {/* Grid background hour lines */}
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <div key={hour} className="h-16 border-b border-gray-100/50 dark:border-gray-700/30 w-full hover:bg-gray-50/20 dark:hover:bg-gray-700/5 transition-colors" />
                      ))}

                      {/* Absoluted events on Week column */}
                      {dayEvents.map(evt => {
                        const theme = getCategoryTheme(evt.category)
                        const [startH, startM] = evt.startTime.split(':').map(Number)
                        const [endH, endM] = evt.endTime.split(':').map(Number)
                        
                        // Compute top and height based on 64px (h-16) per hour
                        const topPosition = (startH * 64) + ((startM / 60) * 64)
                        const durationHrs = (endH - startH) + ((endM - startM) / 60)
                        const height = Math.max(30, durationHrs * 64)

                        return (
                          <div
                            key={evt.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, evt.id)}
                            onClick={(e) => openEditModal(evt, e)}
                            style={{ top: `${topPosition}px`, height: `${height}px` }}
                            className={`absolute left-1 right-1 px-2 py-1.5 rounded-lg border-l-4 cursor-pointer text-xs font-semibold shadow-sm overflow-hidden transition-all hover:brightness-95 dark:hover:brightness-110 flex flex-col justify-between ${theme.bgLight} ${theme.text} ${theme.border}`}
                          >
                            <div>
                              <div className="font-bold truncate text-[10px] leading-tight mb-0.5">{evt.title}</div>
                              {height > 45 && <div className="text-[9px] opacity-80 leading-none">{evt.startTime} - {evt.endTime}</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. DAY VIEW */}
          {view === 'day' && (
            <div className="flex flex-col h-full min-h-[500px]">
              {/* Day Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 text-center flex flex-col items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {currentDate.toLocaleDateString('default', { weekday: 'long' })}
                </span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {currentDate.getDate()}
                </span>
              </div>

              {/* Time grid container */}
              <div className="flex-1 grid grid-cols-8 overflow-y-auto max-h-[500px]">
                {/* Hour labels */}
                <div className="flex flex-col text-right pr-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 border-r border-gray-150 dark:border-gray-700">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="h-16 flex items-start justify-end pt-1 pr-1 border-b border-gray-100/50 dark:border-gray-700/30">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </div>
                  ))}
                </div>

                {/* Day column (spans 7 grid columns) */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, currentDate)}
                  onDoubleClick={() => openCreateModal(currentDate)}
                  className="col-span-7 relative bg-transparent flex flex-col"
                >
                  {/* Grid hour line items */}
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <div key={hour} className="h-16 border-b border-gray-100/50 dark:border-gray-700/30 w-full hover:bg-gray-50/10 dark:hover:bg-gray-700/5 transition-colors" />
                  ))}

                  {/* Absoluted events */}
                  {getEventsForDate(currentDate).map(evt => {
                    const theme = getCategoryTheme(evt.category)
                    const [startH, startM] = evt.startTime.split(':').map(Number)
                    const [endH, endM] = evt.endTime.split(':').map(Number)
                    
                    const topPosition = (startH * 64) + ((startM / 60) * 64)
                    const durationHrs = (endH - startH) + ((endM - startM) / 60)
                    const height = Math.max(30, durationHrs * 64)

                    return (
                      <div
                        key={evt.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, evt.id)}
                        onClick={(e) => openEditModal(evt, e)}
                        style={{ top: `${topPosition}px`, height: `${height}px` }}
                        className={`absolute left-4 right-4 px-3 py-2 rounded-xl border-l-4 cursor-pointer text-xs font-semibold shadow-md overflow-hidden transition-all hover:brightness-95 dark:hover:brightness-110 flex flex-col justify-between ${theme.bgLight} ${theme.text} ${theme.border}`}
                      >
                        <div>
                          <div className="font-bold text-sm leading-tight mb-1">{evt.title}</div>
                          <div className="text-[10px] opacity-80 leading-none flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {evt.startTime} - {evt.endTime}
                          </div>
                        </div>
                        {evt.location && (
                          <div className="text-[9px] opacity-80 flex items-center gap-1 mt-1 font-normal">
                            <MapPin className="h-2.5 w-2.5" />
                            {evt.location}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. AGENDA VIEW */}
          {view === 'agenda' && (
            <div className="p-6 flex flex-col gap-6 max-w-3xl mx-auto">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Upcoming Agenda</span>
              </div>

              {/* Loop to render next 7 days list of events */}
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(currentDate)
                day.setDate(currentDate.getDate() + i)
                const dayEvents = getEventsForDate(day)

                if (dayEvents.length === 0) return null

                return (
                  <div key={i} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                    {/* Date label */}
                    <div className="w-full md:w-32 flex-shrink-0 flex md:flex-col items-baseline md:items-start gap-2 md:gap-0">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {day.toLocaleDateString('default', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {day.toLocaleDateString('default', { weekday: 'long' })}
                      </span>
                    </div>

                    {/* Events detailed list */}
                    <div className="flex-1 flex flex-col gap-3">
                      {dayEvents.map(evt => {
                        const theme = getCategoryTheme(evt.category)
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => openEditModal(evt, e)}
                            className="bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 border border-gray-200/50 dark:border-gray-700 p-4 rounded-2xl cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                          >
                            <div className="flex flex-col gap-1.5">
                              <h3 className="text-base font-bold text-gray-800 dark:text-white leading-tight">
                                {evt.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {evt.startTime} - {evt.endTime}
                                </span>
                                {evt.location && (
                                  <span className="flex items-center gap-1 border-l pl-3 border-gray-300 dark:border-gray-600">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {evt.location}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                              {evt.category}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Empty state fallback */}
              {Array.from({ length: 7 }).every((_, i) => {
                const day = new Date(currentDate)
                day.setDate(currentDate.getDate() + i)
                return getEventsForDate(day).length === 0
              }) && (
                <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
                  <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No events scheduled for the next 7 days.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE & EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="h-5 w-5 text-indigo-600" /> : <Tag className="h-5 w-5 text-indigo-600" />}
                <span>{modalMode === 'create' ? 'Create Event' : 'Edit Event'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEvent} className="p-6 flex flex-col gap-4">
              
              {/* Event Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Event Title</label>
                <input 
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g. SyncSphere Retro Meeting"
                  required
                />
              </div>

              {/* Date & Category side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</label>
                  <input 
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Start Time</label>
                  <input 
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">End Time</label>
                  <input 
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Conference room or Zoom"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    placeholder="Event details, notes, etc."
                  />
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-between gap-3 mt-4 border-t border-gray-100 dark:border-gray-700 pt-5">
                {modalMode === 'edit' ? (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl font-bold flex items-center gap-2 transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/10 transition-colors text-sm"
                  >
                    {modalMode === 'create' ? 'Add Event' : 'Save Changes'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default CalendarPage

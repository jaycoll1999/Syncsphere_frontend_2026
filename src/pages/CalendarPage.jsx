import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Calendar as CalendarIcon, X, Clock, Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

const CalendarPage = () => {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const currentYear = today.getFullYear();
  const initialHolidays = [
    { id: 'h1', title: "New Year's Day", date: `${currentYear}-01-01`, startTime: '00:00', endTime: '23:59', color: 'bg-amber-500' },
    { id: 'h2', title: "Makar Sankranti / Pongal", date: `${currentYear}-01-14`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h3', title: "Republic Day", date: `${currentYear}-01-26`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h4', title: "Holi", date: `${currentYear}-03-03`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h5', title: "Maha Shivratri", date: `${currentYear}-03-17`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h6', title: "Good Friday", date: `${currentYear}-04-03`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h7', title: "Ambedkar Jayanti", date: `${currentYear}-04-14`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h8', title: "Eid al-Fitr", date: `${currentYear}-04-20`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h9', title: "May Day / Labor Day", date: `${currentYear}-05-01`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h10', title: "Independence Day", date: `${currentYear}-08-15`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h11', title: "Raksha Bandhan", date: `${currentYear}-08-28`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h12', title: "Ganesh Chaturthi", date: `${currentYear}-09-14`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h13', title: "Gandhi Jayanti", date: `${currentYear}-10-02`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h14', title: "Dussehra", date: `${currentYear}-10-20`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h15', title: "Diwali / Deepavali", date: `${currentYear}-11-08`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h16', title: "Guru Nanak Jayanti", date: `${currentYear}-11-25`, startTime: '09:00', endTime: '18:00', color: 'bg-amber-500' },
    { id: 'h17', title: "Christmas Day", date: `${currentYear}-12-25`, startTime: '00:00', endTime: '23:59', color: 'bg-amber-500' },
  ];

  // Mock Events State (now includes startTime and endTime)
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Sync', date: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', color: 'bg-blue-500' },
    { id: 2, title: 'Project Deadline', date: new Date(today.getFullYear(), today.getMonth(), 22).toISOString().split('T')[0], startTime: '15:00', endTime: '16:00', color: 'bg-red-500' },
    { id: 3, title: 'Client Meeting', date: new Date(today.getFullYear(), today.getMonth(), 8).toISOString().split('T')[0], startTime: '13:30', endTime: '14:30', color: 'bg-emerald-500' },
    ...initialHolidays
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); // null means creating new
  const [selectedDate, setSelectedDate] = useState(null); // String 'YYYY-MM-DD'
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  const [eventColor, setEventColor] = useState('bg-indigo-500');

  const colorOptions = [
    { name: 'Indigo', value: 'bg-indigo-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Emerald', value: 'bg-emerald-500' },
    { name: 'Amber', value: 'bg-amber-500' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Purple', value: 'bg-purple-500' },
  ];

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Date formatting helpers
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create calendar grid arrays
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
    return {
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      isCurrentMonth: false,
      dateString: new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + i + 1).toISOString().split('T')[0]
    };
  });

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const m = month + 1;
    const dateString = `${year}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    
    return {
      day: d,
      isCurrentMonth: true,
      isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      dateString
    };
  });

  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => {
    return {
      day: i + 1,
      isCurrentMonth: false,
      dateString: new Date(year, month + 1, i + 1).toISOString().split('T')[0]
    };
  });

  const calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  // Helper to format 24h time to 12h time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  // Event handlers
  const handleDayClick = (dateString) => {
    setSelectedDate(dateString);
    setSelectedEventId(null);
    setEventTitle('');
    setEventStartTime('09:00');
    setEventEndTime('10:00');
    setEventColor('bg-indigo-500');
    setIsModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation(); // Don't trigger cell click
    setSelectedEventId(event.id);
    setSelectedDate(event.date);
    setEventTitle(event.title);
    setEventStartTime(event.startTime || '09:00');
    setEventEndTime(event.endTime || '10:00');
    setEventColor(event.color);
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedDate(null);
    setEventTitle('');
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (eventStartTime >= eventEndTime) {
      toast.error('End time must be after start time');
      return;
    }

    if (selectedEventId) {
      // Edit existing event
      setEvents(events.map(ev => 
        ev.id === selectedEventId 
          ? { ...ev, title: eventTitle, date: selectedDate, startTime: eventStartTime, endTime: eventEndTime, color: eventColor } 
          : ev
      ));
      toast.success('Event updated successfully!');
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        date: selectedDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        color: eventColor
      };
      setEvents([...events, newEvent]);
      toast.success('Event added successfully!');
    }
    
    closeEventModal();
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    setEvents(events.filter(ev => ev.id !== selectedEventId));
    toast.success('Event deleted!');
    closeEventModal();
  };

  const TimeSelector = ({ value, onChange }) => {
    const [h, m] = value ? value.split(':') : ['09', '00'];
    let hour24 = parseInt(h, 10);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;

    const updateTime = (newH12, newM, newAmpm) => {
      let h24 = parseInt(newH12, 10);
      if (newAmpm === 'PM' && h24 !== 12) h24 += 12;
      if (newAmpm === 'AM' && h24 === 12) h24 = 0;
      onChange(`${h24.toString().padStart(2, '0')}:${newM}`);
    };

    return (
      <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg p-1.5 shadow-inner">
        <select 
          value={hour12} 
          onChange={(e) => updateTime(e.target.value, m, ampm)}
          className="bg-transparent text-gray-900 dark:text-white focus:outline-none appearance-none cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 rounded px-1.5 py-0.5 text-center"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
            <option key={hour} value={hour} className="bg-white dark:bg-[#111827]">{hour}</option>
          ))}
        </select>
        <span className="font-bold pb-0.5">:</span>
        <select 
          value={m} 
          onChange={(e) => updateTime(hour12, e.target.value, ampm)}
          className="bg-transparent text-gray-900 dark:text-white focus:outline-none appearance-none cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 rounded px-1.5 py-0.5 text-center"
        >
          <option value="00" className="bg-white dark:bg-[#111827]">00</option>
          <option value="15" className="bg-white dark:bg-[#111827]">15</option>
          <option value="30" className="bg-white dark:bg-[#111827]">30</option>
          <option value="45" className="bg-white dark:bg-[#111827]">45</option>
        </select>
        <select 
          value={ampm} 
          onChange={(e) => updateTime(hour12, m, e.target.value)}
          className="bg-transparent text-indigo-600 dark:text-indigo-400 focus:outline-none appearance-none cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 rounded px-1.5 py-0.5 font-bold ml-1"
        >
          <option value="AM" className="bg-white dark:bg-[#111827]">AM</option>
          <option value="PM" className="bg-white dark:bg-[#111827]">PM</option>
        </select>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-indigo-500" />
              Calendar
            </h1>
            <button 
              onClick={goToToday}
              className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-normal ml-2">
              {monthNames[month]} {year}
            </h2>
          </div>
          
          <button 
            onClick={() => handleDayClick(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            {daysOfWeek.map((day, idx) => (
              <div 
                key={day} 
                className={`py-3 text-center text-xs font-bold uppercase tracking-wider border-r last:border-r-0
                  ${idx === 0 
                    ? 'text-red-500 border-red-200 dark:border-red-500/20' 
                    : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
                  }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-auto">
            {calendarDays.map((dateObj, i) => {
              // Get events for this day and sort them by start time
              const dayEvents = events
                .filter(e => e.date === dateObj.dateString)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              
              return (
                <div 
                  key={i} 
                  onClick={() => handleDayClick(dateObj.dateString)}
                  className={`min-h-[100px] border-b border-r p-1 sm:p-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5 relative group
                    ${i % 7 === 0 
                      ? 'border-red-200 dark:border-red-500/20 bg-red-500/[0.01] dark:bg-red-500/[0.02]' 
                      : 'border-gray-200 dark:border-white/10'
                    }
                    ${!dateObj.isCurrentMonth ? 'bg-gray-50/50 dark:bg-[#0B0F19]/50 text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                      dateObj.isToday 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                        : i % 7 === 0
                          ? 'text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-500/10 transition-colors'
                          : 'group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors'
                    }`}>
                      {dateObj.day}
                    </span>
                  </div>
                  
                  {/* Events Container */}
                  <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={(e) => handleEventClick(e, event)}
                        className={`text-xs px-1.5 py-1 rounded text-white ${event.color} shadow-sm transition-transform hover:scale-[1.02] cursor-pointer flex flex-col`}
                        title={`${event.title} (${formatTime(event.startTime)} - ${formatTime(event.endTime)})`}
                      >
                        <span className="font-semibold truncate">{event.title}</span>
                        <span className="text-[10px] opacity-90 truncate">{formatTime(event.startTime)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeEventModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEventId ? 'Edit Event' : 'Add Event'}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedEventId && (
                    <button 
                      onClick={handleDeleteEvent}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={closeEventModal}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSaveEvent} className="p-5 space-y-5">
                <div>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border-none text-xl font-medium rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <Clock className="w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <TimeSelector 
                        value={eventStartTime}
                        onChange={setEventStartTime}
                      />
                      <span className="text-gray-400 font-medium px-2">to</span>
                      <TimeSelector 
                        value={eventEndTime}
                        onChange={setEventEndTime}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Color</label>
                  <div className="flex items-center gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEventColor(color.value)}
                        className={`w-8 h-8 rounded-full ${color.value} ${eventColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-[#111827]' : ''} transition-all`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeEventModal}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
                  >
                    {selectedEventId ? 'Save Changes' : 'Save Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;

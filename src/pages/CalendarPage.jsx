import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { useEventsStore } from '../store/eventsStore';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Calendar as CalendarIcon, X, Clock, Trash2,
  ChevronDown
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

  // Events State (initialized with holidays)
  const [events, setEvents] = useState([...initialHolidays]);

  useEffect(() => {
    const fetchBackendEvents = async () => {
      try {
        const response = await axiosInstance.get('/events/');
        const backendEvents = response.data || [];
        
        const mappedBackendEvents = backendEvents.map(ev => {
          const dateStr = ev.start_datetime.split('T')[0];
          const startTime = ev.start_datetime.split('T')[1]?.substring(0, 5) || '09:00';
          const endDt = ev.end_datetime ? ev.end_datetime : new Date(new Date(ev.start_datetime).getTime() + 3600000).toISOString();
          const endTime = endDt.split('T')[1]?.substring(0, 5) || '10:00';
          
          const color = ev.priority === 'URGENT' ? 'bg-red-500' :
                        ev.priority === 'HIGH' ? 'bg-orange-500' :
                        ev.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';

          return {
            id: ev.id,
            uuid: ev.uuid,
            title: ev.title,
            description: ev.description,
            event_type: ev.event_type,
            status: ev.status,
            priority: ev.priority,
            start_datetime: ev.start_datetime,
            timezone: ev.timezone,
            all_day: !!ev.all_day,
            location: ev.location,
            max_attendees: ev.max_attendees,
            is_public: !!ev.is_public,
            requires_registration: !!ev.requires_registration,
            reminder_enabled: !!ev.reminder_enabled,
            date: dateStr,
            startTime: startTime,
            endTime: endTime,
            color: color
          };
        });

        setEvents([...initialHolidays, ...mappedBackendEvents]);
      } catch (err) {
        console.error('Failed to fetch events in CalendarPage:', err);
      }
    };

    fetchBackendEvents();
  }, []);

  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { addLocalEvent } = useEventsStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null); // null means creating new
  const [selectedDate, setSelectedDate] = useState(null); // String 'YYYY-MM-DD'
  
  const isReadOnly = currentUser?.role === 'INTERN' && selectedEventId !== null;
  
  // 13 Fields Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('MEETING');
  const [eventStatus, setEventStatus] = useState('DRAFT');
  const [eventPriority, setEventPriority] = useState('MEDIUM');
  const [eventStartDatetime, setEventStartDatetime] = useState('');
  const [eventTimezone, setEventTimezone] = useState('Asia/Kolkata');
  const [eventAllDay, setEventAllDay] = useState(false);
  const [eventLocation, setEventLocation] = useState('');
  const [eventMaxAttendees, setEventMaxAttendees] = useState('');
  const [eventIsPublic, setEventIsPublic] = useState(false);
  const [eventRequiresRegistration, setEventRequiresRegistration] = useState(false);
  const [eventReminder, setEventReminder] = useState(true);

  // Field-level validation error highlights
  const [formErrors, setFormErrors] = useState({});

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
    setEventDescription('');
    setEventType('MEETING');
    setEventStatus('DRAFT');
    setEventPriority('MEDIUM');
    setEventStartDatetime(`${dateString}T09:00`);
    setEventTimezone('Asia/Kolkata');
    setEventAllDay(false);
    setEventLocation('');
    setEventMaxAttendees('');
    setEventIsPublic(false);
    setEventRequiresRegistration(false);
    setEventReminder(true);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation(); // Don't trigger cell click
    setSelectedEventId(event.id);
    setSelectedDate(event.date || (event.start_datetime ? event.start_datetime.split('T')[0] : ''));
    setEventTitle(event.title || '');
    setEventDescription(event.description || '');
    setEventType(event.event_type || 'MEETING');
    setEventStatus(event.status || 'PUBLISHED');
    setEventPriority(event.priority || 'MEDIUM');
    setEventStartDatetime(event.start_datetime ? event.start_datetime.substring(0, 16) : `${event.date}T${event.startTime || '09:00'}`);
    setEventTimezone(event.timezone || 'Asia/Kolkata');
    setEventAllDay(!!event.all_day);
    setEventLocation(event.location || '');
    setEventMaxAttendees(event.max_attendees || '');
    setEventIsPublic(!!event.is_public);
    setEventRequiresRegistration(!!event.requires_registration);
    setEventReminder(event.reminder_enabled !== undefined ? !!event.reminder_enabled : true);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
    setSelectedDate(null);
    setFormErrors({});
  };

  const getIsoStringWithOffset = (localDtString, tzString) => {
    if (!localDtString) return "";
    const tzOffsets = {
      "UTC": "+00:00",
      "Asia/Kolkata": "+05:30",
      "America/New_York": "-04:00",
      "Europe/London": "+01:00",
      "Asia/Dubai": "+04:00"
    };
    const offset = tzOffsets[tzString] || "+00:00";
    return `${localDtString}:00${offset}`;
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    
    // Front-end validations
    const errors = {};
    if (!eventTitle.trim()) errors.title = "Title is required";
    if (!eventType) errors.event_type = "Event type is required";
    if (!eventStatus) errors.status = "Status is required";
    if (!eventPriority) errors.priority = "Priority is required";
    if (!eventStartDatetime) errors.start_datetime = "Start Date & Time is required";
    if (!eventTimezone) errors.timezone = "Timezone is required";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: eventTitle.trim(),
      description: eventDescription.trim() || null,
      event_type: eventType,
      status: eventStatus,
      priority: eventPriority,
      start_datetime: getIsoStringWithOffset(eventStartDatetime, eventTimezone),
      timezone: eventTimezone,
      all_day: eventAllDay,
      location: eventLocation.trim() || null,
      max_attendees: eventMaxAttendees ? parseInt(eventMaxAttendees, 10) : null,
      is_public: eventIsPublic,
      requires_registration: eventRequiresRegistration,
      reminder_enabled: eventReminder
    };

    try {
      if (selectedEventId) {
        // Edit existing local event
        setEvents(events.map(ev => 
          ev.id === selectedEventId 
            ? { 
                ...ev, 
                ...payload, 
                date: eventStartDatetime.split('T')[0],
                startTime: eventStartDatetime.split('T')[1]?.substring(0, 5) || '00:00',
                color: payload.priority === 'URGENT' ? 'bg-red-500' :
                       payload.priority === 'HIGH' ? 'bg-orange-500' :
                       payload.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
              } 
            : ev
        ));
        toast.success("Event updated successfully!");
      } else {
        // Create new event via API call
        try {
          const response = await axiosInstance.post('/events/', payload);
          if (response.status === 201 || response.status === 200) {
            toast.success("Event created successfully!");
            const newLocalEvent = {
              id: response.data.id || Date.now(),
              ...payload,
              date: eventStartDatetime.split('T')[0],
              startTime: eventStartDatetime.split('T')[1]?.substring(0, 5) || '09:00',
              endTime: '23:59',
              color: payload.priority === 'URGENT' ? 'bg-red-500' :
                     payload.priority === 'HIGH' ? 'bg-orange-500' :
                     payload.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
            };
            setEvents([...events, newLocalEvent]);
          }
        } catch (apiError) {
          if (apiError.response?.status === 403) {
            const newLocalEvent = {
              id: Date.now(),
              ...payload,
              date: eventStartDatetime.split('T')[0],
              startTime: eventStartDatetime.split('T')[1]?.substring(0, 5) || '09:00',
              endTime: '23:59',
              color: payload.priority === 'URGENT' ? 'bg-red-500' :
                     payload.priority === 'HIGH' ? 'bg-orange-500' :
                     payload.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500',
              createdByUser: currentUser
            };
            setEvents([...events, newLocalEvent]);
            // Also persist to local store so EventsPage can display this event
            addLocalEvent(newLocalEvent);
            toast.info("Event saved locally (your role is read-only on the backend).");
          } else {
            throw apiError;
          }
        }
      }
      closeEventModal();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          toast.error("Session expired. Redirecting to login...");
          navigate('/login');
        } else if (status === 422) {
          const apiErrors = {};
          const details = error.response.data?.detail;
          if (Array.isArray(details)) {
            details.forEach(err => {
              const fieldName = err.loc[err.loc.length - 1];
              apiErrors[fieldName] = err.msg;
            });
          }
          setFormErrors(apiErrors);
          toast.error("Please fix validation errors in the form.");
        } else if (status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error(error.response.data?.message || "Failed to save event");
        }
      } else {
        toast.error("Failed to connect to server");
      }
    }
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    setEvents(events.filter(ev => ev.id !== selectedEventId));
    toast.success("Event deleted!");
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
              className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col my-8 max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 shrink-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-500" />
                  {selectedEventId ? (isReadOnly ? 'View Event Details' : 'Edit Event Details') : 'Create New Event'}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedEventId && !isReadOnly && (
                    <button 
                      type="button"
                      onClick={handleDeleteEvent}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete Event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={closeEventModal}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Modal Body */}
              <form onSubmit={handleSaveEvent} className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Row 1: Title (Full width) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={eventTitle}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        setEventTitle(e.target.value);
                        if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                      }}
                      placeholder="e.g. Team Sync – Weekly Standup"
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        formErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
                      }`}
                    />
                    {formErrors.title && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.title}</p>}
                  </div>

                  {/* Row 2: Event Type | Status */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Event Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={eventType}
                        disabled={isReadOnly}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer"
                      >
                        <option value="MEETING" className="bg-[#111827] text-white">Meeting</option>
                        <option value="HOLIDAY" className="bg-[#111827] text-white">Holiday</option>
                        <option value="TRAINING" className="bg-[#111827] text-white">Training</option>
                        <option value="CONFERENCE" className="bg-[#111827] text-white">Conference</option>
                        <option value="WORKSHOP" className="bg-[#111827] text-white">Workshop</option>
                        <option value="SOCIAL" className="bg-[#111827] text-white">Social</option>
                        <option value="OTHER" className="bg-[#111827] text-white">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={eventStatus}
                        disabled={isReadOnly}
                        onChange={(e) => setEventStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer"
                      >
                        <option value="DRAFT" className="bg-[#111827] text-white">Draft</option>
                        <option value="PUBLISHED" className="bg-[#111827] text-white">Published</option>
                        <option value="CANCELLED" className="bg-[#111827] text-white">Cancelled</option>
                        <option value="COMPLETED" className="bg-[#111827] text-white">Completed</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Priority | Timezone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Priority <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={eventPriority}
                        disabled={isReadOnly}
                        onChange={(e) => setEventPriority(e.target.value)}
                        className="w-full pl-9 pr-10 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer font-medium"
                      >
                        <option value="LOW" className="bg-[#111827] text-white">Low</option>
                        <option value="MEDIUM" className="bg-[#111827] text-white">Medium</option>
                        <option value="HIGH" className="bg-[#111827] text-white">High</option>
                        <option value="URGENT" className="bg-[#111827] text-white">Urgent</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#111827] ${
                          eventPriority === 'LOW' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' :
                          eventPriority === 'MEDIUM' ? 'bg-amber-500 shadow-sm shadow-amber-500/50' :
                          eventPriority === 'HIGH' ? 'bg-orange-500 shadow-sm shadow-orange-500/50' :
                          'bg-red-500 shadow-sm shadow-red-500/50'
                        }`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Timezone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={eventTimezone}
                        disabled={isReadOnly}
                        onChange={(e) => setEventTimezone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none cursor-pointer"
                      >
                        <option value="Asia/Kolkata" className="bg-[#111827] text-white">Asia/Kolkata</option>
                        <option value="UTC" className="bg-[#111827] text-white">UTC</option>
                        <option value="America/New_York" className="bg-[#111827] text-white">America/New_York</option>
                        <option value="Europe/London" className="bg-[#111827] text-white">Europe/London</option>
                        <option value="Asia/Dubai" className="bg-[#111827] text-white">Asia/Dubai</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Start DateTime | All Day Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Start Date & Time <span className="text-red-500">*</span></label>
                    {eventAllDay ? (
                      <input
                        type="date"
                        value={eventStartDatetime ? eventStartDatetime.split('T')[0] : ''}
                        disabled={isReadOnly}
                        onChange={(e) => {
                          setEventStartDatetime(`${e.target.value}T00:00`);
                          if (formErrors.start_datetime) setFormErrors({ ...formErrors, start_datetime: null });
                        }}
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0B0F19] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          formErrors.start_datetime ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
                        }`}
                      />
                    ) : (
                      <input
                        type="datetime-local"
                        value={eventStartDatetime}
                        disabled={isReadOnly}
                        onChange={(e) => {
                          setEventStartDatetime(e.target.value);
                          if (formErrors.start_datetime) setFormErrors({ ...formErrors, start_datetime: null });
                        }}
                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0B0F19] border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          formErrors.start_datetime ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
                        }`}
                      />
                    )}
                    {formErrors.start_datetime && <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.start_datetime}</p>}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl h-full self-end">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">All Day</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Hide hours and set event to full day</span>
                    </div>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => !isReadOnly && setEventAllDay(!eventAllDay)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } ${
                        eventAllDay ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          eventAllDay ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 5: Location (Full width) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      value={eventLocation}
                      disabled={isReadOnly}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g. Conference Room A, Zoom link, etc."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  {/* Row 6: Max Attendees | Is Public Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Max Attendees</label>
                    <input
                      type="number"
                      min="1"
                      value={eventMaxAttendees}
                      disabled={isReadOnly}
                      onChange={(e) => setEventMaxAttendees(e.target.value)}
                      placeholder="e.g. 20 (leave blank for unlimited)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Make this event public</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Allow guests outside the workspace to view</span>
                    </div>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => !isReadOnly && setEventIsPublic(!eventIsPublic)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } ${
                        eventIsPublic ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          eventIsPublic ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 7: Requires Registration toggle | Reminder toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Require attendee registration</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Attendees must sign up to join</span>
                    </div>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => !isReadOnly && setEventRequiresRegistration(!eventRequiresRegistration)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } ${
                        eventRequiresRegistration ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          eventRequiresRegistration ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enable reminder notification</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Alert attendees prior to standard start</span>
                    </div>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => !isReadOnly && setEventReminder(!eventReminder)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } ${
                        eventReminder ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          eventReminder ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 8: Description (Full width textarea) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows="4"
                      value={eventDescription}
                      disabled={isReadOnly}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Add a brief description..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                    />
                  </div>

                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={closeEventModal}
                    className="px-5 py-3 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
                  >
                    {isReadOnly ? 'Close' : 'Cancel'}
                  </button>
                  {!isReadOnly && (
                    <button
                      type="submit"
                      className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {selectedEventId ? 'Save Changes' : 'Create Event'}
                    </button>
                  )}
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, X, Info, MapPin, Palmtree
} from 'lucide-react';

const HolidayCalendarViewPage = () => {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026 as base since user is in May 2026
  const today = new Date();

  // Comprehensive 2026 Holiday Data
  const holidays = [
    { id: 1, title: "New Year's Day", date: '2026-01-01', type: 'Official', color: 'bg-emerald-500', description: "The first day of the new year." },
    { id: 2, title: "Martin Luther King Jr. Day", date: '2026-01-19', type: 'Official', color: 'bg-blue-500', description: "Celebrating the life and achievements of MLK Jr." },
    { id: 3, title: "Valentine's Day", date: '2026-02-14', type: 'Observance', color: 'bg-pink-500', description: "Feast of Saint Valentine." },
    { id: 4, title: "Presidents' Day", date: '2026-02-16', type: 'Official', color: 'bg-blue-500', description: "Honoring all persons who served as US presidents." },
    { id: 5, title: "St. Patrick's Day", date: '2026-03-17', type: 'Observance', color: 'bg-green-600', description: "Feast day of Saint Patrick." },
    { id: 6, title: "Easter Sunday", date: '2026-04-05', type: 'Observance', color: 'bg-purple-500', description: "Christian festival and holiday." },
    { id: 7, title: "Earth Day", date: '2026-04-22', type: 'Observance', color: 'bg-emerald-600', description: "Support for environmental protection." },
    { id: 8, title: "Cinco de Mayo", date: '2026-05-05', type: 'Observance', color: 'bg-orange-500', description: "Celebration of Mexican heritage." },
    { id: 9, title: "Mother's Day", date: '2026-05-10', type: 'Observance', color: 'bg-pink-400', description: "Honoring mothers and motherhood." },
    { id: 10, title: "Memorial Day", date: '2026-05-25', type: 'Official', color: 'bg-blue-500', description: "Honoring military personnel who died in service." },
    { id: 11, title: "Juneteenth", date: '2026-06-19', type: 'Official', color: 'bg-red-500', description: "Emancipation of enslaved African Americans." },
    { id: 12, title: "Father's Day", date: '2026-06-21', type: 'Observance', color: 'bg-blue-400', description: "Honoring fathers and fatherhood." },
    { id: 13, title: "Independence Day", date: '2026-07-04', type: 'Official', color: 'bg-red-600', description: "Declaration of Independence." },
    { id: 14, title: "Labor Day", date: '2026-09-07', type: 'Official', color: 'bg-blue-500', description: "Honoring the American labor movement." },
    { id: 15, title: "Halloween", date: '2026-10-31', type: 'Observance', color: 'bg-orange-600', description: "Eve of the Western Christian feast of All Hallows' Day." },
    { id: 16, title: "Veterans Day", date: '2026-11-11', type: 'Official', color: 'bg-blue-500', description: "Honoring military veterans." },
    { id: 17, title: "Thanksgiving Day", date: '2026-11-26', type: 'Official', color: 'bg-amber-600', description: "Day of giving thanks." },
    { id: 18, title: "Christmas Eve", date: '2026-12-24', type: 'Observance', color: 'bg-red-500', description: "Day before Christmas." },
    { id: 19, title: "Christmas Day", date: '2026-12-25', type: 'Official', color: 'bg-emerald-600', description: "Christian holiday celebrating the birth of Jesus." },
    { id: 20, title: "New Year's Eve", date: '2026-12-31', type: 'Observance', color: 'bg-indigo-500', description: "Last day of the year." }
  ];

  // Modal State
  const [selectedHoliday, setSelectedHoliday] = useState(null);

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
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create calendar grid arrays
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
    const d = daysInPrevMonth - firstDayOfMonth + i + 1;
    let prevMonthNum = month;
    let prevYear = year;
    if (prevMonthNum === 0) { prevMonthNum = 12; prevYear -= 1; }
    const dateString = `${prevYear}-${prevMonthNum.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    return { day: d, isCurrentMonth: false, dateString };
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
    const d = i + 1;
    let nextMonthNum = month + 2;
    let nextYear = year;
    if (nextMonthNum === 13) { nextMonthNum = 1; nextYear += 1; }
    const dateString = `${nextYear}-${nextMonthNum.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    return { day: d, isCurrentMonth: false, dateString };
  });

  const calendarDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Palmtree className="w-7 h-7 text-emerald-500" />
              National Holidays
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
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Official
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span> Observance
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-white/10 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-auto">
            {calendarDays.map((dateObj, i) => {
              const dayHolidays = holidays.filter(h => h.date === dateObj.dateString);
              
              return (
                <div 
                  key={i} 
                  className={`min-h-[100px] border-b border-r border-gray-200 dark:border-white/10 last:border-r-0 p-1 sm:p-2 transition-colors relative
                    ${!dateObj.isCurrentMonth ? 'bg-gray-50/50 dark:bg-[#0B0F19]/50 text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium ${
                      dateObj.isToday 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : ''
                    }`}>
                      {dateObj.day}
                    </span>
                  </div>
                  
                  {/* Holidays Container */}
                  <div className="mt-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
                    {dayHolidays.map(holiday => (
                      <div 
                        key={holiday.id}
                        onClick={() => setSelectedHoliday(holiday)}
                        className={`text-xs px-2 py-1.5 rounded truncate text-white ${holiday.color} shadow-sm transition-transform hover:scale-[1.02] cursor-pointer font-medium flex items-center gap-1.5`}
                      >
                        <Palmtree className="w-3 h-3 shrink-0 opacity-80" />
                        <span className="truncate">{holiday.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holiday Info Modal */}
      <AnimatePresence>
        {selectedHoliday && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedHoliday(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className={`h-24 ${selectedHoliday.color} flex items-center justify-center relative`}>
                <Palmtree className="w-12 h-12 text-white/50 absolute" />
                <button 
                  onClick={() => setSelectedHoliday(null)}
                  className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 -mt-8 relative z-10">
                <div className="bg-white dark:bg-[#0B0F19] rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-white/10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedHoliday.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <CalendarIcon className="w-4 h-4" />
                    {selectedHoliday.date}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">About this holiday</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedHoliday.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Holiday Type</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/10">
                        {selectedHoliday.type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10">
                  <button
                    onClick={() => setSelectedHoliday(null)}
                    className="w-full py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
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

export default HolidayCalendarViewPage;

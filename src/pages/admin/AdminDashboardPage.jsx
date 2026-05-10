import React from 'react';
import { Calendar, Users, Clock, AlertCircle, CheckCircle, XCircle, ChevronRight, Plus, CalendarDays, Gift, TrendingUp, Activity, UserCheck, FileText } from 'lucide-react';
import Button from '../../components/shared/Button';

const AdminDashboardPage = () => {
  const summaryCards = [
    {
      title: 'Total Events',
      value: '156',
      change: '+12%',
      icon: Calendar,
      color: 'bg-blue-500',
      button: 'Full Calendar',
      hasChart: true,
      trend: 'up'
    },
    {
      title: 'Total Employees',
      value: '48',
      change: '+2 new',
      icon: Users,
      color: 'bg-green-500',
      button: null,
      hasChart: false,
      trend: 'up'
    },
    {
      title: 'Active Leave Requests',
      value: '8',
      change: '3 urgent',
      icon: Clock,
      color: 'bg-orange-500',
      button: null,
      hasChart: false,
      trend: 'stable'
    },
    {
      title: 'Upcoming Events Today',
      value: '3',
      change: 'Clickable list preview',
      icon: CalendarDays,
      color: 'bg-purple-500',
      button: null,
      hasChart: false,
      trend: 'up'
    }
  ];

  const upcomingEvents = [
    { date: '2025-05-12', name: 'Team Meeting', organizer: 'John Doe', type: 'Meeting', status: 'Confirmed', time: '10:00 AM' },
    { date: '2025-05-13', name: 'Project Deadline', organizer: 'Jane Smith', type: 'Deadline', status: 'Pending', time: '11:59 PM' },
    { date: '2025-05-14', name: 'Company Lunch', organizer: 'HR Team', type: 'Social', status: 'Confirmed', time: '12:30 PM' },
    { date: '2025-05-15', name: 'Training Session', organizer: 'Training Dept', type: 'Training', status: 'Scheduled', time: '2:00 PM' },
    { date: '2025-05-16', name: 'Board Meeting', organizer: 'CEO', type: 'Meeting', status: 'Confirmed', time: '3:00 PM' },
    { date: '2025-05-17', name: 'Client Presentation', organizer: 'Sales Team', type: 'Business', status: 'Confirmed', time: '4:00 PM' },
    { date: '2025-05-18', name: 'Team Building', organizer: 'HR Team', type: 'Social', status: 'Scheduled', time: '10:00 AM' }
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'Alice Johnson', time: '2 minutes ago', type: 'success', details: 'Employee ID: EMP048' },
    { action: 'Leave request submitted', user: 'Bob Wilson', time: '5 minutes ago', type: 'info', details: 'Sick Leave - 2 days' },
    { action: 'Event created', user: 'Carol Davis', time: '10 minutes ago', type: 'success', details: 'Q2 Planning Meeting' },
    { action: 'System backup completed', user: 'System', time: '15 minutes ago', type: 'success', details: 'Backup successful' },
    { action: 'Failed login attempt', user: 'Unknown', time: '20 minutes ago', type: 'error', details: 'IP: 192.168.1.100' },
    { action: 'Profile updated', user: 'David Brown', time: '25 minutes ago', type: 'info', details: 'Contact information changed' },
    { action: 'Holiday approved', user: 'Admin', time: '30 minutes ago', type: 'success', details: 'Christmas Holiday' },
    { action: 'Report generated', user: 'System', time: '35 minutes ago', type: 'success', details: 'Monthly attendance report' }
  ];

  const systemNotifications = [
    { message: 'Database backup failed', type: 'error', time: '1 hour ago', priority: 'high' },
    { message: 'New admin feature available', type: 'info', time: '2 hours ago', priority: 'medium' },
    { message: 'Oldest pending leave request: 3 days', type: 'warning', time: '3 hours ago', priority: 'high' },
    { message: 'Server maintenance scheduled', type: 'info', time: '4 hours ago', priority: 'low' },
    { message: 'Security update required', type: 'warning', time: '5 hours ago', priority: 'medium' }
  ];

  const quickActions = [
    { label: 'Create New Event', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700', description: 'Schedule new company event' },
    { label: 'Approve Leave Requests', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', description: 'Review pending requests' },
    { label: 'Add New Holiday', icon: Gift, color: 'bg-purple-600 hover:bg-purple-700', description: 'Add company holiday' },
    { label: 'Generate Reports', icon: FileText, color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Export system reports' },
    { label: 'User Management', icon: UserCheck, color: 'bg-teal-600 hover:bg-teal-700', description: 'Manage user accounts' },
    { label: 'System Health', icon: Activity, color: 'bg-red-600 hover:bg-red-700', description: 'Check system status' }
  ];

  const todayEvents = [
    { time: '9:00 AM', title: 'Daily Standup', organizer: 'Dev Team', type: 'Meeting' },
    { time: '11:00 AM', title: 'Client Call', organizer: 'Sales Team', type: 'Business' },
    { time: '2:00 PM', title: 'Code Review', organizer: 'Tech Lead', type: 'Technical' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening in your organization today.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Just now</span>
          <button className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800">
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              {card.hasChart && (
                <div className="h-8 w-16">
                  <svg viewBox="0 0 64 32" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      points="0,28 8,24 16,26 24,20 32,22 40,18 48,16 56,14 64,12"
                    />
                  </svg>
                </div>
              )}
            </div>
            
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</h3>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3">{card.title}</p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs lg:text-sm ${
                card.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                card.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>{card.change}</span>
              {card.button && (
                <button className="text-xs lg:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  {card.button}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Events Quick Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Events</h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {todayEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">{event.time}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{event.organizer}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.type === 'Meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                event.type === 'Business' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              }`}>
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Upcoming Company Events */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Company Events (This Week)</h2>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Event Name</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Organizer</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Type</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-900 dark:text-white">
                        <div>{event.date}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </td>
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-900 dark:text-white font-medium">{event.name}</td>
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">{event.organizer}</td>
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">{event.type}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          event.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent System Activity</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                  activity.type === 'error' ? 'bg-red-100 dark:bg-red-900' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                  {activity.type === 'error' && <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                  {activity.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate">{activity.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{activity.user}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
                  {activity.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{activity.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Quick Action Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Action Panel</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white ${action.color} transition-colors hover:shadow-md`}
              >
                <action.icon className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Notifications</h2>
            <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
              {systemNotifications.filter(n => n.priority === 'high').length} High
            </span>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {systemNotifications.map((notification, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                notification.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                notification.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  notification.type === 'error' ? 'bg-red-100 dark:bg-red-900' :
                  notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {notification.type === 'error' && <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                  {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                  {notification.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                      {notification.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import React from 'react'

const Avatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }

  const name = user?.name || user?.fullName || 'User'
  const initials = getInitials(name)

  if (user?.photoUrl || user?.avatar) {
    return (
      <img
        src={user.photoUrl || user.avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-medium text-indigo-600 dark:text-indigo-400`}>
      {initials}
    </div>
  )
}

export default Avatar

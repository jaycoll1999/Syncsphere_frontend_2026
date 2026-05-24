import React from 'react'

const Avatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  }

  const getInitials = (userObj) => {
    const emailStr = userObj?.email || ''
    if (emailStr) {
      return emailStr[0].toUpperCase()
    }
    const nameStr = userObj?.name || userObj?.fullName || 'U'
    return nameStr[0].toUpperCase()
  }

  const name = user?.name || user?.fullName || 'User'
  const initials = getInitials(user)

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

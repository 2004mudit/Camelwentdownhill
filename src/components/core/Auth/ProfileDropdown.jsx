import React from 'react'
import { Link } from 'react-router-dom'

function ProfileDropdown() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer">
        <img 
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
      </div>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
      </div>
    </div>
  )
}

export default ProfileDropdown

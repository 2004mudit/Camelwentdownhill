import React from 'react';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-richblack-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <Outlet />
    </div>
  );
}

export default Dashboard;

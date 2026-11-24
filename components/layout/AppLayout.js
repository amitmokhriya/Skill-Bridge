'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import ProtectedRoute from './ProtectedRoute';
import ConfigAlert from '../common/ConfigAlert';
import { ToastProvider } from '../common/Toast';

export default function AppLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
            <DashboardHeader
              onMenuClick={() => setSidebarOpen(true)}
              title={title}
              subtitle={subtitle}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              <ConfigAlert />
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ProtectedRoute>
  );
}

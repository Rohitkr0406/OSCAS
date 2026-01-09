import React, { useState } from 'react';
import { User } from '../types';
import { LogOut, GraduationCap, LayoutDashboard, Settings, User as UserIcon, Menu, X, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  onNavigate, 
  currentView,
  darkMode,
  toggleDarkMode
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const NavContent = () => (
    <>
      {user.role === 'ADMIN' && (
        <>
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-indigo-50 dark:bg-neutral-900 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 shadow-sm' 
                : 'text-slate-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleNavigate('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'students' 
                ? 'bg-indigo-50 dark:bg-neutral-900 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 shadow-sm' 
                : 'text-slate-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>Student List</span>
          </button>
          <button
            onClick={() => handleNavigate('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'settings' 
                ? 'bg-indigo-50 dark:bg-neutral-900 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 shadow-sm' 
                : 'text-slate-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Center Capacity</span>
          </button>
        </>
      )}
      {user.role === 'STUDENT' && (
        <>
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-indigo-50 dark:bg-neutral-900 text-indigo-700 dark:text-indigo-400 border-l-4 border-indigo-600 shadow-sm' 
                : 'text-slate-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>My Profile & Status</span>
          </button>
          <div className="mt-8 px-4">
            <h4 className="text-xs font-semibold text-slate-400 dark:text-neutral-600 uppercase tracking-wider mb-2">Help Center</h4>
            <p className="text-sm text-slate-500 dark:text-neutral-500 leading-relaxed">
              Need assistance with your preferences? Contact the admission office at <span className="text-indigo-600 dark:text-indigo-400">support@oscas.edu</span>.
            </p>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black transition-colors duration-300">
      {/* Top Navbar */}
      <header className="bg-indigo-600 dark:bg-black border-b dark:border-neutral-800 text-white shadow-lg dark:shadow-none sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 -ml-2 rounded-md hover:bg-indigo-500 dark:hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <div className="bg-white/10 dark:bg-neutral-900 p-2 rounded-lg hidden sm:block">
                <GraduationCap className="h-6 w-6 text-white dark:text-indigo-500" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white dark:text-white">OSCAS</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
               {/* Dark Mode Toggle */}
               <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-neutral-900 transition-colors text-indigo-100 hover:text-white"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <span className="hidden sm:inline-block text-sm font-medium bg-indigo-700 dark:bg-neutral-900 px-3 py-1 rounded-full border border-indigo-500 dark:border-neutral-800 dark:text-neutral-300">
                {user.role === 'ADMIN' ? 'Administrator' : 'Student Portal'}
              </span>
              <button 
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-neutral-900 transition-colors text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-indigo-500 dark:border-neutral-800 bg-white dark:bg-black shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider md:hidden">
                {user.role === 'ADMIN' ? 'Admin Navigation' : 'Student Navigation'}
              </div>
              <NavContent />
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 gap-6">
        {/* Sidebar Navigation (Contextual based on Role) */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-2">
            <NavContent />
          </nav>
        </aside>

        {/* Content View */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
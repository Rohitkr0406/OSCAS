import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentPortal } from './components/StudentPortal';
import { INITIAL_CENTERS, INITIAL_STUDENTS } from './constants';
import { Student, StudyCenter, User } from './types';
import { runAllocationAlgorithm } from './services/allocationService';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';

const App = () => {
  // --- Global State ---
  // In a real app, this would be in a DB/Backend
  const [centers, setCenters] = useState<StudyCenter[]>(INITIAL_CENTERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // --- Session State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [lastAllocatedTime, setLastAllocatedTime] = useState<Date | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // --- Login Form State ---
  const [loginTab, setLoginTab] = useState<'student' | 'admin'>('student');
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // --- Effects ---
  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // --- Handlers ---
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleRunAllocation = () => {
    const result = runAllocationAlgorithm(students, centers);
    setStudents(result.students);
    setCenters(result.centers);
    setLastAllocatedTime(new Date());
  };

  const handleUpdateCapacity = (centerId: string, newCapacity: number) => {
    setCenters(prev => prev.map(c => 
      c.id === centerId ? { ...c, capacity: newCapacity } : c
    ));
  };

  const handleUpdatePreferences = (studentId: string, preferences: string[]) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, preferences, status: 'SUBMITTED' } : s
    ));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginTab === 'admin') {
      // Mock Admin Auth
      // Simple check for demo purposes
      if (credentials.id === 'admin' && credentials.password === 'admin123') {
        setCurrentUser({ role: 'ADMIN' });
        setCurrentView('dashboard');
        setCredentials({ id: '', password: '' });
      } else {
        setLoginError('Invalid Administrator credentials.');
      }
    } else {
      // Student Auth
      const student = students.find(s => s.id === credentials.id && s.password === credentials.password);
      if (student) {
        setCurrentUser({ role: 'STUDENT', studentId: student.id });
        setCurrentView('dashboard');
        setCredentials({ id: '', password: '' });
      } else {
        setLoginError('Invalid Admission ID or Password.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setLoginTab('student');
    setCredentials({ id: '', password: '' });
  };

  // --- Render ---

  if (!currentUser) {
    // Landing / Login Screen
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 mb-4">
             <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">OSCAS</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
            Online Study Center Allocation System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-black py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-slate-100 dark:border-neutral-800 transition-colors">
            
            {/* Login Tabs */}
            <div className="flex border-b border-slate-200 dark:border-neutral-800 mb-6">
              <button
                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                  loginTab === 'student' 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
                onClick={() => { 
                  setLoginTab('student'); 
                  setLoginError(''); 
                  setCredentials({id: '', password: ''}); 
                }}
              >
                Student Login
              </button>
              <button
                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                  loginTab === 'admin' 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
                onClick={() => { 
                  setLoginTab('admin'); 
                  setLoginError(''); 
                  setCredentials({id: '', password: ''}); 
                }}
              >
                Admin Login
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-slate-700 dark:text-neutral-300">
                  {loginTab === 'student' ? 'Admission ID' : 'Admin Username'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="id"
                    name="id"
                    type="text"
                    autoComplete="username"
                    required
                    value={credentials.id}
                    onChange={handleInputChange}
                    className="block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder-slate-400 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 transition-colors"
                    placeholder={loginTab === 'student' ? "e.g., s1" : "e.g., admin"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-neutral-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 py-2 sm:text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder-slate-400 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 animate-fade-in">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{loginError}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-neutral-500">
             <p className="mb-2 font-semibold">Demo Credentials:</p>
             {loginTab === 'student' ? (
                <p>
                  IDs: <span className="font-mono text-indigo-600 dark:text-indigo-400">s1</span> to <span className="font-mono text-indigo-600 dark:text-indigo-400">s10</span> 
                  <span className="mx-2">|</span> 
                  Pass: <span className="font-mono text-indigo-600 dark:text-indigo-400">password123</span>
                </p>
             ) : (
                <p>
                  User: <span className="font-mono text-indigo-600 dark:text-indigo-400">admin</span> 
                  <span className="mx-2">|</span> 
                  Pass: <span className="font-mono text-indigo-600 dark:text-indigo-400">admin123</span>
                </p>
             )}
          </div>
        </div>
      </div>
    );
  }

  // Authenticated View
  return (
    <HashRouter>
      <Layout 
        user={currentUser} 
        onLogout={logout} 
        onNavigate={setCurrentView}
        currentView={currentView}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {currentUser.role === 'ADMIN' ? (
          <>
            {currentView === 'dashboard' && (
              <AdminDashboard 
                centers={centers}
                students={students}
                onRunAllocation={handleRunAllocation}
                onUpdateCapacity={handleUpdateCapacity}
                lastAllocatedTime={lastAllocatedTime}
                darkMode={darkMode}
              />
            )}
            {currentView === 'students' && (
              <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-slate-200 dark:border-neutral-800 overflow-hidden transition-colors">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Student Registry</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-neutral-800">
                     <thead className="bg-slate-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Merit Rank</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Allocated To</th>
                      </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-black divide-y divide-slate-200 dark:divide-neutral-800">
                      {[...students].sort((a,b) => a.meritRank - b.meritRank).map(s => {
                        const centerName = centers.find(c => c.id === s.allocatedCenterId)?.name || '-';
                        return (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">#{s.meritRank}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-neutral-200">{s.name}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${s.status === 'ALLOCATED' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 
                                  s.status === 'UNALLOCATED' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' : 
                                  s.status === 'SUBMITTED' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-300'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-neutral-400">{centerName}</td>
                          </tr>
                        );
                      })}
                     </tbody>
                  </table>
                </div>
              </div>
            )}
            {currentView === 'settings' && (
              <AdminDashboard 
                centers={centers}
                students={students}
                onRunAllocation={handleRunAllocation}
                onUpdateCapacity={handleUpdateCapacity}
                lastAllocatedTime={lastAllocatedTime}
                darkMode={darkMode}
              />
            )}
          </>
        ) : (
          <StudentPortal 
            student={students.find(s => s.id === currentUser.studentId)!}
            centers={centers}
            onUpdatePreferences={handleUpdatePreferences}
          />
        )}
      </Layout>
    </HashRouter>
  );
};

export default App;
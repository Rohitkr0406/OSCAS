import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Student, StudyCenter } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, CheckCircle, AlertCircle, Play, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  centers: StudyCenter[];
  students: Student[];
  onRunAllocation: () => void;
  onUpdateCapacity: (centerId: string, newCapacity: number) => void;
  lastAllocatedTime: Date | null;
  darkMode: boolean;
}

const COLORS = ['#4f46e5', '#e2e8f0', '#ef4444', '#f59e0b'];
const COLORS_DARK = ['#6366f1', '#404040', '#f87171', '#fbbf24']; // Updated neutral for better visibility

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  centers, 
  students, 
  onRunAllocation, 
  onUpdateCapacity,
  lastAllocatedTime,
  darkMode
}) => {
  const [isAllocating, setIsAllocating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleAllocation = () => {
    setShowConfirmModal(false);
    setIsAllocating(true);
    setTimeout(() => {
      onRunAllocation();
      setIsAllocating(false);
    }, 1500); // Simulate processing time
  };

  // Stats
  const totalStudents = students.length;
  const totalCapacity = centers.reduce((acc, c) => acc + c.capacity, 0);
  const allocatedStudents = students.filter(s => s.status === 'ALLOCATED').length;
  const unallocatedStudents = students.filter(s => s.status === 'UNALLOCATED').length;
  
  const allocationData = [
    { name: 'Allocated', value: allocatedStudents },
    { name: 'Unallocated', value: unallocatedStudents },
    { name: 'Pending', value: totalStudents - allocatedStudents - unallocatedStudents }
  ];

  const centerData = centers.map(c => ({
    name: c.name.split(' ').slice(0, 2).join(' '), // Shorten name for chart
    Capacity: c.capacity,
    Allocated: c.allocated,
  }));

  const chartTextColor = darkMode ? '#737373' : '#64748b'; // neutral-500
  // Lightened dark mode bar color to #404040 so it stands out against black bg and #262626 grids
  const capacityBarColor = darkMode ? '#404040' : '#e2e8f0'; 
  const allocatedBarColor = darkMode ? '#6366f1' : '#4f46e5';
  const tooltipBg = darkMode ? '#171717' : '#fff'; // neutral-900
  const tooltipText = darkMode ? '#f5f5f5' : '#1e293b';
  const gridColor = darkMode ? '#262626' : '#e2e8f0';

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>
          <p className="text-slate-500 dark:text-neutral-400">Overview of allocation status and center utilization.</p>
        </div>
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isAllocating}
          className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all w-full sm:w-auto
            ${isAllocating 
              ? 'bg-slate-400 dark:bg-neutral-700 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 dark:hover:shadow-none active:scale-95'}`}
        >
          {isAllocating ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Play className="h-5 w-5" />
          )}
          <span>{isAllocating ? 'Processing...' : 'Run Allocation Cycle'}</span>
        </button>
      </div>

      {lastAllocatedTime && (
        <div className="bg-green-50 dark:bg-black text-green-700 dark:text-green-400 p-3 rounded-md border border-green-200 dark:border-green-900 flex items-center text-sm">
          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Last allocation run completed at {lastAllocatedTime.toLocaleTimeString()}.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-neutral-900 rounded-full text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">Total Applicants</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-neutral-900 rounded-full text-indigo-600 dark:text-indigo-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">Total Capacity</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalCapacity}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 dark:bg-neutral-900 rounded-full text-green-600 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">Allocated</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{allocatedStudents}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 dark:bg-neutral-900 rounded-full text-red-600 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">Unallocated</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{unallocatedStudents}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capacity vs Allocation Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-black p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Center Utilization</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centerData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: chartTextColor, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: darkMode ? '1px solid #262626' : 'none', backgroundColor: tooltipBg, color: tooltipText, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  // Use semi-transparent cursor to avoid hiding bars behind a solid color
                  cursor={{ fill: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Capacity" fill={capacityBarColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Allocated" fill={allocatedBarColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Status Pie Chart */}
        <div className="bg-white dark:bg-black p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Allocation Status</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke={darkMode ? '#000' : '#fff'}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={darkMode ? COLORS_DARK[index % COLORS_DARK.length] : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: darkMode ? '1px solid #262626' : 'none', backgroundColor: tooltipBg, color: tooltipText, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Capacity Management */}
      <div className="bg-white dark:bg-black p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Center Capacity Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-neutral-800">
            <thead className="bg-slate-50 dark:bg-neutral-900">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Center Name</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Current Capacity</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Filled</th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-black divide-y divide-slate-200 dark:divide-neutral-800">
              {centers.map((center) => (
                <tr key={center.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-neutral-200">{center.name}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-neutral-400">{center.location}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-neutral-200">
                    <span className="font-mono bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded">{center.capacity}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-neutral-400">
                     <div className="flex items-center">
                        <span className={`mr-2 font-medium ${center.allocated >= center.capacity ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {center.allocated}
                        </span>
                        <div className="w-16 bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 hidden sm:block">
                          <div 
                            className={`h-1.5 rounded-full ${center.allocated >= center.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, (center.allocated/center.capacity)*100)}%` }}
                          ></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button 
                      onClick={() => onUpdateCapacity(center.id, center.capacity - 1)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                      disabled={center.capacity <= 0}
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => onUpdateCapacity(center.id, center.capacity + 1)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    >
                      +1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal - Rendered via Portal to escape parent stacking context */}
      {showConfirmModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-neutral-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-black rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in transform scale-100 transition-all border border-slate-200 dark:border-neutral-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Allocation</h3>
            </div>
            
            <p className="text-slate-600 dark:text-neutral-300 mb-8 leading-relaxed">
              Are you sure you want to run the allocation? <br/>
              <span className="text-red-600 dark:text-red-400 font-medium">This cannot be undone</span> and will overwrite existing allocations based on current preferences.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-slate-700 dark:text-neutral-300 font-medium hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-slate-200 dark:border-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAllocation}
                className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-md transition-colors flex items-center"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
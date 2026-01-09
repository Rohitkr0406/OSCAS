import React, { useState } from 'react';
import { Student, StudyCenter } from '../types';
import { Check, AlertTriangle, MapPin, Award, Building, ChevronDown } from 'lucide-react';

interface StudentPortalProps {
  student: Student;
  centers: StudyCenter[];
  onUpdatePreferences: (studentId: string, preferences: string[]) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, centers, onUpdatePreferences }) => {
  const [pref1, setPref1] = useState(student.preferences[0] || '');
  const [pref2, setPref2] = useState(student.preferences[1] || '');
  const [pref3, setPref3] = useState(student.preferences[2] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const availableCenters = centers;
  const allocatedCenter = centers.find(c => c.id === student.allocatedCenterId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    const preds = [pref1, pref2, pref3].filter(p => p !== '');
    const unique = new Set(preds);
    if (unique.size !== preds.length) {
      alert("Please select distinct centers for each preference.");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      onUpdatePreferences(student.id, preds);
      setIsSubmitting(false);
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  const getStatusBadge = () => {
    switch(student.status) {
      case 'ALLOCATED': return <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold border border-green-200 dark:border-green-800">Allocated</span>;
      case 'UNALLOCATED': return <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-800">Not Allocated</span>;
      case 'SUBMITTED': return <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800">Preferences Submitted</span>;
      default: return <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 text-sm font-semibold border border-gray-200 dark:border-neutral-700">Pending Action</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-slate-200 dark:border-neutral-800 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="h-32 w-32 dark:text-white" />
        </div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{student.name}</h1>
            <p className="text-slate-500 dark:text-neutral-400">Merit Rank: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">#{student.meritRank}</span></p>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-start md:items-end mt-2 md:mt-0">
          <p className="text-sm text-slate-400 dark:text-neutral-500 mb-1 uppercase tracking-wider font-medium">Status</p>
          {getStatusBadge()}
        </div>
      </div>

      {/* Allocation Result (if available) */}
      {student.status === 'ALLOCATED' && allocatedCenter && (
        <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900 p-4 sm:p-6 animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-700 dark:text-green-400 shrink-0">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-400">Congratulations! You have been allocated a seat.</h3>
              <p className="text-green-700 dark:text-green-300 mt-1">Based on your merit rank and preferences, you have been assigned to:</p>
              
              <div className="mt-4 bg-white dark:bg-black rounded-lg p-4 border border-green-200 dark:border-green-800 shadow-sm flex items-center space-x-4">
                <Building className="h-8 w-8 text-green-600 dark:text-green-500 shrink-0" />
                <div>
                  <p className="font-bold text-lg text-slate-800 dark:text-white">{allocatedCenter.name}</p>
                  <div className="flex items-center text-slate-500 dark:text-neutral-400 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {allocatedCenter.location}
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-green-800 dark:text-green-400">
                Please proceed to the admission portal to finalize your enrollment before the deadline.
              </p>
            </div>
          </div>
        </div>
      )}

      {student.status === 'UNALLOCATED' && (
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900 p-4 sm:p-6 animate-fade-in">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-700 dark:text-red-400 shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Allocation Update</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                Unfortunately, we could not allocate a seat in your preferred centers based on your current merit rank.
              </p>
              <p className="mt-2 text-sm text-red-800 dark:text-red-300">
                You may be eligible for the second round of allocation. Please check back later for updates or modify your preferences if a new window opens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preference Form */}
      {(student.status === 'PENDING' || student.status === 'SUBMITTED') && (
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border border-slate-200 dark:border-neutral-800 p-4 sm:p-6 transition-colors">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Study Center Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-neutral-400">
              Please select up to 3 study centers in order of preference. Allocation is based strictly on merit rank and availability.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {[
                { label: '1st Preference', value: pref1, setter: setPref1 },
                { label: '2nd Preference', value: pref2, setter: setPref2 },
                { label: '3rd Preference', value: pref3, setter: setPref3 },
              ].map((field, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                  <label className="text-sm font-medium text-slate-700 dark:text-neutral-300 md:text-right">{field.label}</label>
                  <div className="md:col-span-3 relative">
                    <select
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="appearance-none block w-full rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm py-3 pl-4 pr-10 shadow-sm transition-all hover:border-slate-400 dark:hover:border-neutral-600"
                      required={idx === 0} // Only 1st is strictly required
                    >
                      <option value="">Select a Center...</option>
                      {availableCenters.map(center => (
                        <option 
                          key={center.id} 
                          value={center.id}
                          className="py-1"
                          disabled={[pref1, pref2, pref3].includes(center.id) && field.value !== center.id}
                        >
                          {center.name} ({center.location})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-neutral-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium order-2 sm:order-1">{successMessage}</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 order-1 sm:order-2 ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
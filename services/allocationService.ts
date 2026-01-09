import { Student, StudyCenter, AllocationResult } from '../types';

export const runAllocationAlgorithm = (
  students: Student[],
  centers: StudyCenter[]
): AllocationResult => {
  // Deep copy to avoid mutating state directly during calculation
  const workingStudents = JSON.parse(JSON.stringify(students)) as Student[];
  const workingCenters = JSON.parse(JSON.stringify(centers)) as StudyCenter[];

  // 1. Reset current allocations
  workingCenters.forEach(c => c.allocated = 0);
  workingStudents.forEach(s => {
    s.allocatedCenterId = null;
    // Only reset status if they were previously allocated/unallocated. 
    // If PENDING, stay PENDING. If SUBMITTED, stay SUBMITTED until processed.
    if (s.status === 'ALLOCATED' || s.status === 'UNALLOCATED') {
      s.status = 'SUBMITTED';
    }
  });

  // 2. Sort students by Merit Rank (Ascending: 1 is best)
  // Only process students who have SUBMITTED preferences
  const activeStudents = workingStudents.filter(s => s.status === 'SUBMITTED');
  activeStudents.sort((a, b) => a.meritRank - b.meritRank);

  // 3. Allocation Logic
  activeStudents.forEach(student => {
    let assigned = false;

    // Try preferences in order
    for (const prefCenterId of student.preferences) {
      const centerIndex = workingCenters.findIndex(c => c.id === prefCenterId);
      if (centerIndex !== -1) {
        const center = workingCenters[centerIndex];
        if (center.allocated < center.capacity) {
          // Assign seat
          center.allocated++;
          student.allocatedCenterId = center.id;
          student.status = 'ALLOCATED';
          assigned = true;
          break; // Stop checking preferences for this student
        }
      }
    }

    if (!assigned) {
      student.status = 'UNALLOCATED';
    }
  });

  // Update the main list with the processed active students
  // (We worked on references within activeStudents, but let's map back to be safe/clear)
  const finalStudents = workingStudents.map(s => {
    const processed = activeStudents.find(as => as.id === s.id);
    return processed || s;
  });

  const totalAllocated = finalStudents.filter(s => s.status === 'ALLOCATED').length;
  const totalUnallocated = finalStudents.filter(s => s.status === 'UNALLOCATED').length;
  const totalCapacity = workingCenters.reduce((sum, c) => sum + c.capacity, 0);

  return {
    students: finalStudents,
    centers: workingCenters,
    stats: {
      totalAllocated,
      totalUnallocated,
      capacityUtilization: totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0
    }
  };
};

export interface StudyCenter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  allocated: number;
}

export interface Student {
  id: string;
  name: string;
  password?: string;
  meritRank: number;
  preferences: string[]; // Array of Center IDs in order of preference
  allocatedCenterId: string | null;
  status: 'PENDING' | 'SUBMITTED' | 'ALLOCATED' | 'UNALLOCATED';
}

export interface AllocationResult {
  students: Student[];
  centers: StudyCenter[];
  stats: {
    totalAllocated: number;
    totalUnallocated: number;
    capacityUtilization: number;
  };
}

export interface User {
  role: 'ADMIN' | 'STUDENT' | null;
  studentId?: string; // If role is STUDENT
}
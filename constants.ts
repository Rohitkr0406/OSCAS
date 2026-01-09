import { StudyCenter, Student } from './types';

export const INITIAL_CENTERS: StudyCenter[] = [
  { id: 'c1', name: 'Downtown Tech Campus', location: 'City Center', capacity: 5, allocated: 0 },
  { id: 'c2', name: 'Northside Science Hub', location: 'North District', capacity: 3, allocated: 0 },
  { id: 'c3', name: 'West End Arts Block', location: 'West End', capacity: 4, allocated: 0 },
  { id: 'c4', name: 'Eastern Engineering Wing', location: 'East Side', capacity: 6, allocated: 0 },
  { id: 'c5', name: 'South Medical Annex', location: 'South Bay', capacity: 2, allocated: 0 },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', password: 'password123', meritRank: 1, preferences: [], allocatedCenterId: null, status: 'PENDING' },
  { id: 's2', name: 'Bob Smith', password: 'password123', meritRank: 5, preferences: ['c1', 'c2', 'c3'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's3', name: 'Charlie Davis', password: 'password123', meritRank: 12, preferences: ['c2', 'c1', 'c5'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's4', name: 'Diana Evans', password: 'password123', meritRank: 3, preferences: ['c1', 'c5', 'c4'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's5', name: 'Ethan Hunt', password: 'password123', meritRank: 8, preferences: ['c3', 'c4', 'c1'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's6', name: 'Fiona Green', password: 'password123', meritRank: 2, preferences: ['c1', 'c2', 'c3'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's7', name: 'George Hall', password: 'password123', meritRank: 15, preferences: ['c5', 'c2', 'c1'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's8', name: 'Hannah Lee', password: 'password123', meritRank: 6, preferences: ['c4', 'c3', 'c2'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's9', name: 'Ian Wright', password: 'password123', meritRank: 10, preferences: ['c1', 'c4', 'c3'], allocatedCenterId: null, status: 'SUBMITTED' },
  { id: 's10', name: 'Jane Doe', password: 'password123', meritRank: 4, preferences: ['c2', 'c5', 'c1'], allocatedCenterId: null, status: 'SUBMITTED' },
];
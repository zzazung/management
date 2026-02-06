
export type AttendanceStatus = 'IN' | 'OUT' | 'LATE' | 'OFF';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  location?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Other';
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

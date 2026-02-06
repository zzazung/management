
export type AttendanceStatus = 'IN' | 'OUT' | 'LATE' | 'OFF';
export type UserRole = 'EMPLOYEE' | 'ADMIN';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string; // 관리자 뷰를 위해 추가
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  location?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string; // 관리자 뷰를 위해 추가
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
  role: UserRole;
  department: string;
  joinDate: string;
  remainingLeave: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

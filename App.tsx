
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, LeaveRequest, UserProfile, AttendanceStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import LeaveManagement from './components/LeaveManagement';
import AIAssistant from './components/AIAssistant';

const MOCK_USER: UserProfile = {
  id: 'u123',
  name: '김철수',
  email: 'chulsoo.kim@zenwork.com',
  role: 'Senior Developer',
  department: 'Product Engineering',
  joinDate: '2022-03-15',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'leave' | 'ai'>('dashboard');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize with some mock data if empty
  useEffect(() => {
    const savedAttendance = localStorage.getItem('zenwork_attendance');
    const savedLeave = localStorage.getItem('zenwork_leave');
    
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
    if (savedLeave) setLeaveRequests(JSON.parse(savedLeave));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveToStorage = (type: 'attendance' | 'leave', data: any) => {
    localStorage.setItem(`zenwork_${type}`, JSON.stringify(data));
  };

  const handleCheckIn = () => {
    const now = new Date();
    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: MOCK_USER.id,
      date: now.toISOString().split('T')[0],
      checkIn: now.toLocaleTimeString(),
      status: now.getHours() >= 9 && now.getMinutes() > 0 ? 'LATE' : 'IN',
    };
    const updated = [newRecord, ...attendance];
    setAttendance(updated);
    saveToStorage('attendance', updated);
  };

  const handleCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const updated = attendance.map(rec => {
      if (rec.date === today && !rec.checkOut) {
        return { ...rec, checkOut: new Date().toLocaleTimeString(), status: 'OUT' as AttendanceStatus };
      }
      return rec;
    });
    setAttendance(updated);
    saveToStorage('attendance', updated);
  };

  const handleLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      userId: MOCK_USER.id,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const updated = [newRequest, ...leaveRequests];
    setLeaveRequests(updated);
    saveToStorage('leave', updated);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={MOCK_USER} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">안녕하세요, {MOCK_USER.name}님!</h1>
            <p className="text-slate-500">{currentTime.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Time</p>
                <p className="text-2xl font-mono font-bold text-indigo-600">{currentTime.toLocaleTimeString()}</p>
             </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              attendance={attendance} 
              onCheckIn={handleCheckIn} 
              onCheckOut={handleCheckOut} 
            />
          )}
          {activeTab === 'history' && <History records={attendance} />}
          {activeTab === 'leave' && (
            <LeaveManagement 
              requests={leaveRequests} 
              onSubmit={handleLeaveRequest} 
            />
          )}
          {activeTab === 'ai' && (
            <AIAssistant 
              attendance={attendance} 
              leaveRequests={leaveRequests} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord, LeaveRequest, UserProfile, AttendanceStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import History from './components/History';
import LeaveManagement from './components/LeaveManagement';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import AdminLeaveApprovals from './components/AdminLeaveApprovals';
import AdminEmployees from './components/AdminEmployees';
import { supabase } from './services/supabaseClient';

const MOCK_ADMIN: UserProfile = {
  id: 'admin_1',
  name: '이관리',
  email: 'admin@zenwork.com',
  role: 'ADMIN',
  department: 'People & Culture',
  joinDate: '2020-01-01',
  remainingLeave: 15,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [allLeaveRequests, setAllLeaveRequests] = useState<LeaveRequest[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // 전역 데이터 페칭
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. 임직원 목록
      const { data: empData } = await supabase.from('employees').select('*');
      if (empData) setEmployees(empData.map(e => ({
        ...e,
        joinDate: e.join_date,
        remainingLeave: e.remaining_leave
      })));

      // 2. 현재 사용자의 근태 기록 (MOCK_ADMIN 기준)
      const { data: attData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', MOCK_ADMIN.id)
        .order('date', { ascending: false });
      if (attData) setAttendance(attData);

      // 3. 현재 사용자의 휴가 신청
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', MOCK_ADMIN.id)
        .order('created_at', { ascending: false });
      if (leaveData) setLeaveRequests(leaveData.map(l => ({
        ...l,
        startDate: l.start_date,
        endDate: l.end_date,
        createdAt: l.created_at
      })));

      // 4. 관리자용: 전체 휴가 신청
      const { data: allLeaves } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (allLeaves) setAllLeaveRequests(allLeaves.map(l => ({
        ...l,
        startDate: l.start_date,
        endDate: l.end_date,
        createdAt: l.created_at
      })));

    } catch (error) {
      console.error("Supabase fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const handleCheckIn = async () => {
    const now = new Date();
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: MOCK_ADMIN.id,
      user_name: MOCK_ADMIN.name,
      date: now.toISOString().split('T')[0],
      check_in: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: now.getHours() >= 9 && now.getMinutes() > 0 ? 'LATE' : 'IN',
    };

    const { error } = await supabase.from('attendance').insert([newRecord]);
    if (error) {
      alert("출근 기록 실패: " + error.message);
    } else {
      fetchData(); // 데이터 새로고침
    }
  };

  const handleCheckOut = async () => {
    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const { error } = await supabase
      .from('attendance')
      .update({ check_out: checkOutTime, status: 'OUT' })
      .eq('user_id', MOCK_ADMIN.id)
      .eq('date', today);

    if (error) {
      alert("퇴근 기록 실패: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => {
    const newRequest = {
      id: 'L-' + Math.random().toString(36).substr(2, 9),
      user_id: MOCK_ADMIN.id,
      user_name: MOCK_ADMIN.name,
      type: request.type,
      start_date: request.startDate,
      end_date: request.endDate,
      status: 'PENDING',
      reason: request.reason,
    };

    const { error } = await supabase.from('leave_requests').insert([newRequest]);
    if (error) {
      alert("휴가 신청 실패: " + error.message);
    } else {
      alert('휴가 신청이 성공적으로 접수되었습니다.');
      fetchData();
    }
  };

  const handleApproveLeave = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert("상태 변경 실패: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleAddEmployee = async (newEmp: UserProfile) => {
    const dbEmp = {
      id: newEmp.id,
      name: newEmp.name,
      email: newEmp.email,
      role: newEmp.role,
      department: newEmp.department,
      join_date: newEmp.joinDate,
      remaining_leave: newEmp.remainingLeave
    };

    const { error } = await supabase.from('employees').insert([dbEmp]);
    if (error) {
      alert("직원 등록 실패: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleUpdateEmployee = async (updatedEmp: UserProfile) => {
    const dbEmp = {
      name: updatedEmp.name,
      email: updatedEmp.email,
      role: updatedEmp.role,
      department: updatedEmp.department,
      remaining_leave: updatedEmp.remainingLeave
    };

    const { error } = await supabase
      .from('employees')
      .update(dbEmp)
      .eq('id', updatedEmp.id);

    if (error) {
      alert("직원 수정 실패: " + error.message);
    } else {
      fetchData();
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (id === MOCK_ADMIN.id) {
      alert('현재 로그인된 관리자 계정은 삭제할 수 없습니다.');
      return;
    }

    if (window.confirm('정말 이 임직원을 삭제하시겠습니까? 관련 데이터가 모두 삭제됩니다.')) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) {
        alert("삭제 실패: " + error.message);
      } else {
        fetchData();
        alert('삭제가 완료되었습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">ZenWork 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={MOCK_ADMIN} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {MOCK_ADMIN.role === 'ADMIN' ? 'ZenWork 관리 시스템' : `안녕하세요, ${MOCK_ADMIN.name}님!`}
            </h1>
            <p className="text-slate-500 font-medium">{currentTime.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
             <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">실시간 현황</p>
                <p className="text-2xl font-mono font-bold text-indigo-600">{currentTime.toLocaleTimeString([], { hour12: false })}</p>
             </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard attendance={attendance} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />}
          {activeTab === 'history' && <History records={attendance} />}
          {activeTab === 'leave' && <LeaveManagement requests={leaveRequests} onSubmit={handleLeaveRequest} />}
          {activeTab === 'ai' && <AIAssistant attendance={attendance} leaveRequests={leaveRequests} />}
          
          {activeTab === 'admin_dashboard' && <AdminDashboard attendance={attendance} />}
          {activeTab === 'admin_approvals' && (
            <AdminLeaveApprovals 
              requests={allLeaveRequests} 
              onAction={handleApproveLeave} 
            />
          )}
          {activeTab === 'admin_employees' && (
            <AdminEmployees 
              employees={employees} 
              onAdd={handleAddEmployee}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
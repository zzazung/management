
import React from 'react';
import { AttendanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  attendance: AttendanceRecord[];
  onCheckIn: () => void;
  onCheckOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ attendance, onCheckIn, onCheckOut }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(r => r.date === today);
  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOut;

  // Chart data (Last 7 days)
  const chartData = [
    { day: '월', hours: 8 },
    { day: '화', hours: 9 },
    { day: '수', hours: 8.5 },
    { day: '목', hours: 7.5 },
    { day: '금', hours: 8 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Clocking Section */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">근태 관리</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wide">오늘의 상태</p>
              <h3 className={`text-3xl font-black ${!isCheckedIn ? 'text-slate-300' : isCheckedOut ? 'text-green-600' : 'text-indigo-600'}`}>
                {!isCheckedIn ? '근무 전' : isCheckedOut ? '퇴근 완료' : '근무 중'}
              </h3>
              {isCheckedIn && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-400">출근 시간</p>
                    <p className="font-bold text-slate-700">{todayRecord.checkIn}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-400">퇴근 시간</p>
                    <p className="font-bold text-slate-700">{todayRecord.checkOut || '--:--'}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto min-w-[180px]">
              <button
                disabled={isCheckedIn}
                onClick={onCheckIn}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-md ${
                  isCheckedIn 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                }`}
              >
                출근하기
              </button>
              <button
                disabled={!isCheckedIn || isCheckedOut}
                onClick={onCheckOut}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-md ${
                  !isCheckedIn || isCheckedOut
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95'
                }`}
              >
                퇴근하기
              </button>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">이번 주 근무 통계</h2>
            <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 근무 시간
                </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours >= 8 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Side Section */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold opacity-90">연차 정보</h3>
            <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">12.5</span>
            <span className="text-sm opacity-75">/ 15일</span>
          </div>
          <div className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: '83%' }}></div>
          </div>
          <p className="mt-4 text-xs opacity-75">다음 달 소멸 예정 연차가 2일 있습니다.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">최근 알림</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 shrink-0"></div>
              <div>
                <p className="text-sm text-slate-800 font-medium">건강검진 대상자 안내</p>
                <p className="text-xs text-slate-500">2024년 정기 건강검진 기간입니다.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div>
              <div>
                <p className="text-sm text-slate-800 font-medium">연차 신청 승인</p>
                <p className="text-xs text-slate-500">10/24 연차 신청이 승인되었습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

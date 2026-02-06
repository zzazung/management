
import React from 'react';
import { AttendanceRecord } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AdminDashboardProps {
  attendance: AttendanceRecord[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ attendance }) => {
  const stats = [
    { label: '전체 임직원', value: 42, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-indigo-100 text-indigo-600' },
    { label: '오늘 출근', value: 38, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-100 text-emerald-600' },
    { label: '오늘 지각', value: 2, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-100 text-amber-600' },
    { label: '오늘 휴가', value: 2, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-rose-100 text-rose-600' },
  ];

  const pieData = [
    { name: '출근 완료', value: 38, color: '#10b981' },
    { name: '지각', value: 2, color: '#f59e0b' },
    { name: '휴가', value: 2, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">실시간 출근 명부</h2>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Live Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">이름 / 부서</th>
                  <th className="px-6 py-4">출근 시간</th>
                  <th className="px-6 py-4">퇴근 시간</th>
                  <th className="px-6 py-4">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden text-[10px] flex items-center justify-center font-bold">
                          {rec.userName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{rec.userName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Product Design</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rec.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rec.checkOut || '--:--'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {rec.status === 'LATE' ? '지각' : '정상'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="font-bold text-slate-800 w-full mb-4">근태 비율</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl w-full">
            <p className="text-xs text-slate-500 leading-relaxed">
              현재 전체 인원 중 <span className="font-bold text-emerald-600">90%</span>가 출근을 완료했습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

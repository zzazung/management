
import React from 'react';
import { AttendanceRecord } from '../types';

interface HistoryProps {
  records: AttendanceRecord[];
}

const History: React.FC<HistoryProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">나의 근무 기록</h2>
        <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">이번 달</button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">필터</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">날짜</th>
              <th className="px-6 py-4 font-semibold">출근 시간</th>
              <th className="px-6 py-4 font-semibold">퇴근 시간</th>
              <th className="px-6 py-4 font-semibold">근무 시간</th>
              <th className="px-6 py-4 font-semibold">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  근무 기록이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-700">{record.date}</td>
                  <td className="px-6 py-4 text-slate-600">{record.checkIn}</td>
                  <td className="px-6 py-4 text-slate-600">{record.checkOut || '--:--'}</td>
                  <td className="px-6 py-4 text-slate-600">8h 00m</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      record.status === 'IN' ? 'bg-indigo-100 text-indigo-700' :
                      record.status === 'LATE' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'OUT' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {record.status === 'IN' ? '출근' : record.status === 'LATE' ? '지각' : record.status === 'OUT' ? '퇴근' : '휴무'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;

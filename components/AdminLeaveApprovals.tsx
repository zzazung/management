
import React from 'react';
import { LeaveRequest } from '../types';

interface AdminLeaveApprovalsProps {
  requests: LeaveRequest[];
  onAction: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

const AdminLeaveApprovals: React.FC<AdminLeaveApprovalsProps> = ({ requests, onAction }) => {
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const processedRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          승인 대기 중
          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingRequests.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                <p className="text-slate-400 text-sm font-medium">대기 중인 휴가 신청이 없습니다.</p>
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                      {req.userName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{req.userName}</p>
                      <p className="text-xs text-slate-400 font-medium">신청일: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded">Pending</span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">종류</span>
                    <span className="font-bold text-slate-700">{req.type === 'Annual' ? '연차' : '병가'}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">기간</span>
                    <span className="font-bold text-slate-700">{req.startDate} ~ {req.endDate}</span>
                  </div>
                  <div className="border-t border-slate-200 mt-2 pt-2 text-xs">
                    <p className="text-slate-500 mb-1 italic">"{req.reason}"</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onAction(req.id, 'APPROVED')}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    승인
                  </button>
                  <button 
                    onClick={() => onAction(req.id, 'REJECTED')}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    반려
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">최근 처리 내역</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">직원명</th>
                <th className="px-6 py-4">종류</th>
                <th className="px-6 py-4">기간</th>
                <th className="px-6 py-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedRequests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{req.userName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{req.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{req.startDate} ~ {req.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {req.status === 'APPROVED' ? '승인됨' : '반려됨'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveApprovals;

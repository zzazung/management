
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface AdminEmployeesProps {
  employees: UserProfile[];
  onAdd: (emp: UserProfile) => void;
  onUpdate: (emp: UserProfile) => void;
  onDelete: (id: string) => void;
}

const AdminEmployees: React.FC<AdminEmployeesProps> = ({ employees, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmp, setCurrentEmp] = useState<Partial<UserProfile>>({
    role: 'EMPLOYEE',
    department: '',
    name: '',
    email: '',
    remainingLeave: 15,
  });

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentEmp({ role: 'EMPLOYEE', department: '', name: '', email: '', remainingLeave: 15 });
    setShowModal(true);
  };

  const openEditModal = (emp: UserProfile) => {
    setIsEditMode(true);
    setCurrentEmp(emp);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmp.name || !currentEmp.email) return;
    
    if (isEditMode && currentEmp.id) {
      onUpdate(currentEmp as UserProfile);
    } else {
      const emp: UserProfile = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name: currentEmp.name || '',
        email: currentEmp.email || '',
        role: currentEmp.role as UserRole,
        department: currentEmp.department || '미지정',
        joinDate: new Date().toISOString().split('T')[0],
        remainingLeave: currentEmp.remainingLeave || 15,
      };
      onAdd(emp);
    }
    
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="직원 이름 또는 부서 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
          />
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          신규 직원 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-4">직원 정보</th>
                <th className="px-6 py-4">부서 / 권한</th>
                <th className="px-6 py-4">입사일</th>
                <th className="px-6 py-4">잔여 연차</th>
                <th className="px-6 py-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">표시할 직원이 없습니다.</td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden border border-slate-200 shadow-sm">
                          <img src={`https://picsum.photos/seed/${emp.id}/100/100`} alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-semibold">{emp.department}</p>
                      <p className={`text-[10px] inline-block px-1.5 py-0.5 rounded font-bold uppercase ${emp.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {emp.role}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{emp.joinDate}</td>
                    <td className="px-6 py-4">
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{emp.remainingLeave}일</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => openEditModal(emp)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 hover:border-indigo-200"
                          title="수정"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          type="button"
                          onClick={() => onDelete(emp.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 hover:border-rose-200"
                          title="삭제"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
              <h3 className="font-bold text-lg">{isEditMode ? '임직원 정보 수정' : '신규 임직원 등록'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">성명</label>
                <input
                  required
                  type="text"
                  value={currentEmp.name}
                  onChange={e => setCurrentEmp({...currentEmp, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-medium"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">이메일 주소</label>
                <input
                  required
                  type="email"
                  value={currentEmp.email}
                  onChange={e => setCurrentEmp({...currentEmp, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-medium"
                  placeholder="name@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">소속 부서</label>
                  <input
                    type="text"
                    value={currentEmp.department}
                    onChange={e => setCurrentEmp({...currentEmp, department: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-medium"
                    placeholder="부서명"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">시스템 권한</label>
                  <select
                    value={currentEmp.role}
                    onChange={e => setCurrentEmp({...currentEmp, role: e.target.value as UserRole})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-bold"
                  >
                    <option value="EMPLOYEE">일반사원 (Employee)</option>
                    <option value="ADMIN">관리자 (Admin)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">잔여 연차 (일)</label>
                <input
                  type="number"
                  step="0.5"
                  value={currentEmp.remainingLeave}
                  onChange={e => setCurrentEmp({...currentEmp, remainingLeave: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 font-bold text-indigo-600"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                >
                  {isEditMode ? '변경사항 저장' : '등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;

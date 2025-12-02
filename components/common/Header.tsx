import React from 'react';
import { Menu, Search } from 'lucide-react';
import { UserRole } from '../../types/index';

interface HeaderProps { 
    userRole: UserRole, 
    setUserRole: (role: UserRole) => void,
    onSearchClick: () => void,
}

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, onSearchClick }) => {
    return (
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center">
                <button onClick={() => (window as any).toggleSidebar()} className="mr-4 text-slate-600 lg:hidden">
                    <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800 lg:hidden">StructurAI</span>
            </div>

            <div className="flex-1 flex justify-center px-4">
                <button 
                    onClick={onSearchClick}
                    className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 flex items-center justify-between text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Search size={16} />
                        <span className="text-sm">Search...</span>
                    </div>
                    <span className="text-xs border border-slate-300 rounded px-1.5 py-0.5">Ctrl K</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                 <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="bg-slate-100 border border-slate-200 rounded-md px-3 py-1 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="Engineer">Engineer</option>
                     <option value="Client">Client</option>
                     <option value="Admin">Admin</option>
                 </select>
            </div>
        </header>
    );
};

export default Header;

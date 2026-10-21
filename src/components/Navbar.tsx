import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Film, 
  Newspaper, 
  Users2, 
  Volume2, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: 'dashboard' | 'videos' | 'news' | 'friends';
  onSelectTab: (tab: 'dashboard' | 'videos' | 'news' | 'friends') => void;
  currentUser: User;
  onLogout: () => void;
  onOpenTutorial: () => void;
  onOpenCodeExport?: () => void;
  incomingRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenTutorial,
  onOpenCodeExport,
  incomingRequestsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#7d0d2b]/20 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark: My School in Burgundy & Black */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] p-0.5 shadow-md shadow-[#800020]/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#800020]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-tight whitespace-nowrap font-sans">
              My School
            </span>
            <span className="text-[11px] text-[#800020] font-semibold whitespace-nowrap hidden sm:inline">
              المنصة المدرسية المتكاملة
            </span>
          </div>
        </div>

        {/* Zone 2: 4 Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#800020] font-bold'
                : 'text-slate-600 hover:text-[#800020]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </span>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('videos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'videos'
                ? 'text-[#800020] font-bold'
                : 'text-slate-600 hover:text-[#800020]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              مكتبة الدروس
            </span>
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('news')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'news'
                ? 'text-[#800020] font-bold'
                : 'text-slate-600 hover:text-[#800020]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              أخبار المواد
            </span>
            {activeTab === 'news' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('friends')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'friends'
                ? 'text-[#800020] font-bold'
                : 'text-slate-600 hover:text-[#800020]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users2 className="w-4 h-4" />
              <span>شبكة الزملاء</span>
              {incomingRequestsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-xs font-mono">
                  {incomingRequestsCount}
                </span>
              )}
            </span>
            {activeTab === 'friends' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Tutorial / AI Voice Guide Trigger */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-[#800020]/25 text-[#800020] text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            title="شرح أهداف المنصة وكيفية استخدامها بالصوت والنص (AI)"
          >
            <Volume2 className="w-4 h-4 text-[#800020]" />
            <span className="hidden sm:inline">دليل المنصة (AI)</span>
          </button>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          {/* User Profile with Letter Avatar & Logout */}
          <div className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-[#800020]/20 bg-rose-50/40">
            <UserAvatar
              name={currentUser.name}
              role={currentUser.role}
              size="sm"
              showStatus
              statusOnline
            />
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-extrabold text-xs text-slate-900 leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#800020] font-bold">
                {currentUser.role === 'teacher' ? 'حساب المعلم 🎓' : 'حساب الطالب 📘'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="تبديل الحساب أو تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#7d0d2b]/15 bg-white px-2 py-2">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'dashboard' ? 'text-[#800020]' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          الرئيسية
        </button>
        <button
          onClick={() => onSelectTab('videos')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'videos' ? 'text-[#800020]' : 'text-slate-500'
          }`}
        >
          <Film className="w-4 h-4" />
          الدروس
        </button>
        <button
          onClick={() => onSelectTab('news')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'news' ? 'text-[#800020]' : 'text-slate-500'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          الأخبار
        </button>
        <button
          onClick={() => onSelectTab('friends')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'friends' ? 'text-[#800020]' : 'text-slate-500'
          }`}
        >
          <Users2 className="w-4 h-4" />
          الزملاء
        </button>
      </div>
    </header>
  );
};

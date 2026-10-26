import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Film, 
  Newspaper, 
  Users2, 
  Volume2, 
  LogOut,
  Sun,
  Moon,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { User } from '../types';
import { UserAvatar } from './UserAvatar';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'dashboard' | 'videos' | 'news' | 'friends';
  onSelectTab: (tab: 'dashboard' | 'videos' | 'news' | 'friends') => void;
  currentUser: User;
  onLogout: () => void;
  onOpenTutorial: () => void;
  onOpenCodeExport?: () => void;
  incomingRequestsCount?: number;
  onReplaySplash?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenTutorial,
  incomingRequestsCount = 0,
  onReplaySplash
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c0d10]/95 backdrop-blur-md border-b border-[#7d0d2b]/20 dark:border-rose-900/40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Brand Wordmark: My School in Burgundy & Black */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={onReplaySplash}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] p-0.5 shadow-md shadow-[#800020]/20 flex items-center justify-center cursor-pointer group"
            title="إعادة مشاهدة شاشة الترحيب"
          >
            <div className="w-full h-full bg-white dark:bg-[#160207] rounded-[10px] flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-[#800020] dark:text-rose-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-tight whitespace-nowrap font-sans">
              My School
            </span>
            <span className="text-[11px] text-[#800020] dark:text-rose-400 font-semibold whitespace-nowrap hidden sm:inline">
              المنصة المدرسية المتكاملة
            </span>
          </div>
        </div>

        {/* Zone 1.5: Administrator Title Badge on the top bar (أيمن أحمد إبراهيم) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50/70 dark:bg-[#181922] border border-[#800020]/20 dark:border-rose-500/30 text-right shrink-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] text-rose-200 flex items-center justify-center shrink-0">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold text-[#800020] dark:text-rose-300">
              إدارة المنصة الأكاديمية
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate">
              أيمن أحمد إبراهيم · Ayman Ahmed Ibrahim
            </span>
          </div>
        </div>

        {/* Zone 2: 4 Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-semibold">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'dashboard'
                ? 'text-[#800020] dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-stone-300 hover:text-[#800020] dark:hover:text-rose-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </span>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] dark:bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('videos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'videos'
                ? 'text-[#800020] dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-stone-300 hover:text-[#800020] dark:hover:text-rose-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              مكتبة الدروس
            </span>
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] dark:bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('news')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'news'
                ? 'text-[#800020] dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-stone-300 hover:text-[#800020] dark:hover:text-rose-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              أخبار المواد
            </span>
            {activeTab === 'news' && (
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] dark:bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('friends')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              activeTab === 'friends'
                ? 'text-[#800020] dark:text-rose-400 font-bold'
                : 'text-slate-600 dark:text-stone-300 hover:text-[#800020] dark:hover:text-rose-300'
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
              <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#800020] dark:bg-rose-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls (Theme Toggle, AI Guide, Profile) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-stone-100 dark:bg-[#1b1c24] hover:bg-stone-200 dark:hover:bg-[#252733] border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-rose-200 transition-all cursor-pointer shadow-2xs flex items-center justify-center"
            title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح (Light Mode)' : 'التحويل إلى الوضع المظلم (Dark Mode)'}
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-[#800020] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Tutorial / AI Voice Guide Trigger */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-[#20040c] hover:bg-rose-100/80 dark:hover:bg-[#2e0612] border border-[#800020]/25 dark:border-rose-500/30 text-[#800020] dark:text-rose-200 text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer"
            title="شرح أهداف المنصة وكيفية استخدامها بالصوت والنص (AI)"
          >
            <Volume2 className="w-4 h-4 text-[#800020] dark:text-rose-400" />
            <span className="hidden sm:inline">دليل المنصة (AI)</span>
          </button>

          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />

          {/* User Profile with Letter Avatar & Logout */}
          <div className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-[#800020]/20 dark:border-rose-500/20 bg-rose-50/40 dark:bg-[#161720]">
            <UserAvatar
              name={currentUser.name}
              role={currentUser.role}
              size="sm"
              showStatus
              statusOnline
            />
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#800020] dark:text-rose-400 font-bold">
                {currentUser.role === 'teacher' ? 'حساب المعلم 🎓' : 'حساب الطالب 📘'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="تبديل الحساب أو تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#7d0d2b]/15 dark:border-rose-950 bg-white dark:bg-[#0c0d10] px-2 py-2">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'dashboard' ? 'text-[#800020] dark:text-rose-400' : 'text-slate-500 dark:text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          الرئيسية
        </button>
        <button
          onClick={() => onSelectTab('videos')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'videos' ? 'text-[#800020] dark:text-rose-400' : 'text-slate-500 dark:text-stone-400'
          }`}
        >
          <Film className="w-4 h-4" />
          الدروس
        </button>
        <button
          onClick={() => onSelectTab('news')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'news' ? 'text-[#800020] dark:text-rose-400' : 'text-slate-500 dark:text-stone-400'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          الأخبار
        </button>
        <button
          onClick={() => onSelectTab('friends')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold py-1 px-2 ${
            activeTab === 'friends' ? 'text-[#800020] dark:text-rose-400' : 'text-slate-500 dark:text-stone-400'
          }`}
        >
          <Users2 className="w-4 h-4" />
          الزملاء
        </button>
      </div>
    </header>
  );
};

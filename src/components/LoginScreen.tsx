import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  UserCheck, 
  CheckCircle2,
  Sun,
  Moon,
  Crown,
  ShieldCheck,
  Play
} from 'lucide-react';
import { UserRole } from '../types';
import { UserAvatar } from './UserAvatar';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLogin: (name: string, role: UserRole, gender: 'male' | 'female', gradeOrSubject: string, schoolClass?: string) => Promise<void>;
  existingUsers: Array<{ name: string; role: UserRole; gender?: 'male' | 'female'; avatar: string; gradeOrSubject: string; schoolClass?: string; userCode?: string }>;
  onReplaySplash?: () => void;
}

const FIRST_SECONDARY_BRANCHES = [
  '1/1', '1/2', '1/3', '1/4', '1/5', '1/6',
  '1/7', '1/8', '1/9', '1/10', '1/11', '1/12'
];

const SECOND_BACCALAUREATE_BRANCHES = [
  '2/1', '2/2', '2/3', '2/4', '2/5', '2/6',
  '2/7', '2/8', '2/9'
];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  existingUsers = [],
  onReplaySplash
}) => {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [studentGrade, setStudentGrade] = useState<'أولى ثانوي' | 'ثانية بكلوريا'>('أولى ثانوي');
  const [branch, setBranch] = useState<string>('1/1');
  const [teacherSubject, setTeacherSubject] = useState<string>('الفيزياء');
  const [teacherClassDesc, setTeacherClassDesc] = useState<string>('قسم العلوم والمواد التجريبية');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGradeChange = (grade: 'أولى ثانوي' | 'ثانية بكلوريا') => {
    setStudentGrade(grade);
    if (grade === 'أولى ثانوي') {
      setBranch('1/1');
    } else {
      setBranch('2/1');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      if (role === 'student') {
        await onLogin(name.trim(), 'student', gender, studentGrade, branch);
      } else {
        await onLogin(name.trim(), 'teacher', gender, teacherSubject, teacherClassDesc);
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء حفظ البيانات، يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: { name: string; role: UserRole; gender?: 'male' | 'female'; gradeOrSubject: string; schoolClass?: string }) => {
    setName(u.name);
    setRole(u.role);
    if (u.gender) setGender(u.gender);
    if (u.role === 'student') {
      if (u.gradeOrSubject === 'ثانية بكلوريا' || u.gradeOrSubject === 'ثانية بكالوريا') {
        setStudentGrade('ثانية بكلوريا');
      } else {
        setStudentGrade('أولى ثانوي');
      }
      if (u.schoolClass) setBranch(u.schoolClass);
    } else {
      setTeacherSubject(u.gradeOrSubject);
      if (u.schoolClass) setTeacherClassDesc(u.schoolClass);
    }
  };

  const activeBranches = studentGrade === 'أولى ثانوي' 
    ? FIRST_SECONDARY_BRANCHES 
    : SECOND_BACCALAUREATE_BRANCHES;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-slate-900 dark:text-stone-100 flex flex-col justify-between py-5 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#800020] selection:text-white transition-colors duration-200" dir="rtl">
      
      {/* Top Brand & Administrator Header Bar */}
      <header className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3 border-b border-[#7d0d2b]/20 dark:border-[#7d0d2b]/40 pb-4">
        
        {/* Brand Side (Right side in RTL) */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onReplaySplash}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] p-0.5 shadow-md shadow-[#800020]/25 flex items-center justify-center cursor-pointer group"
            title="إعادة تشغيل شاشة الترحيب"
          >
            <div className="w-full h-full bg-white dark:bg-[#160207] rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-[#800020] dark:text-rose-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight font-sans">
              My School
            </span>
            <span className="text-xs text-[#800020] dark:text-rose-300 font-bold block">
              المنصة المدرسية المتكاملة
            </span>
          </div>
        </div>

        {/* Opposite Side: Administrator Badge (أيمن أحمد إبراهيم) & Theme Toggle Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center sm:justify-end">
          
          {/* Administrator Name Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#181922] border border-[#800020]/25 dark:border-rose-500/30 text-right shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] text-rose-200 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold text-[#800020] dark:text-rose-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-rose-500" />
                إدارة المنصة الأكاديمية
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                أيمن أحمد إبراهيم · Ayman Ahmed Ibrahim
              </span>
            </div>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-[#1b1c24] hover:bg-stone-100 dark:hover:bg-[#252733] border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-rose-200 transition-all cursor-pointer shadow-xs flex items-center justify-center"
            title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح (Light Mode)' : 'التحويل إلى الوضع المظلم (Dark Mode)'}
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="w-4 h-4 text-[#800020] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Replay Splash Intro Button */}
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="p-2 rounded-xl bg-rose-50 dark:bg-[#20040c] hover:bg-rose-100 dark:hover:bg-[#2e0612] border border-[#800020]/20 dark:border-rose-500/30 text-[#800020] dark:text-rose-300 transition-all cursor-pointer shadow-xs flex items-center justify-center"
              title="مشاهدة شاشة الترحيب وانقسام الصفحة"
              aria-label="إعادة شاشة الترحيب"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

        </div>
      </header>

      {/* Main Center Login Container */}
      <main className="my-auto max-w-xl w-full mx-auto py-6">
        <div className="bg-white dark:bg-[#14151b] border border-stone-200 dark:border-[#7d0d2b]/40 rounded-3xl p-6 sm:p-9 shadow-xl dark:shadow-2xl dark:shadow-black relative overflow-hidden transition-colors">
          
          <div className="relative z-10 space-y-5">
            
            {/* Header Text */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 dark:bg-black/60 border border-rose-200 dark:border-rose-900/50 text-[#800020] dark:text-rose-400 mb-1 shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                تسجيل الدخول إلى <span className="text-[#800020] dark:text-rose-400 font-black">My School</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                ادخل باسمك بدون كلمة مرور. سيتم حفظ اسمك تلقائياً ليكون مرئياً ومتاحاً لجميع زملائك في خانة «شبكة الزملاء».
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-right text-xs">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1.5">نوع الحساب في المدرسة</label>
                <div className="grid grid-cols-2 gap-2.5 p-1 bg-stone-100 dark:bg-[#1d1f27] rounded-2xl border border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-gradient-to-r from-[#690b24] to-[#8a0f32] text-white shadow-md border border-rose-500/40'
                        : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-rose-300" />
                    <span>حساب طالب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-gradient-to-r from-[#690b24] to-[#8a0f32] text-white shadow-md border border-rose-500/40'
                        : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-rose-300" />
                    <span>حساب معلم</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">
                  الاسم الكامل (سيُحفظ ويظهر لباقي الطلاب والمعلمين)
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'teacher' ? 'مثال: أ. محمد المنصور' : 'مثال: أحمد الغامدي'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1b1c24] border border-stone-300 dark:border-stone-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-medium transition-colors"
                />
              </div>

              {/* Gender Selection: بنين / بنات */}
              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">
                  التصنيف في شبكة الزملاء (بنين / بنات)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-rose-100 dark:bg-[#3b0615] border-[#800020] dark:border-rose-600 text-[#800020] dark:text-rose-100 shadow-xs'
                        : 'bg-stone-50 dark:bg-[#1b1c24] border-stone-300 dark:border-stone-700 text-slate-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{role === 'student' ? 'طالب (قسم البنين)' : 'معلم (بنين)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-rose-100 dark:bg-[#3b0615] border-[#800020] dark:border-rose-600 text-[#800020] dark:text-rose-100 shadow-xs'
                        : 'bg-stone-50 dark:bg-[#1b1c24] border-stone-300 dark:border-stone-700 text-slate-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{role === 'student' ? 'طالبة (قسم البنات)' : 'معلمة (بنات)'}</span>
                  </button>
                </div>
              </div>

              {/* If Student: Select Grade & Specific Branch (1/1-1/12 or 2/1-2/9) */}
              {role === 'student' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">الصف الدراسي (صفين معتمدين)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleGradeChange('أولى ثانوي')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'أولى ثانوي'
                            ? 'bg-[#800020] text-white border-rose-500/60 shadow-xs'
                            : 'bg-stone-50 dark:bg-[#1b1c24] border-stone-300 dark:border-stone-800 text-slate-600 dark:text-stone-400'
                        }`}
                      >
                        أولى ثانوي (12 شعبة)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGradeChange('ثانية بكلوريا')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'ثانية بكلوريا'
                            ? 'bg-[#800020] text-white border-rose-500/60 shadow-xs'
                            : 'bg-stone-50 dark:bg-[#1b1c24] border-stone-300 dark:border-stone-800 text-slate-600 dark:text-stone-400'
                        }`}
                      >
                        ثانية بكلوريا (9 شعب)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">
                      اختر الشعبة المدرسية المسجل بها:
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1b1c24] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-semibold"
                    >
                      {activeBranches.map((b) => (
                        <option key={b} value={b} className="bg-white dark:bg-[#1b1c24] text-slate-900 dark:text-white">
                          شعبة {b} ({studentGrade})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* If Teacher: Subject and Department */
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">المادة التعليمية</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1b1c24] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-semibold"
                    >
                      <option value="الفيزياء">الفيزياء</option>
                      <option value="الكيمياء">الكيمياء</option>
                      <option value="الرياضيات">الرياضيات</option>
                      <option value="البرمجة">البرمجة</option>
                      <option value="اللغة العربية">اللغة العربية</option>
                      <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                      <option value="التاريخ">التاريخ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">الشعب أو القسم</label>
                    <input
                      type="text"
                      value={teacherClassDesc}
                      onChange={(e) => setTeacherClassDesc(e.target.value)}
                      placeholder="هيئة التدريس - قسم العلوم"
                      className="w-full bg-stone-50 dark:bg-[#1b1c24] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white font-extrabold text-sm shadow-xl shadow-black/30 border border-rose-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{loading ? 'جاري الحفظ والتسجيل...' : 'تسجيل الدخول والانضمام للشبكة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Test Accounts from Database with Letter Avatars */}
            {existingUsers && existingUsers.length > 0 && (
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-stone-400 block text-center">
                  أو اختر حساباً مسجلاً ومحفوظاً للدخول السريع:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {existingUsers.slice(0, 4).map((u, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-[#800020] dark:hover:border-rose-600/60 bg-stone-50 dark:bg-[#171820] hover:bg-stone-100 dark:hover:bg-[#22242f] transition-colors flex items-center gap-2.5 text-right cursor-pointer"
                    >
                      <UserAvatar
                        name={u.name}
                        role={u.role}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="font-bold text-slate-900 dark:text-white block truncate text-[11px]">{u.name}</span>
                          {u.userCode && (
                            <span className="font-mono text-[9px] bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-300 px-1 rounded font-black">
                              {u.userCode}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#800020] dark:text-rose-300 block truncate font-mono">
                          {u.schoolClass} · {u.gender === 'female' ? 'بنات' : 'بنين'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer featuring Administrator: Ayman Ahmed Ibrahim */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 dark:text-stone-500 py-3 border-t border-stone-200 dark:border-stone-800/80">
        <p className="leading-relaxed">
          منصة <span className="font-bold text-[#800020] dark:text-rose-400">My School</span> التعليمية الذكية · بإدارة وإشراف: <strong className="text-slate-800 dark:text-stone-200">أيمن أحمد إبراهيم (Ayman Ahmed Ibrahim)</strong> · جميع الحقوق محفوظة © 2026
        </p>
      </footer>

    </div>
  );
};

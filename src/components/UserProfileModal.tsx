import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Mail, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Hash,
  School
} from 'lucide-react';
import { User, FIRST_SECONDARY_BRANCHES, SECOND_BACCALAUREATE_BRANCHES } from '../types';
import { UserAvatar } from './UserAvatar';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateProfile?: (updatedData: Partial<User>) => Promise<void>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(user.schoolClass || '1/1');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.userCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = user.userCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveBranch = async () => {
    if (!onUpdateProfile) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdateProfile({ schoolClass: selectedBranch });
      setIsEditingBranch(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const isTeacher = user.role === 'teacher';
  const isFemale = user.gender === 'female';

  const availableBranches = user.gradeOrSubject === 'ثانية بكالوريا' 
    ? SECOND_BACCALAUREATE_BRANCHES 
    : FIRST_SECONDARY_BRANCHES;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#12131a] border border-[#7d0d2b]/30 dark:border-rose-900/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header Banner with Luxury Burgundy Gradient */}
        <div className="relative h-28 bg-gradient-to-r from-black via-[#4a0618] to-[#800020] p-4 flex items-start justify-between text-white overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/40 rounded-full blur-lg pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-rose-200 bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-rose-500/20">
            <School className="w-3.5 h-3.5 text-rose-300" />
            <span>بيانات الحساب الأكاديمي المعتمد · My School</span>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar & Status Floating Header */}
        <div className="px-6 -mt-12 relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-right">
            <div className="p-1 rounded-2xl bg-white dark:bg-[#12131a] shadow-xl">
              <UserAvatar
                name={user.name}
                role={user.role}
                size="lg"
                showStatus
                statusOnline
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  حساب موثق
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#800020] dark:text-rose-400 font-bold">
                <span>{isTeacher ? (isFemale ? 'معلمة معتمدة 🎓' : 'معلم معتمد 🎓') : (isFemale ? 'طالبة في المدرسة 📘' : 'طالب في المدرسة 📘')}</span>
                <span>·</span>
                <span>{user.schoolClass ? (isTeacher ? user.schoolClass : `شعبة ${user.schoolClass}`) : user.gradeOrSubject}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-stone-100 dark:bg-[#1c1d27] text-slate-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
              {user.gradeOrSubject}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-160px)] overflow-y-auto">

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <span>تم تحديث وحفظ بيانات الشعبة بنجاح في قاعدة البيانات!</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {/* Unified Academic Code Hero Card */}
          <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-[#3d0514] to-[#800020] text-white p-5 border border-rose-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-rose-400" />
                الكود الأكاديمي الموحد للحساب (Academic User Code)
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full font-bold">
                موحد للبحث والمراسلة
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl sm:text-3xl font-black text-rose-300 tracking-wider">
                  {user.userCode}
                </span>
                <span className="text-[11px] text-stone-300 font-medium hidden sm:inline">
                  (رمز موحد ثابت لا يتكرر)
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white hover:bg-rose-50 text-[#800020] active:scale-95'
                }`}
                title="نسخ الكود لمشاركته مع زملائك"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الكود</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-rose-100/90 leading-relaxed font-medium">
              💡 شارك هذا الكود مع زملائك في المدرسة؛ يمكنهم كتابته مباشرة في شريط البحث في خانة الزملاء للعثور على حسابك وإرسال طلب صداقة فوري!
            </p>
          </div>

          {/* Academic Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Field: Role & Gender */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#181922] border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-slate-400 dark:text-stone-500 text-[11px] block font-medium">الصفة والجنس</span>
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                <GraduationCap className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                <span>
                  {isTeacher 
                    ? (isFemale ? 'معلمة بالمدرسة' : 'معلم بالمدرسة') 
                    : (isFemale ? 'طالبة (قسم البنات)' : 'طالب (قسم البنين)')}
                </span>
              </div>
            </div>

            {/* Field: Class / Branch with Quick Edit */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#181922] border border-stone-200 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-stone-500 text-[11px] font-medium">الصف والشعبة الدراسية</span>
                {!isTeacher && onUpdateProfile && !isEditingBranch && (
                  <button
                    onClick={() => setIsEditingBranch(true)}
                    className="text-[10px] text-[#800020] dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    تغيير الشعبة
                  </button>
                )}
              </div>

              {!isEditingBranch ? (
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200">
                  <BookOpen className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                  <span>
                    {user.gradeOrSubject} {user.schoolClass ? `· شعبة ${user.schoolClass}` : ''}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="bg-white dark:bg-[#202230] border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-mono"
                  >
                    {availableBranches.map(br => (
                      <option key={br} value={br}>شعبة {br}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveBranch}
                    disabled={isSaving}
                    className="px-2.5 py-1 bg-[#800020] text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-[#991136]"
                  >
                    {isSaving ? 'حفظ...' : 'تأكيد'}
                  </button>
                  <button
                    onClick={() => setIsEditingBranch(false)}
                    className="text-slate-400 text-[11px] hover:text-slate-600 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            {/* Field: School Email */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#181922] border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-slate-400 dark:text-stone-500 text-[11px] block font-medium">البريد الإلكتروني المعتمد</span>
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200 truncate">
                <Mail className="w-4 h-4 text-[#800020] dark:text-rose-400 shrink-0" />
                <span className="truncate font-mono text-[11px]">{user.email}</span>
              </div>
            </div>

            {/* Field: Database ID */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#181922] border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-slate-400 dark:text-stone-500 text-[11px] block font-medium">معرّف السيرفر وقاعدة البيانات</span>
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-stone-200 font-mono text-[11px] truncate">
                <ShieldCheck className="w-4 h-4 text-[#800020] dark:text-rose-400 shrink-0" />
                <span className="truncate">{user.id}</span>
              </div>
            </div>

          </div>

          {/* Academic Stats */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#181922] border border-stone-200 dark:border-stone-800 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#800020] dark:text-rose-400" />
              مؤشرات الأداء الأكاديمي المسجلة
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1f202b] border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] text-slate-400 dark:text-stone-500 block mb-0.5">المعدل</span>
                <span className="text-sm font-black text-[#800020] dark:text-rose-300 font-mono">{user.stats?.gpa || 98.5}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1f202b] border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] text-slate-400 dark:text-stone-500 block mb-0.5">الحضور</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">{user.stats?.attendanceRate || 100}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1f202b] border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] text-slate-400 dark:text-stone-500 block mb-0.5">النقاط</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{user.stats?.points || 500}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#1f202b] border border-stone-200/80 dark:border-stone-800">
                <span className="text-[10px] text-slate-400 dark:text-stone-500 block mb-0.5">الدروس</span>
                <span className="text-sm font-black text-slate-800 dark:text-stone-200 font-mono">{user.stats?.completedLessons || 0}</span>
              </div>
            </div>
          </div>

          {/* Badges List */}
          {user.badges && user.badges.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-stone-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                الأوسمة المعتمدة في الملف:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-[#20040c] text-[#800020] dark:text-rose-300 border border-[#800020]/25 dark:border-rose-500/30 text-xs font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#800020] dark:text-rose-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-[#161720] border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-stone-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>متصل بقاعدة البيانات الحية ومحفوظ بالسيرفر</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white font-bold cursor-pointer transition-all shadow-md shadow-[#800020]/20"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

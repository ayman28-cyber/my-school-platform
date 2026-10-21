import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  UserCheck, 
  CheckCircle2 
} from 'lucide-react';
import { UserRole } from '../types';
import { UserAvatar } from './UserAvatar';

interface LoginScreenProps {
  onLogin: (name: string, role: UserRole, gender: 'male' | 'female', gradeOrSubject: string, schoolClass?: string) => Promise<void>;
  existingUsers: Array<{ name: string; role: UserRole; gender?: 'male' | 'female'; avatar: string; gradeOrSubject: string; schoolClass?: string }>;
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
  existingUsers = []
}) => {
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
    <div className="min-h-screen bg-[#0e0f12] text-stone-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#800020] selection:text-white" dir="rtl">
      
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#7d0d2b]/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] p-0.5 shadow-md shadow-[#800020]/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#18191f] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight font-sans">
              My School
            </span>
            <span className="text-xs text-rose-300 font-semibold block">
              المنصة المدرسية المتكاملة
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-rose-200 bg-[#1c1d24] border border-[#7d0d2b]/40 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>الشعب المعتمدة: أولى ثانوي (1/1 إلى 1/12) · ثانية بكلوريا (2/1 إلى 2/9)</span>
        </div>
      </div>

      {/* Main Center Login Container */}
      <div className="my-auto max-w-xl w-full mx-auto py-6">
        <div className="bg-[#14151b] border border-[#7d0d2b]/40 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black relative overflow-hidden">
          
          <div className="relative z-10 space-y-5">
            
            {/* Header Text */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black/60 border border-rose-900/50 text-rose-400 mb-1">
                <UserCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                تسجيل الدخول إلى <span className="text-rose-400 font-black">My School</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                ادخل باسمك بدون كلمة مرور. سيتم حفظ اسمك تلقائياً ليكون مرئياً ومتاحاً لجميع زملائك في خانة «شبكة الزملاء».
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-right text-xs">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">نوع الحساب في المدرسة</label>
                <div className="grid grid-cols-2 gap-2.5 p-1 bg-[#1d1f27] rounded-2xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-gradient-to-r from-[#690b24] to-[#8a0f32] text-white shadow-md border border-rose-500/40'
                        : 'text-stone-400 hover:text-white'
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
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-rose-300" />
                    <span>حساب معلم</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  الاسم الكامل (سيُحفظ ويظهر لباقي الطلاب والمعلمين)
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'teacher' ? 'مثال: أ. محمد المنصور' : 'مثال: أحمد الغامدي'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1c24] border border-stone-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-medium"
                />
              </div>

              {/* Gender Selection: بنين / بنات */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  التصنيف في شبكة الزملاء (بنين / بنات)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-[#3b0615] border-rose-600 text-rose-100 shadow-xs'
                        : 'bg-[#1b1c24] border-stone-700 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <span>{role === 'student' ? 'طالب (قسم البنين)' : 'معلم (بنين)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-[#3b0615] border-rose-600 text-rose-100 shadow-xs'
                        : 'bg-[#1b1c24] border-stone-700 text-stone-400 hover:bg-stone-800'
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
                    <label className="block text-stone-300 font-bold mb-1">الصف الدراسي (صفين معتمدين)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleGradeChange('أولى ثانوي')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'أولى ثانوي'
                            ? 'bg-[#700b24] text-white border-rose-500/60 shadow-xs'
                            : 'bg-[#1b1c24] border-stone-800 text-stone-400'
                        }`}
                      >
                        أولى ثانوي (12 شعبة)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGradeChange('ثانية بكلوريا')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'ثانية بكلوريا'
                            ? 'bg-[#700b24] text-white border-rose-500/60 shadow-xs'
                            : 'bg-[#1b1c24] border-stone-800 text-stone-400'
                        }`}
                      >
                        ثانية بكلوريا (9 شعب)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      اختر الشعبة التابع لها في صف ({studentGrade})
                    </label>
                    
                    {/* Visual Branch Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2 bg-[#191a22] rounded-xl border border-stone-800">
                      {activeBranches.map((br) => (
                        <button
                          key={br}
                          type="button"
                          onClick={() => setBranch(br)}
                          className={`py-1.5 rounded-lg font-bold text-xs border transition-all cursor-pointer text-center font-mono ${
                            branch === br
                              ? 'bg-gradient-to-r from-[#6e0a23] to-[#8f0d30] text-white border-rose-400 shadow-xs ring-1 ring-rose-400'
                              : 'bg-[#14151a] border-stone-800 text-stone-300 hover:border-rose-900'
                          }`}
                        >
                          {br}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-rose-300 font-bold">
                      <span>الشعبة المختارة: صف {studentGrade} · شعبة {branch}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ستظهر في شبكة الزملاء
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* If Teacher: Select Subject and Class */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">مادة التدريس</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full bg-[#1b1c24] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
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
                    <label className="block text-stone-300 font-bold mb-1">الشعب أو القسم</label>
                    <input
                      type="text"
                      value={teacherClassDesc}
                      onChange={(e) => setTeacherClassDesc(e.target.value)}
                      placeholder="هيئة التدريس - قسم العلوم"
                      className="w-full bg-[#1b1c24] border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white font-extrabold text-sm shadow-xl shadow-black/50 border border-rose-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{loading ? 'جاري الحفظ والتسجيل...' : 'تسجيل الدخول والانضمام للشبكة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Test Accounts from Database with Letter Avatars */}
            {existingUsers && existingUsers.length > 0 && (
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <span className="text-[11px] font-bold text-stone-400 block text-center">
                  أو اختر حساباً مسجلاً ومحفوظاً للدخول السريع:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {existingUsers.slice(0, 4).map((u, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2.5 rounded-xl border border-stone-800 hover:border-rose-600/60 bg-[#171820] hover:bg-[#22242f] transition-colors flex items-center gap-2.5 text-right cursor-pointer"
                    >
                      <UserAvatar
                        name={u.name}
                        role={u.role}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate text-[11px]">{u.name}</span>
                        <span className="text-[10px] text-rose-300 block truncate font-mono">
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
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-stone-500 py-2">
        منصة My School التعليمية الذكية · جميع الحقوق محفوظة © 2026
      </div>

    </div>
  );
};

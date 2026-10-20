import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { UserRole, FIRST_SECONDARY_BRANCHES, SECOND_BACCALAUREATE_BRANCHES } from '../types';

interface LoginScreenProps {
  onLogin: (name: string, role: UserRole, gender: 'male' | 'female', gradeOrSubject?: string, schoolClass?: string) => Promise<void>;
  existingUsers: Array<{ name: string; role: UserRole; gender?: 'male' | 'female'; avatar: string; gradeOrSubject: string; schoolClass?: string }>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  existingUsers
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [studentGrade, setStudentGrade] = useState<'أولى ثانوي' | 'ثانية بكلوريا'>('أولى ثانوي');
  const [branch, setBranch] = useState<string>('1/1');
  const [teacherSubject, setTeacherSubject] = useState<string>('الفيزياء');
  const [teacherClassDesc, setTeacherClassDesc] = useState<string>('هيئة التدريس - قسم العلوم');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When studentGrade changes, update default branch
  const handleGradeChange = (grade: 'أولى ثانوي' | 'ثانية بكلوريا') => {
    setStudentGrade(grade);
    if (grade === 'أولى ثانوي') {
      setBranch(FIRST_SECONDARY_BRANCHES[0]);
    } else {
      setBranch(SECOND_BACCALAUREATE_BRANCHES[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('الرجاء إدخال اسمك الكامل للدخول');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const gradeOrSubject = role === 'student' ? studentGrade : teacherSubject;
      const schoolClass = role === 'student' ? branch : teacherClassDesc;
      await onLogin(name.trim(), role, gender, gradeOrSubject, schoolClass);
    } catch {
      setErrorMsg('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.');
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
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-amber-500 selection:text-white" dir="rtl">
      
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 border-b border-amber-200/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight font-sans">
              My School
            </span>
            <span className="text-xs text-amber-700 font-semibold block">
              المنصة المدرسية المتكاملة
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>الشعب المعتمدة: أولى ثانوي (1/1 إلى 1/12) · ثانية بكلوريا (2/1 إلى 2/9)</span>
        </div>
      </div>

      {/* Main Center Login Container */}
      <div className="my-auto max-w-xl w-full mx-auto py-6">
        <div className="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-9 shadow-xl shadow-amber-900/5 relative overflow-hidden">
          
          <div className="relative z-10 space-y-5">
            
            {/* Header Text */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-1">
                <UserCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                تسجيل الدخول إلى <span className="text-amber-600 font-black">My School</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                ادخل باسمك بدون كلمة مرور. سيتم حفظ اسمك تلقائياً ليكون مرئياً ومتاحاً لجميع زملائك في خانة «شبكة الزملاء».
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-right text-xs">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">نوع الحساب في المدرسة</label>
                <div className="grid grid-cols-2 gap-2.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-amber-700 shadow-sm border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>حساب طالب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-white text-amber-700 shadow-sm border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>حساب معلم</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  الاسم الكامل (سيُحفظ ويظهر لباقي الطلاب والمعلمين)
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'teacher' ? 'مثال: أ. محمد المنصور' : 'مثال: أحمد الغامدي'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium"
                />
              </div>

              {/* Gender Selection: بنين / بنات */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  التصنيف في شبكة الزملاء (بنين / بنات)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'male'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                        : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{role === 'student' ? 'طالب (قسم البنين)' : 'معلم (بنين)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      gender === 'female'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs'
                        : 'bg-white border-stone-200 text-slate-600 hover:bg-stone-50'
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
                    <label className="block text-slate-700 font-bold mb-1">الصف الدراسي (صفين معتمدين)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleGradeChange('أولى ثانوي')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'أولى ثانوي'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-slate-700'
                        }`}
                      >
                        أولى ثانوي (12 شعبة)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGradeChange('ثانية بكلوريا')}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          studentGrade === 'ثانية بكلوريا'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-slate-700'
                        }`}
                      >
                        ثانية بكلوريا (9 شعب)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      اختر الشعبة التابع لها في صف ({studentGrade})
                    </label>
                    
                    {/* Visual Branch Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
                      {activeBranches.map((br) => (
                        <button
                          key={br}
                          type="button"
                          onClick={() => setBranch(br)}
                          className={`py-1.5 rounded-lg font-bold text-xs border transition-all cursor-pointer text-center font-mono ${
                            branch === br
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs ring-1 ring-amber-400'
                              : 'bg-white border-stone-200 text-slate-800 hover:border-amber-300'
                          }`}
                        >
                          {br}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-800 font-bold">
                      <span>الشعبة المختارة: صف {studentGrade} · شعبة {branch}</span>
                      <span className="text-emerald-700 flex items-center gap-1">
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
                    <label className="block text-slate-700 font-bold mb-1">مادة التدريس</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-bold"
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
                    <label className="block text-slate-700 font-bold mb-1">الشعب أو القسم</label>
                    <input
                      type="text"
                      value={teacherClassDesc}
                      onChange={(e) => setTeacherClassDesc(e.target.value)}
                      placeholder="هيئة التدريس - قسم العلوم"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-extrabold text-sm shadow-lg shadow-amber-600/25 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>{loading ? 'جاري الحفظ والتسجيل...' : 'تسجيل الدخول والانضمام للشبكة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Test Accounts from Database */}
            {existingUsers && existingUsers.length > 0 && (
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block text-center">
                  أو اختر حساباً مسجلاً ومحفوظاً للدخول السريع:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {existingUsers.slice(0, 4).map((u, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50/50 transition-colors flex items-center gap-2 text-right cursor-pointer"
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate text-[11px]">{u.name}</span>
                        <span className="text-[10px] text-amber-700 block truncate font-mono">
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
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-2">
        منصة My School التعليمية الذكية · جميع الحقوق محفوظة © 2026
      </div>

    </div>
  );
};

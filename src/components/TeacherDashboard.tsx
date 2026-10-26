import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Video, 
  Send,
  CheckCircle
} from 'lucide-react';
import { User, VideoLesson, StudentProgress } from '../types';
import { UserAvatar } from './UserAvatar';

interface TeacherDashboardProps {
  teacher: User;
  students: User[];
  videos: VideoLesson[];
  progressList: StudentProgress[];
  onOpenPublishModal: () => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateNews: () => void;
}

const FIRST_SECONDARY_BRANCHES = [
  '1/1', '1/2', '1/3', '1/4', '1/5', '1/6',
  '1/7', '1/8', '1/9', '1/10', '1/11', '1/12'
];

const SECOND_BACCALAUREATE_BRANCHES = [
  '2/1', '2/2', '2/3', '2/4', '2/5', '2/6',
  '2/7', '2/8', '2/9'
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  students,
  videos,
  onOpenPublishModal,
  onOpenLesson,
  onNavigateNews
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesClass = true;
    if (selectedClass === 'grade1') {
      matchesClass = student.gradeOrSubject === 'أولى ثانوي';
    } else if (selectedClass === 'grade2') {
      matchesClass = student.gradeOrSubject === 'ثانية بكلوريا' || student.gradeOrSubject === 'ثانية بكالوريا';
    } else if (selectedClass !== 'all') {
      matchesClass = student.schoolClass === selectedClass;
    }
    return matchesSearch && matchesClass;
  });

  const teacherVideos = videos.filter(v => v.teacherId === teacher.id || v.teacherName.includes(teacher.name));
  const totalViews = teacherVideos.reduce((acc, curr) => acc + curr.views, 0);

  const handleSendFeedback = (studentName: string) => {
    setFeedbackSent(studentName);
    setTimeout(() => setFeedbackSent(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Teacher Welcome Header in Burgundy & Black Luxury */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-[#4a0618] to-[#7d0b28] text-white p-6 sm:p-8 shadow-xl shadow-black/20 border border-[#850e2e]/30">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-rose-200 font-bold bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full w-fit border border-rose-500/20">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>لوحة تحكم المعلم الأكاديمية · My School</span>
              <span aria-hidden="true">·</span>
              <span>{teacher.gradeOrSubject}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              أهلاً بك، {teacher.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-medium">
              بصفتك معلماً في My School، لديك صلاحيات حصرية لنشر الإعلانات والأخبار لكافة المواد، رفع الدروس المرئية، ومتابعة سجلات الطلاب المسجلين.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPublishModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-md border border-rose-500/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-rose-300" />
                نشر درس وفيديو تعليمي جديد
              </button>
              <button
                onClick={onNavigateNews}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-stone-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                نشر خبر في أخبار المواد
              </button>
            </div>
          </div>

          {/* Teacher KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1">الطلاب المسجلون</span>
              <span className="text-xl font-black text-white tabular-nums">{students.length} طالب</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1">الدروس المنشورة</span>
              <span className="text-xl font-black text-white tabular-nums">{teacherVideos.length} فيديو</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1">إجمالي المشاهدات</span>
              <span className="text-xl font-black text-white tabular-nums">{totalViews}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1">متوسط الأداء العام</span>
              <span className="text-xl font-black text-white tabular-nums">97.2%</span>
            </div>
          </div>
        </div>
      </div>

      {feedbackSent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between font-bold animate-fadeIn">
          <span>تم إرسال إشعار التقدير والملاحظة الأكاديمية بنجاح إلى الطالب: {feedbackSent}</span>
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Main Grid: Student Roster & Teacher Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Real Registered Students Roster */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">سجل متابعة الطلاب المسجلين الحقيقي</h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">إدارة نسب الإنجاز ورصد الملاحظات التعليمية الفردية</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث بالاسم..."
                    className="w-full bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#800020]"
                  />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-stone-200 focus:outline-none focus:border-[#800020] font-medium"
                >
                  <option value="all">كل الشعب والصفوف</option>
                  <optgroup label="أولى ثانوي (12 شعبة)">
                    <option value="grade1">جميع شعب أولى ثانوي</option>
                    {FIRST_SECONDARY_BRANCHES.map(br => (
                      <option key={br} value={br}>شعبة {br}</option>
                    ))}
                  </optgroup>
                  <optgroup label="ثانية بكلوريا (9 شعب)">
                    <option value="grade2">جميع شعب ثانية بكلوريا</option>
                    {SECOND_BACCALAUREATE_BRANCHES.map(br => (
                      <option key={br} value={br}>شعبة {br}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Students Table with Letter Avatars */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#7d0d2b]/15 dark:border-rose-900/30 text-slate-400 dark:text-stone-400 font-bold">
                    <th className="pb-3 pr-2">الطالب</th>
                    <th className="pb-3 px-3">الشعبة</th>
                    <th className="pb-3 px-3">المعدل</th>
                    <th className="pb-3 px-3">الحضور</th>
                    <th className="pb-3 pl-2 text-left">إجراء المعلم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={student.name}
                            role="student"
                            size="sm"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                            <div className="text-[11px] text-slate-400 dark:text-stone-500 font-mono">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-stone-300 font-medium">{student.schoolClass}</td>
                      <td className="py-3.5 px-3 font-extrabold text-[#800020] dark:text-rose-400 tabular-nums">
                        {student.stats?.gpa}%
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {student.stats?.attendanceRate}%
                      </td>
                      <td className="py-3.5 pl-2 text-left">
                        <button
                          onClick={() => handleSendFeedback(student.name)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-[#22040d] hover:bg-[#800020] dark:hover:bg-rose-900 text-[#800020] dark:text-rose-300 hover:text-white border border-[#800020]/25 dark:border-rose-500/30 font-bold transition-colors inline-flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          توجيه ملاحظة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Teacher Videos & Publishing */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                دروسك التعليمية
              </h3>
              <button
                onClick={onOpenPublishModal}
                className="text-xs text-[#800020] dark:text-rose-400 hover:text-[#9e1336] font-bold cursor-pointer"
              >
                + إضافة
              </button>
            </div>

            {teacherVideos.length === 0 ? (
              <div className="p-6 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 text-center text-slate-500 dark:text-stone-400 text-xs">
                لم تقم برفع دروس أو وسائط بعد. اضغط على الزر أدناه لإضافة أول درس لطلابك.
              </div>
            ) : (
              <div className="space-y-3">
                {teacherVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenLesson(video.id)}
                    className="cursor-pointer group p-3 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 hover:border-[#800020]/40 dark:hover:border-rose-600/40 transition-all flex items-center gap-3"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-900 shrink-0 relative flex items-center justify-center">
                      {video.mediaType === 'image' ? (
                        <img
                          src={video.mediaData || video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-rose-400">
                          <Video className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#800020]">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{video.duration}</span>
                        <span aria-hidden="true">·</span>
                        <span>{video.subject}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onOpenPublishModal}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#800020]/40 hover:border-[#800020] bg-rose-50/30 text-[#800020] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              نشر درس مرئي جديد الآن
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

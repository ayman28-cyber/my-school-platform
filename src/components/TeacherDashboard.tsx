import React, { useState } from 'react';
import { 
  Users, 
  Video, 
  Plus, 
  Search, 
  CheckCircle, 
  Sparkles,
  Send,
  BookOpen,
  Award
} from 'lucide-react';
import { User, VideoLesson, StudentProgress, FIRST_SECONDARY_BRANCHES, SECOND_BACCALAUREATE_BRANCHES } from '../types';

interface TeacherDashboardProps {
  teacher: User;
  students: User[];
  videos: VideoLesson[];
  progressList: StudentProgress[];
  onOpenPublishModal: () => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateNews: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  students,
  videos,
  progressList,
  onOpenPublishModal,
  onOpenLesson,
  onNavigateNews
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesClass = true;
    if (selectedClass !== 'all') {
      if (selectedClass === 'grade1') {
        matchesClass = FIRST_SECONDARY_BRANCHES.includes(s.schoolClass || '') || s.gradeOrSubject === 'أولى ثانوي';
      } else if (selectedClass === 'grade2') {
        matchesClass = SECOND_BACCALAUREATE_BRANCHES.includes(s.schoolClass || '') || s.gradeOrSubject === 'ثانية بكلوريا' || s.gradeOrSubject === 'ثانية بكالوريا';
      } else {
        matchesClass = s.schoolClass === selectedClass;
      }
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
      {/* Teacher Welcome Header in White & Gold */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white p-6 sm:p-8 shadow-lg shadow-amber-900/10">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-amber-100 font-bold bg-black/10 backdrop-blur-xs px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>لوحة تحكم المعلم الأكاديمية · My School</span>
              <span aria-hidden="true">·</span>
              <span>{teacher.gradeOrSubject}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              أهلاً بك، {teacher.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">
              بصفتك معلماً في My School، لديك صلاحيات حصرية لنشر الإعلانات والأخبار لكافة المواد، رفع الدروس المرئية، ومتابعة سجلات الطلاب المسجلين.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPublishModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                نشر درس وفيديو تعليمي جديد
              </button>
              <button
                onClick={onNavigateNews}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/15 hover:bg-black/25 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                نشر خبر في أخبار المواد
              </button>
            </div>
          </div>

          {/* Teacher KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1">الطلاب المسجلون</span>
              <span className="text-xl font-black text-white tabular-nums">{students.length} طالب</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1">الدروس المنشورة</span>
              <span className="text-xl font-black text-white tabular-nums">{teacherVideos.length} فيديو</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1">إجمالي المشاهدات</span>
              <span className="text-xl font-black text-white tabular-nums">{totalViews}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1">متوسط الأداء العام</span>
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
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">سجل متابعة الطلاب المسجلين الحقيقي</h3>
                <p className="text-xs text-slate-500">إدارة نسب الإنجاز ورصد الملاحظات التعليمية الفردية</p>
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
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 font-medium"
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

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-amber-100 text-slate-400 font-bold">
                    <th className="pb-3 pr-2">الطالب</th>
                    <th className="pb-3 px-3">الشعبة</th>
                    <th className="pb-3 px-3">المعدل</th>
                    <th className="pb-3 px-3">الحضور</th>
                    <th className="pb-3 pl-2 text-left">إجراء المعلم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-amber-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{student.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-medium">{student.schoolClass}</td>
                      <td className="py-3.5 px-3 font-extrabold text-amber-800 tabular-nums">
                        {student.stats?.gpa}%
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600 tabular-nums">
                        {student.stats?.attendanceRate}%
                      </td>
                      <td className="py-3.5 pl-2 text-left">
                        <button
                          onClick={() => handleSendFeedback(student.name)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 font-bold transition-colors inline-flex items-center gap-1 text-[11px] cursor-pointer"
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
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-600" />
                دروسك التعليمية
              </h3>
              <button
                onClick={onOpenPublishModal}
                className="text-xs text-amber-700 hover:text-amber-600 font-bold cursor-pointer"
              >
                + إضافة
              </button>
            </div>

            {teacherVideos.length === 0 ? (
              <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center text-slate-500 text-xs">
                لم تقم برفع دروس أو وسائط بعد. اضغط على الزر أدناه لإضافة أول درس لطلابك.
              </div>
            ) : (
              <div className="space-y-3">
                {teacherVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onOpenLesson(video.id)}
                    className="cursor-pointer group p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-all flex items-center gap-3"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0 relative flex items-center justify-center">
                      {video.mediaType === 'image' ? (
                        <img
                          src={video.mediaData || video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-900 flex items-center justify-center text-amber-400">
                          <Video className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700">
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
              className="w-full py-2.5 rounded-xl border border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 text-amber-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
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

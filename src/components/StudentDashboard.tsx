import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Play, 
  Users
} from 'lucide-react';
import { User, StudentTask, VideoLesson, StudentProgress, SubjectCategory } from '../types';
import { StudentTaskManager } from './StudentTaskManager';

interface StudentDashboardProps {
  user: User;
  lessons: VideoLesson[];
  progressList: StudentProgress[];
  tasks: StudentTask[];
  onAddTask: (taskData: {
    title: string;
    subject: SubjectCategory;
    dueDate: string;
    priority: 'عاجل' | 'متوسط' | 'عادي';
    notes?: string;
  }) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'videos' | 'news' | 'friends') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  lessons,
  progressList,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onOpenLesson,
  onNavigateTab
}) => {
  const completedLessonsCount = progressList.filter(p => p.completed).length;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  const subjectPerformance = [
    { name: 'الفيزياء', score: 98, color: '#800020', hours: '6.5 ساعة', trend: '+4%' },
    { name: 'البرمجة', score: 96, color: '#991136', hours: '8.2 ساعات', trend: '+6%' },
    { name: 'الرياضيات', score: 94, color: '#b81d42', hours: '7.0 ساعات', trend: '+3%' },
    { name: 'الكيمياء', score: 92, color: '#690923', hours: '5.0 ساعات', trend: '+2%' },
    { name: 'اللغة العربية', score: 95, color: '#4d071a', hours: '4.5 ساعات', trend: '+1%' },
    { name: 'اللغة الإنجليزية', score: 93, color: '#330412', hours: '5.2 ساعات', trend: '+3%' },
    { name: 'التاريخ', score: 91, color: '#8f0d30', hours: '3.8 ساعات', trend: '+2%' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner in Burgundy & Black Luxury */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-[#4a0618] to-[#7d0b28] text-white p-6 sm:p-8 shadow-xl shadow-black/20 border border-[#850e2e]/30">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-black/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-rose-200 font-bold bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full w-fit border border-rose-500/20">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>منصة My School الأكاديمية الذكية</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold">{user.gradeOrSubject} · شعبة {user.schoolClass || '1/1'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              أهلاً وسهلاً بك، {user.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-medium">
              أداؤك الأكاديمي رائع ومتميز! لديك اليوم {tasks.filter(t => !t.completed).length} مهام قيد الإنجاز في جدولك الشخصي، و{completedLessonsCount} دروس مكتملة.
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-rose-100">
              <span className="font-bold text-white">الأوسمة المسجلة:</span>
              {user.badges?.map((badge, idx) => (
                <span key={idx} className="bg-black/30 border border-rose-400/30 backdrop-blur-xs px-2.5 py-0.5 rounded-md font-semibold text-[11px] text-rose-200">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1 font-medium">المعدل التراكمي</span>
              <span className="text-xl font-black text-white tabular-nums">{user.stats?.gpa || 98.4}%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1 font-medium">نسبة الحضور</span>
              <span className="text-xl font-black text-white tabular-nums">{user.stats?.attendanceRate || 99.2}%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1 font-medium">المهام المنجزة</span>
              <span className="text-xl font-black text-white tabular-nums">{completedTasksCount} / {tasks.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-rose-200 block mb-1 font-medium">الدروس المكتملة</span>
              <span className="text-xl font-black text-white tabular-nums">{completedLessonsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Task Manager & Academic Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Real Student Task Manager & Continue Lessons */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Real Student Task Manager */}
          <StudentTaskManager
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />

          {/* Continue Watching Educational Lessons */}
          <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">متابعة شروحات المناهج</h3>
                <p className="text-xs text-slate-500 dark:text-stone-400">استكمل دروسك التعليمية واحفظ نقاط تقدمك تلقائياً</p>
              </div>
              <button
                onClick={() => onNavigateTab('videos')}
                className="text-xs text-[#800020] dark:text-rose-400 hover:text-[#9e1336] dark:hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                تصفح مكتبة الدروس
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="p-6 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 text-center text-slate-500 dark:text-stone-400 text-xs">
                لم يتم إضافة شروحات بعد من قبل المعلمين. فور إضافة المعلم لدرس أو صورة توضيحية ستظهر هنا لمتابعتها.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lessons.slice(0, 2).map((lesson) => {
                  const prog = progressList.find(p => p.lessonId === lesson.id);
                  const pct = prog ? prog.progressPct : 0;

                  return (
                    <div
                      key={lesson.id}
                      className="group bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 hover:border-[#800020]/40 dark:hover:border-rose-600/40 rounded-xl overflow-hidden transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-stone-200 dark:bg-stone-900">
                        {lesson.mediaType === 'image' ? (
                          <img
                            src={lesson.mediaData || lesson.thumbnail}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-black flex items-center justify-center text-rose-400">
                            <Play className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[11px] font-mono bg-black/70 backdrop-blur px-2 py-0.5 rounded text-white">
                            {lesson.duration}
                          </span>
                        </div>
                        <button
                          onClick={() => onOpenLesson(lesson.id)}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div className="text-[11px] text-[#800020] dark:text-rose-400 font-bold">
                          {lesson.subject}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
                          {lesson.title}
                        </h4>

                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-stone-400 font-medium">
                            <span>نسبة الإتمام</span>
                            <span className="font-bold text-slate-800 dark:text-stone-200">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-[#800020] dark:bg-rose-600'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Academic Subject Progress & Streak */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Subject Performance Breakdown */}
          <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">أداء المواد الدراسية</h3>
              <p className="text-xs text-slate-500 dark:text-stone-400">معدل الإتقان والدرجات لكل مادة في My School</p>
            </div>

            <div className="space-y-3 pt-1">
              {subjectPerformance.map((subj) => (
                <div key={subj.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-stone-200">{subj.name}</span>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-stone-400 font-medium text-[11px]">
                      <span>{subj.hours}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{subj.trend}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">{subj.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subj.score}%`, backgroundColor: subj.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Curve SVG in Burgundy */}
            <div className="pt-4 border-t border-[#7d0d2b]/15 dark:border-rose-900/30">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-slate-500 dark:text-stone-400 font-medium">منحنى التطور الأسبوعي</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  أعلى من المعدل بـ 12%
                </span>
              </div>
              <div className="w-full h-16 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 60">
                  <path
                    d="M 0,50 Q 100,35 200,25 T 400,10"
                    fill="none"
                    stroke="#800020"
                    strokeWidth="2.5"
                  />
                  <circle cx="0" cy="50" r="3.5" fill="#800020" />
                  <circle cx="100" cy="35" r="3.5" fill="#991136" />
                  <circle cx="200" cy="25" r="4" fill="#690923" />
                  <circle cx="300" cy="18" r="3.5" fill="#800020" />
                  <circle cx="400" cy="10" r="4" fill="#16a34a" />
                </svg>
              </div>
            </div>
          </div>

          {/* Social Peers Teaser */}
          <div className="bg-gradient-to-br from-rose-50/50 via-white to-rose-50/20 dark:from-[#1b1c26] dark:via-[#14151b] dark:to-[#1a050e] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                شبكة زملاء الصف
              </h3>
              <button
                onClick={() => onNavigateTab('friends')}
                className="text-xs text-[#800020] dark:text-rose-400 hover:text-[#9e1336] dark:hover:text-rose-300 font-bold cursor-pointer"
              >
                تصفح الزملاء
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed">
              تواصل مع زملائك، أرسل طلبات صداقة، وتدربوا سوياً على أسئلة اختبارات المواد في My School.
            </p>
            <button
              onClick={() => onNavigateTab('friends')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold transition-all shadow-md shadow-[#800020]/20 cursor-pointer"
            >
              إضافة صديق جديد +
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

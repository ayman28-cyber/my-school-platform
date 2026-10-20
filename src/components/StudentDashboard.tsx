import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Clock, 
  Play, 
  Sparkles,
  ChevronLeft,
  Flame,
  FileCheck2,
  Users,
  GraduationCap
} from 'lucide-react';
import { User, VideoLesson, StudentProgress, StudentTask, SubjectCategory } from '../types';
import { StudentTaskManager } from './StudentTaskManager';

interface StudentDashboardProps {
  user: User;
  lessons: VideoLesson[];
  progressList: StudentProgress[];
  tasks: StudentTask[];
  onAddTask: (task: {
    title: string;
    subject: SubjectCategory;
    dueDate: string;
    priority: 'عاجل' | 'متوسط' | 'عادي';
    notes?: string;
  }) => Promise<void>;
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: 'videos' | 'news' | 'friends') => void;
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
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const completedLessonsCount = progressList.filter(p => p.completed).length;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  const subjectPerformance = [
    { name: 'الفيزياء', score: 98, color: '#d97706', hours: '6.5 ساعة', trend: '+4%' },
    { name: 'البرمجة', score: 96, color: '#ca8a04', hours: '8.2 ساعات', trend: '+6%' },
    { name: 'الرياضيات', score: 94, color: '#b45309', hours: '7.0 ساعات', trend: '+3%' },
    { name: 'الكيمياء', score: 92, color: '#f59e0b', hours: '5.0 ساعات', trend: '+2%' },
    { name: 'اللغة العربية', score: 95, color: '#eab308', hours: '4.5 ساعات', trend: '+1%' },
    { name: 'اللغة الإنجليزية', score: 93, color: '#78350f', hours: '5.2 ساعات', trend: '+3%' },
    { name: 'التاريخ', score: 91, color: '#92400e', hours: '3.8 ساعات', trend: '+2%' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner in White & Gold Luxury */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white p-6 sm:p-8 shadow-lg shadow-amber-900/10">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-amber-100 font-bold bg-black/10 backdrop-blur-xs px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>منصة My School الأكاديمية الذكية</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold">{user.gradeOrSubject} · شعبة {user.schoolClass || '1/1'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              أهلاً وسهلاً بك، {user.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">
              أداؤك الأكاديمي رائع ومتميز! لديك اليوم {tasks.filter(t => !t.completed).length} مهام قيد الإنجاز في جدولك الشخصي، و{completedLessonsCount} دروس مكتملة.
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-amber-100">
              <span className="font-bold text-white">الأوسمة المسجلة:</span>
              {user.badges?.map((badge, idx) => (
                <span key={idx} className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1 font-medium">المعدل التراكمي</span>
              <span className="text-xl font-black text-white tabular-nums">{user.stats?.gpa || 98.4}%</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1 font-medium">نسبة الحضور</span>
              <span className="text-xl font-black text-white tabular-nums">{user.stats?.attendanceRate || 99.2}%</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1 font-medium">المهام المنجزة</span>
              <span className="text-xl font-black text-white tabular-nums">{completedTasksCount} / {tasks.length}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
              <span className="text-[11px] text-amber-100 block mb-1 font-medium">الدروس المكتملة</span>
              <span className="text-xl font-black text-white tabular-nums">{completedLessonsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Task Manager & Academic Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Real Student Task Manager & Continue Lessons */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Real Student Task Manager (User adds their own real tasks!) */}
          <StudentTaskManager
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />

          {/* Continue Watching Educational Lessons */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">متابعة شروحات المناهج</h3>
                <p className="text-xs text-slate-500">استكمل دروسك التعليمية واحفظ نقاط تقدمك تلقائياً</p>
              </div>
              <button
                onClick={() => onNavigateTab('videos')}
                className="text-xs text-amber-700 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                تصفح مكتبة الدروس
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center text-slate-500 text-xs">
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
                      className="group bg-stone-50 border border-stone-200 hover:border-amber-300 rounded-xl overflow-hidden transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-stone-200">
                        {lesson.mediaType === 'image' ? (
                          <img
                            src={lesson.mediaData || lesson.thumbnail}
                            alt={lesson.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-900 flex items-center justify-center text-amber-400">
                            <Play className="w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[11px] font-mono bg-black/60 backdrop-blur px-2 py-0.5 rounded text-white">
                            {lesson.duration}
                          </span>
                        </div>
                        <button
                          onClick={() => onOpenLesson(lesson.id)}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div className="text-[11px] text-amber-800 font-bold">
                          {lesson.subject} · {lesson.teacherName}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                          {lesson.title}
                        </h4>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
                            <span>نسبة المشاهدة</span>
                            <span className="font-bold text-slate-800">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
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
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">أداء المواد الدراسية</h3>
              <p className="text-xs text-slate-500">معدل الإتقان والدرجات لكل مادة في My School</p>
            </div>

            <div className="space-y-3 pt-1">
              {subjectPerformance.map((subj) => (
                <div key={subj.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{subj.name}</span>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
                      <span>{subj.hours}</span>
                      <span className="text-emerald-600 font-bold">{subj.trend}</span>
                      <span className="font-extrabold text-slate-900 tabular-nums">{subj.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subj.score}%`, backgroundColor: subj.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Curve SVG */}
            <div className="pt-4 border-t border-amber-100">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-slate-500 font-medium">منحنى التطور الأسبوعي</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  أعلى من المعدل بـ 12%
                </span>
              </div>
              <div className="w-full h-16 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 60">
                  <path
                    d="M 0,50 Q 100,35 200,25 T 400,10"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                  />
                  <circle cx="0" cy="50" r="3.5" fill="#d97706" />
                  <circle cx="100" cy="35" r="3.5" fill="#d97706" />
                  <circle cx="200" cy="25" r="4" fill="#ca8a04" />
                  <circle cx="300" cy="18" r="3.5" fill="#d97706" />
                  <circle cx="400" cy="10" r="4" fill="#16a34a" />
                </svg>
              </div>
            </div>
          </div>

          {/* Social Peers Teaser */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                شبكة زملاء الصف
              </h3>
              <button
                onClick={() => onNavigateTab('friends')}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold"
              >
                تصفح الزملاء
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تواصل مع زملائك، أرسل طلبات صداقة، وتدربوا سوياً على أسئلة اختبارات المواد في My School.
            </p>
            <button
              onClick={() => onNavigateTab('friends')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer"
            >
              إضافة صديق جديد +
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

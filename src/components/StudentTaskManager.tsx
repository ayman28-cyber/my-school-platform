import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  BookOpen
} from 'lucide-react';
import { StudentTask, SubjectCategory } from '../types';

interface StudentTaskManagerProps {
  tasks: StudentTask[];
  onAddTask: (taskData: {
    title: string;
    subject: SubjectCategory;
    dueDate: string;
    priority: 'عاجل' | 'متوسط' | 'عادي';
    notes?: string;
  }) => Promise<void> | void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const SUBJECT_OPTIONS: SubjectCategory[] = [
  'الفيزياء',
  'الكيمياء',
  'الرياضيات',
  'البرمجة',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'التاريخ'
];

export const StudentTaskManager: React.FC<StudentTaskManagerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [filterState, setFilterState] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('الفيزياء');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'عاجل' | 'متوسط' | 'عادي'>('متوسط');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const completedCount = tasks.filter(t => t.completed).length;

  const filteredTasks = tasks.filter(t => {
    if (filterState === 'pending') return !t.completed;
    if (filterState === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: title.trim(),
        subject,
        dueDate: dueDate.trim() || 'اليوم',
        priority,
        notes: notes.trim() || undefined
      });

      const taskTitle = title.trim();
      setTitle('');
      setNotes('');
      setDueDate('');
      setShowAddModal(false);
      setSuccessBanner(`تمت إضافة المهمة «${taskTitle}» وحفظها بنجاح في قاعدة بيانات المدرسة!`);
      setTimeout(() => setSuccessBanner(null), 3500);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-sm space-y-5 transition-colors">
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#7d0d2b]/15 dark:border-rose-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              قائمة مهامي المدرسية الشخصية
            </h3>
            <span className="text-xs font-bold text-[#800020] dark:text-rose-300 bg-rose-50 dark:bg-[#20040c] border border-[#800020]/25 dark:border-rose-500/30 px-2 py-0.5 rounded-full">
              {completedCount} من {tasks.length} منجز
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
            أنت من يتحكم ويضيف مهامك الدراسية واختباراتك لتنظيم جدولك الشخصي
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter segment */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-[#1d1f27] rounded-xl text-xs font-medium border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setFilterState('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterState === 'all' 
                  ? 'bg-white dark:bg-[#262835] text-[#800020] dark:text-rose-300 shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-stone-400'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterState('pending')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterState === 'pending' 
                  ? 'bg-white dark:bg-[#262835] text-[#800020] dark:text-rose-300 shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-stone-400'
              }`}
            >
              قيد العمل
            </button>
            <button
              onClick={() => setFilterState('completed')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterState === 'completed' 
                  ? 'bg-white dark:bg-[#262835] text-[#800020] dark:text-rose-300 shadow-xs font-bold' 
                  : 'text-slate-600 dark:text-stone-400'
              }`}
            >
              المكتملة
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-rose-300" />
            إضافة مهمة جديدة
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 dark:text-stone-500 space-y-2">
          <BookOpen className="w-8 h-8 text-rose-300/60 dark:text-rose-500/40 mx-auto" />
          <p className="text-xs">لا توجد مهام في هذا التصنيف. أضف مهامك الجديدة لتنظيم يومك الدراسي!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                task.completed
                  ? 'bg-stone-50 dark:bg-[#181922] border-stone-200 dark:border-stone-800 opacity-75'
                  : 'bg-white dark:bg-[#1a1b24] border-stone-200 dark:border-stone-800 hover:border-[#800020]/40 dark:hover:border-rose-500/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-[#800020] dark:text-rose-400 hover:text-[#991136] transition-colors cursor-pointer shrink-0"
                  title={task.completed ? 'تحديد كغير مكتملة' : 'إتمام المهمة'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600 hover:text-[#800020] dark:hover:text-rose-400" />
                  )}
                </button>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="font-bold text-[#800020] dark:text-rose-300 bg-rose-50 dark:bg-[#20040c] border border-[#800020]/25 dark:border-rose-500/30 px-2 py-0.5 rounded">
                      {task.subject}
                    </span>
                    <span className="text-slate-400 dark:text-stone-600">·</span>
                    <span className="text-slate-500 dark:text-stone-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#800020] dark:text-rose-400" />
                      {task.dueDate}
                    </span>
                    {task.priority === 'عاجل' && (
                      <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded text-[10px]">
                        عاجل
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug ${
                    task.completed ? 'line-through text-slate-400 dark:text-stone-500' : ''
                  }`}>
                    {task.title}
                  </h4>

                  {task.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-stone-400 leading-relaxed">
                      {task.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-stone-300 dark:text-stone-600 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                title="حذف المهمة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14151b] border border-stone-200 dark:border-[#7d0d2b]/40 rounded-3xl max-w-md w-full p-6 space-y-4 text-right shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#7d0d2b]/15 dark:border-rose-900/30">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                إضافة مهمة دراسية جديدة
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-stone-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">عنوان المهمة الدراسية</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تلخيص درس الكيمياء العضوية وحل المسائل"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1d1f28] border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#800020] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">المادة</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                    className="w-full bg-stone-50 dark:bg-[#1d1f28] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#800020]"
                  >
                    {SUBJECT_OPTIONS.map(subj => (
                      <option key={subj} value={subj} className="bg-white dark:bg-[#1d1f28] text-slate-900 dark:text-white">{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">الأولوية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-stone-50 dark:bg-[#1d1f28] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#800020]"
                  >
                    <option value="عاجل" className="bg-white dark:bg-[#1d1f28] text-slate-900 dark:text-white">عاجل</option>
                    <option value="متوسط" className="bg-white dark:bg-[#1d1f28] text-slate-900 dark:text-white">متوسط</option>
                    <option value="عادي" className="bg-white dark:bg-[#1d1f28] text-slate-900 dark:text-white">عادي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">موعد التسليم / الإنجاز</label>
                <input
                  type="text"
                  placeholder="مثال: غداً 08:00 م أو الأحد القادم"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1d1f28] border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-stone-300 font-bold mb-1">ملاحظات إضافية (اختياري)</label>
                <textarea
                  rows={2}
                  placeholder="أي مراجع أو تفاصيل تريد تذكرها..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1d1f28] border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 font-medium cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] disabled:opacity-50 text-white font-bold shadow-md shadow-[#800020]/20 cursor-pointer"
                >
                  {isSubmitting ? 'جارٍ الحفظ في السيرفر...' : 'حفظ المهمة في قائمتي'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

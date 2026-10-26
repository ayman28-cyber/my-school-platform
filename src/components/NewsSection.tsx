import React, { useState } from 'react';
import { 
  Newspaper, 
  Heart, 
  MessageSquare, 
  Send, 
  PlusCircle, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { NewsItem, User as UserModel, SubjectCategory } from '../types';
import { UserAvatar } from './UserAvatar';

interface NewsSectionProps {
  newsList: NewsItem[];
  currentUser: UserModel;
  onLike: (newsId: string) => void;
  onAddComment: (newsId: string, text: string) => void;
  onPublishNews: (newsData: Partial<NewsItem>) => Promise<{ success: boolean; error?: string }>;
}

const NEWS_CATEGORIES = [
  'all',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'التاريخ',
  'البرمجة',
  'الكيمياء',
  'الفيزياء',
  'الرياضيات'
];

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsList,
  currentUser,
  onLike,
  onAddComment,
  onPublishNews
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<SubjectCategory>('الفيزياء');
  const [publishFeedback, setPublishFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  const isTeacher = currentUser.role === 'teacher';

  const filteredNews = newsList.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCommentSubmit = (newsId: string) => {
    const text = commentInputs[newsId]?.trim();
    if (!text) return;
    onAddComment(newsId, text);
    setCommentInputs(prev => ({ ...prev, [newsId]: '' }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    if (!isTeacher) {
      setPublishFeedback({ msg: 'عذراً، نشر الأخبار مسموح للمعلمين فقط.', isError: true });
      return;
    }

    const res = await onPublishNews({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      author: currentUser.name,
      authorId: currentUser.id,
      authorRole: currentUser.gradeOrSubject || 'معلم المادة',
      tags: [newCategory, 'My_School']
    });

    if (res.success) {
      setNewTitle('');
      setNewContent('');
      setShowCreateModal(false);
      setPublishFeedback({ msg: 'تم نشر الخبر بنجاح في قسم ' + newCategory, isError: false });
      setTimeout(() => setPublishFeedback(null), 3000);
    } else {
      setPublishFeedback({ msg: res.error || 'حدث خطأ أثناء النشر', isError: true });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#7d0d2b]/20 dark:border-rose-900/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-[#800020] dark:text-rose-400" />
              أخبار المواد والأنشطة الأكاديمية
            </h2>
            <span className="text-[11px] font-bold text-[#800020] dark:text-rose-300 bg-rose-50 dark:bg-[#20040c] border border-[#800020]/25 dark:border-rose-500/30 px-2 py-0.5 rounded-full">
              My School
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-stone-400 mt-1">
            إعلانات المواد الدراسية مقسمة حسب التخصص، مع تمكين المعلمين فقط من النشر والتفاعل التام للطلاب
          </p>
        </div>

        {/* Action Button: Teacher vs Student */}
        <div className="flex items-center gap-3">
          {isTeacher ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-md shadow-[#800020]/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-rose-300" />
              نشر خبر جديد كمعلم
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-[#20040c] border border-[#800020]/25 dark:border-rose-500/30 text-[#800020] dark:text-rose-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-[#800020] dark:text-rose-400" />
              <span>نشر الأخبار مقتصر على المعلمين</span>
            </div>
          )}
        </div>
      </div>

      {publishFeedback && (
        <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn ${
          publishFeedback.isError
            ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            : 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
        }`}>
          <span>{publishFeedback.msg}</span>
          {publishFeedback.isError ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl overflow-x-auto text-xs shadow-2xs transition-colors">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-bold cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-md shadow-[#800020]/20'
                : 'text-slate-600 dark:text-stone-300 hover:text-[#800020] dark:hover:text-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
            }`}
          >
            {cat === 'all' ? 'جميع المواد' : `أخبار ${cat}`}
          </button>
        ))}
      </div>

      {/* News Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {filteredNews.length === 0 ? (
            <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-3xl p-12 text-center text-slate-500 dark:text-stone-400 space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-[#20040c] border border-[#800020]/25 dark:border-rose-500/30 text-[#800020] dark:text-rose-400 flex items-center justify-center mx-auto">
                <Newspaper className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  لا توجد أخبار منشورة حالياً في {selectedCategory === 'all' ? 'المنصة' : `مادة ${selectedCategory}`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
                  {isTeacher
                    ? `بصفتك معلماً، يمكنك الآن نشر أول خبر أو تعميم دراسي لطلابك في مادة ${selectedCategory === 'all' ? 'تخصصك' : selectedCategory}.`
                    : `لم يقم المعلم بنشر إعلانات في مادة ${selectedCategory === 'all' ? 'المنصة' : selectedCategory} بعد. ستظهر هنا فور نشرها.`}
                </p>
              </div>

              {isTeacher && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-md shadow-[#800020]/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-rose-300" />
                  نشر أول خبر الآن
                </button>
              )}
            </div>
          ) : (
            filteredNews.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl overflow-hidden shadow-xs hover:border-[#800020]/40 dark:hover:border-rose-600/40 transition-all flex flex-col justify-between"
              >
                {post.imageUrl && (
                  <div className="aspect-[21/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  {/* Clean Metadata with Letter Avatar */}
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-stone-400 font-medium">
                    <UserAvatar
                      name={post.author}
                      role="teacher"
                      size="xs"
                    />
                    <span className="text-[#800020] dark:text-rose-400 font-bold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-slate-800 dark:text-stone-200">{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Clean Tags */}
                  {post.tags && (
                    <div className="flex items-center gap-2 text-xs text-[#800020] dark:text-rose-400 pt-1 font-semibold">
                      {post.tags.map((tag, i) => (
                        <span key={i}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interaction Footer */}
                <div className="px-6 py-3.5 bg-stone-50/70 dark:bg-[#181922] border-t border-[#7d0d2b]/15 dark:border-rose-900/30 flex items-center justify-between text-xs text-slate-500 dark:text-stone-400">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => onLike(post.id)}
                      className="flex items-center gap-1.5 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-bold cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span className="tabular-nums">{post.likes}</span>
                      <span className="hidden sm:inline">إعجاب</span>
                    </button>

                    <button
                      onClick={() => setOpenCommentsId(openCommentsId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 hover:text-[#800020] dark:hover:text-rose-400 transition-colors font-bold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#800020] dark:text-rose-400" />
                      <span className="tabular-nums">{post.comments.length}</span>
                      <span className="hidden sm:inline">تعليقات</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-[#800020] dark:text-rose-400 font-bold">
                    {post.authorRole}
                  </span>
                </div>

                {/* Collapsible Comments with Letter Avatars */}
                {openCommentsId === post.id && (
                  <div className="p-6 bg-stone-50 dark:bg-[#181922] border-t border-[#7d0d2b]/15 dark:border-rose-900/30 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-stone-200">
                      مناقشات الطلاب والأساتذة ({post.comments.length})
                    </h4>

                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-stone-400">لا توجد تعليقات بعد. اكتب أول تعليق على هذا الإعلان!</p>
                    ) : (
                      <div className="space-y-2.5">
                        {post.comments.map((c) => (
                          <div key={c.id} className="p-3 rounded-xl bg-white dark:bg-[#20212c] border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserAvatar
                                  name={c.userName}
                                  size="xs"
                                />
                                <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 dark:text-stone-500 font-mono">{c.date}</span>
                            </div>
                            <p className="text-slate-600 dark:text-stone-300 leading-relaxed pr-7">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="أضف تعليقك أو استفسارك هنا..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                        className="flex-1 bg-white dark:bg-[#20212c] border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#800020]"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#14151b] border border-[#7d0d2b]/20 dark:border-rose-900/30 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#800020] dark:text-rose-400" />
              التقويم المدرسي لمواد My School
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span className="text-[#800020] dark:text-rose-400 font-bold block">قسم البرمجة والحاسب</span>
                <span className="text-slate-700 dark:text-stone-300">ورشة تطوير التطبيقات والذكاء الاصطناعي الأربعاء القادم</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span className="text-[#800020] dark:text-rose-400 font-bold block">قسم الفيزياء والكيمياء</span>
                <span className="text-slate-700 dark:text-stone-300">التجارب المعملية المركزية للأسبوع الثاني</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1a1b24] border border-stone-200 dark:border-stone-800 space-y-0.5">
                <span className="text-[#800020] dark:text-rose-400 font-bold block">قسم اللغة العربية والإنجليزية</span>
                <span className="text-slate-700 dark:text-stone-300">مسابقة المناظرات اللغوية والإلقاء</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-[#1c070e] border border-[#7d0d2b]/25 dark:border-rose-900/40 rounded-2xl p-6 space-y-2 text-xs text-slate-600 dark:text-stone-300 transition-colors">
            <h4 className="font-extrabold text-[#800020] dark:text-rose-300">سياسة النشر في My School</h4>
            <p className="leading-relaxed">
              حرصاً على مصداقية المحتوى الأكاديمي، تُمنح صلاحية نشر الأخبار والتعاميم للمعلمين المعتمدين وإدارة المدرسة فقط، بينما يتمتع الطلاب بحرية النقاش وطرح التساؤلات.
            </p>
          </div>
        </div>

      </div>

      {/* Teacher Publish News Modal in Burgundy & Black */}
      {showCreateModal && isTeacher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#7d0d2b]/30 rounded-3xl max-w-lg w-full p-6 space-y-4 text-right shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#7d0d2b]/15">
              <h3 className="text-base font-extrabold text-slate-900">نشر خبر أو إعلان مادة جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الخبر</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: موعد اختبار الرياضيات التجريبي للفصل الأول"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#800020] font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المادة الدراسية المستهدفة</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SubjectCategory)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#800020]"
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
                <label className="block text-slate-700 font-bold mb-1">تفاصيل ومحتوى الخبر</label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب التوجيهات، المواعيد، أو المراجع للطلاب..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#800020] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white font-bold shadow-md shadow-[#800020]/25 cursor-pointer"
                >
                  نشر في أخبار My School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

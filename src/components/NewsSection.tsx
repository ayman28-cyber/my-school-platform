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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-amber-600" />
              أخبار المواد والأنشطة الأكاديمية
            </h2>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              My School
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إعلانات المواد الدراسية مقسمة حسب التخصص، مع تمكين المعلمين فقط من النشر والتفاعل التام للطلاب
          </p>
        </div>

        {/* Action Button: Teacher vs Student */}
        <div className="flex items-center gap-3">
          {isTeacher ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              نشر خبر جديد كمعلم
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>نشر الأخبار مقتصر على المعلمين</span>
            </div>
          )}
        </div>
      </div>

      {publishFeedback && (
        <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn ${
          publishFeedback.isError
            ? 'bg-rose-50 border border-rose-300 text-rose-800'
            : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
        }`}>
          <span>{publishFeedback.msg}</span>
          {publishFeedback.isError ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        </div>
      )}

      {/* Categories Bar (Requested 7 Subject Categories) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-amber-200/80 rounded-2xl overflow-x-auto text-xs shadow-2xs">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-bold cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/50'
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
            <div className="bg-white border border-amber-200/80 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Newspaper className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  لا توجد أخبار منشورة حالياً في {selectedCategory === 'all' ? 'المنصة' : `مادة ${selectedCategory}`}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isTeacher
                    ? `بصفتك معلماً، يمكنك الآن نشر أول خبر أو تعميم دراسي لطلابك في مادة ${selectedCategory === 'all' ? 'تخصصك' : selectedCategory}.`
                    : `لم يقم المعلم بنشر إعلانات في مادة ${selectedCategory === 'all' ? 'المنصة' : selectedCategory} بعد. ستظهر هنا فور نشرها.`}
                </p>
              </div>

              {isTeacher && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white text-xs font-bold shadow-md shadow-amber-600/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  نشر أول خبر الآن
                </button>
              )}
            </div>
          ) : (
            filteredNews.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-amber-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                {post.imageUrl && (
                  <div className="aspect-[21/9] w-full overflow-hidden bg-stone-100">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  {/* Clean Metadata without Pills */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-amber-800 font-bold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Clean Tags */}
                  {post.tags && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 pt-1">
                      {post.tags.map((tag, i) => (
                        <span key={i}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interaction Footer */}
                <div className="px-6 py-3.5 bg-stone-50/70 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => onLike(post.id)}
                      className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-bold cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span className="tabular-nums">{post.likes}</span>
                      <span className="hidden sm:inline">إعجاب</span>
                    </button>

                    <button
                      onClick={() => setOpenCommentsId(openCommentsId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 hover:text-amber-700 transition-colors font-bold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      <span className="tabular-nums">{post.comments.length}</span>
                      <span className="hidden sm:inline">تعليقات</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-amber-800 font-bold">
                    {post.authorRole}
                  </span>
                </div>

                {/* Collapsible Comments */}
                {openCommentsId === post.id && (
                  <div className="p-6 bg-stone-50 border-t border-amber-100 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-bold text-slate-800">
                      مناقشات الطلاب والأساتذة ({post.comments.length})
                    </h4>

                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-500">لا توجد تعليقات بعد. اكتب أول تعليق على هذا الإعلان!</p>
                    ) : (
                      <div className="space-y-2.5">
                        {post.comments.map((c) => (
                          <div key={c.id} className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{c.userName}</span>
                              <span className="text-[10px] text-slate-400">{c.date}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{c.text}</p>
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
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
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
          <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              التقويم المدرسي لمواد My School
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
                <span className="text-amber-800 font-bold block">قسم البرمجة والحاسب</span>
                <span className="text-slate-700">ورشة تطوير التطبيقات والذكاء الاصطناعي الأربعاء القادم</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
                <span className="text-amber-800 font-bold block">قسم الفيزياء والكيمياء</span>
                <span className="text-slate-700">التجارب المعملية المركزية للأسبوع الثاني</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5">
                <span className="text-amber-800 font-bold block">قسم اللغة العربية والإنجليزية</span>
                <span className="text-slate-700">مسابقة المناظرات اللغوية والإلقاء</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-2 text-xs text-slate-600">
            <h4 className="font-extrabold text-amber-900">سياسة النشر في My School</h4>
            <p className="leading-relaxed">
              حرصاً على مصداقية المحتوى الأكاديمي، تُمنح صلاحية نشر الأخبار والتعاميم للمعلمين المعتمدين وإدارة المدرسة فقط، بينما يتمتع الطلاب بحرية النقاش وطرح التساؤلات.
            </p>
          </div>
        </div>

      </div>

      {/* Teacher Publish News Modal */}
      {showCreateModal && isTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-right shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="text-base font-extrabold text-slate-900">نشر خبر أو إعلان مادة جديد</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
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
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المادة الدراسية المستهدفة</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SubjectCategory)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
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
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/20"
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

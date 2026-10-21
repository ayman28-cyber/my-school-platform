import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Plus, 
  FileText, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { VideoLesson, StudentProgress, User, SubjectCategory } from '../types';
import { UserAvatar } from './UserAvatar';

interface VideoLibraryProps {
  videos: VideoLesson[];
  progressList: StudentProgress[];
  currentUser: User;
  activeLessonId?: string | null;
  onSaveProgress: (lessonId: string, progressPct: number, completed: boolean, notes: string) => Promise<void>;
  onPublishVideo: (videoData: Partial<VideoLesson>) => Promise<{ success: boolean; error?: string }>;
  onCommentOnVideo?: (videoId: string, text: string) => Promise<void>;
}

const SUBJECT_FILTERS: Array<string> = [
  'all',
  'الفيزياء',
  'البرمجة',
  'الكيمياء',
  'الرياضيات',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'التاريخ'
];

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  videos,
  progressList,
  currentUser,
  activeLessonId,
  onSaveProgress,
  onPublishVideo,
  onCommentOnVideo
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Filter videos by subject
  const filteredVideos = videos.filter(v => {
    if (selectedSubject === 'all') return true;
    return v.subject === selectedSubject;
  });

  const [currentVideo, setCurrentVideo] = useState<VideoLesson | null>(() => {
    if (activeLessonId) {
      const found = videos.find(v => v.id === activeLessonId);
      if (found) return found;
    }
    return videos.length > 0 ? videos[0] : null;
  });

  // Track progress and notes for current selected lesson
  const [currentProgressPct, setCurrentProgressPct] = useState<number>(0);
  const [notesText, setNotesText] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Comments state
  const [commentInput, setCommentInput] = useState('');

  // New lesson form
  const [contentType, setContentType] = useState<'video' | 'image'>('video');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectCategory>(
    (selectedSubject !== 'all' ? selectedSubject : 'الفيزياء') as SubjectCategory
  );
  const [newDuration, setNewDuration] = useState('15:00');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [fileUploadPreview, setFileUploadPreview] = useState<string>('');

  const isTeacher = currentUser.role === 'teacher';

  // Update current video when activeLessonId changes or videos change
  React.useEffect(() => {
    if (activeLessonId) {
      const found = videos.find(v => v.id === activeLessonId);
      if (found) {
        handleSelectVideo(found);
        return;
      }
    }
    if (filteredVideos.length > 0 && (!currentVideo || !filteredVideos.find(v => v.id === currentVideo.id))) {
      handleSelectVideo(filteredVideos[0]);
    } else if (filteredVideos.length === 0) {
      setCurrentVideo(null);
    }
  }, [selectedSubject, videos, activeLessonId]);

  const handleSelectVideo = (video: VideoLesson) => {
    setCurrentVideo(video);
    const existing = progressList.find(p => p.lessonId === video.id);
    setCurrentProgressPct(existing ? existing.progressPct : 0);
    setNotesText(existing ? existing.notes : '');
    setIsCompleted(existing ? existing.completed : false);
  };

  const handleSaveProgress = async (pct: number, done: boolean) => {
    if (!currentVideo) return;
    setCurrentProgressPct(pct);
    setIsCompleted(done);
    await onSaveProgress(currentVideo.id, pct, done, notesText);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileUploadPreview(reader.result as string);
        setNewMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onPublishVideo({
      title: newTitle.trim(),
      subject: newSubject,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      duration: contentType === 'video' ? newDuration : 'صورة تعليمية',
      mediaType: contentType,
      videoUrl: contentType === 'video' ? (newMediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4') : '',
      mediaData: contentType === 'image' ? (fileUploadPreview || newMediaUrl) : '',
      thumbnail: contentType === 'image' ? (fileUploadPreview || newMediaUrl) : '',
      description: newDescription.trim() || 'محتوى تعليمي أضيف بواسطة المعلم داخل مادته.'
    });

    setNewTitle('');
    setNewDescription('');
    setNewMediaUrl('');
    setFileUploadPreview('');
    setShowPublishModal(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVideo || !commentInput.trim() || !onCommentOnVideo) return;
    await onCommentOnVideo(currentVideo.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#7d0d2b]/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#800020]" />
              مكتبة الدروس والوسائط التعليمية
            </h2>
            <span className="text-[11px] font-bold text-[#800020] bg-rose-50 border border-[#800020]/25 px-2 py-0.5 rounded-full">
              My School
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            شروحات مرئية وصور تعليمية ينشرها المعلمون لطلابهم داخل كل مادة مباشرة
          </p>
        </div>

        {/* Action Button: Teachers can publish */}
        <div className="flex items-center gap-3">
          {isTeacher ? (
            <button
              onClick={() => {
                if (selectedSubject !== 'all') {
                  setNewSubject(selectedSubject as SubjectCategory);
                }
                setShowPublishModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-md shadow-[#800020]/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-rose-300" />
              إضافة فيديو أو صورة لمادتي
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-[#800020]/25 text-[#800020] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
              <span>متابعة الشروحات وحفظ التقدم</span>
            </div>
          )}
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between font-bold animate-fadeIn">
          <span>تم حفظ تقدمك وملاحظاتك بنجاح في قاعدة بيانات My School!</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Subject Filter Bar in Burgundy & Black */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#7d0d2b]/20 rounded-2xl overflow-x-auto text-xs shadow-2xs">
        {SUBJECT_FILTERS.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-bold cursor-pointer ${
              selectedSubject === subj
                ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-md shadow-[#800020]/20'
                : 'text-slate-600 hover:text-[#800020] hover:bg-rose-50/50'
            }`}
          >
            {subj === 'all' ? 'جميع المواد' : subj}
          </button>
        ))}
      </div>

      {/* Empty State when no lessons are uploaded yet */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white border border-[#7d0d2b]/20 rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-[#800020]/25 text-[#800020] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              لا توجد دروس أو فيديوهات مضافة بعد في {selectedSubject === 'all' ? 'المكتبة' : `مادة ${selectedSubject}`}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isTeacher
                ? `بصفتك معلماً، يمكنك الآن رفع أول فيديو تعليمي أو صورة توضيحية لطلابك في مادة ${selectedSubject === 'all' ? 'تخصصك' : selectedSubject}.`
                : `لم يقم المعلم بنشر شروحات أو وسائط في مادة ${selectedSubject === 'all' ? 'الدروس' : selectedSubject} بعد. ستظهر هنا فور إضافتها.`}
            </p>
          </div>

          {isTeacher && (
            <button
              onClick={() => {
                if (selectedSubject !== 'all') {
                  setNewSubject(selectedSubject as SubjectCategory);
                }
                setShowPublishModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-md shadow-[#800020]/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-300" />
              رفع أول محتوى لمادتي
            </button>
          )}
        </div>
      ) : (
        /* Video Player Stage */
        currentVideo && (
          <div className="bg-white border border-[#7d0d2b]/20 rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Media Player Screen (8 cols) */}
              <div className="lg:col-span-8 bg-black flex flex-col justify-between relative">
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
                  {currentVideo.mediaType === 'image' ? (
                    <img
                      src={currentVideo.mediaData || currentVideo.thumbnail}
                      alt={currentVideo.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : currentVideo.videoUrl && currentVideo.videoUrl.startsWith('http') ? (
                    <video
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                      poster={currentVideo.thumbnail}
                      src={currentVideo.videoUrl}
                    />
                  ) : (
                    <div className="text-center p-8 space-y-3">
                      <Play className="w-16 h-16 text-rose-400 mx-auto opacity-70" />
                      <p className="text-xs text-stone-300 max-w-sm">
                        هذا الدرس معروض كنموذج تدريبي للمنهج. يمكنك تدوين ملاحظاتك بالجانب وحفظ التقدم.
                      </p>
                    </div>
                  )}

                  {/* Top Overlay Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xs px-3 py-1 rounded-full border border-rose-500/30 text-rose-300 text-xs font-bold">
                    {currentVideo.subject} · {currentVideo.mediaType === 'image' ? 'صورة توضيحية' : 'فيديو تعليمي'}
                  </div>
                </div>

                {/* Video Info Bottom Bar */}
                <div className="p-6 bg-[#0e0f13] text-white space-y-4 border-t border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-rose-400 font-bold mb-1 flex items-center gap-2">
                        <UserAvatar name={currentVideo.teacherName} role="teacher" size="xs" />
                        <span>بواسطة الأستاذ: {currentVideo.teacherName}</span>
                        <span>·</span>
                        <span>{currentVideo.duration}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {currentVideo.title}
                      </h3>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        {currentVideo.description}
                      </p>
                    </div>

                    {/* Quick Completion Button */}
                    <button
                      onClick={() => handleSaveProgress(100, true)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white border border-rose-500/40'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompleted ? 'تم إتمام الدرس بنجاح ✓' : 'وسم الدرس كمكتمل'}</span>
                    </button>
                  </div>

                  {/* Progress Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>نسبة تقدمك في هذا الدرس:</span>
                      <span className="font-bold text-rose-400">{currentProgressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          currentProgressPct === 100 ? 'bg-emerald-500' : 'bg-[#800020]'
                        }`}
                        style={{ width: `${currentProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Discussions Column (4 cols) */}
              <div className="lg:col-span-4 p-6 bg-white border-t lg:border-t-0 lg:border-r border-[#7d0d2b]/20 space-y-6 flex flex-col justify-between">
                
                {/* Real User Notes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#800020]" />
                      مفكرتي وملاحظاتي الخاصة
                    </h4>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      حفظ في السيرفر
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="دوّن استنتاجاتك أو أسئلتك حول هذا الدرس، وستُحفظ في حسابك..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#800020] leading-relaxed"
                  />
                  <button
                    onClick={() => handleSaveProgress(currentProgressPct || 50, isCompleted)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    حفظ الملاحظات في قاعدة البيانات
                  </button>
                </div>

                {/* Lesson Discussion & Comments with Letter Avatars */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#800020]" />
                    استفسارات الطلاب ومناقشة الدرس ({currentVideo.comments?.length || 0})
                  </h4>

                  <div className="max-h-36 overflow-y-auto space-y-2 text-xs">
                    {(!currentVideo.comments || currentVideo.comments.length === 0) ? (
                      <p className="text-[11px] text-slate-400 py-1">لا توجد تعليقات بعد. اطرح سؤالك للمعلم!</p>
                    ) : (
                      currentVideo.comments.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <UserAvatar name={c.userName} size="xs" />
                              <span className="font-bold text-slate-900">{c.userName}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">{c.date}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[11px] pr-6">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="اطرح استفسارك حول هذا الدرس..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#800020]"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="p-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] disabled:opacity-40 text-white transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )
      )}

      {/* Playlist Grid */}
      {filteredVideos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            الدروس المتاحة في {selectedSubject === 'all' ? 'جميع المواد' : `مادة ${selectedSubject}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const prog = progressList.find(p => p.lessonId === video.id);
              const pct = prog ? prog.progressPct : 0;
              const isSelected = currentVideo?.id === video.id;

              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className={`group cursor-pointer bg-white border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#800020] ring-2 ring-[#800020]/20 shadow-md'
                      : 'border-stone-200 hover:border-[#800020]/40 shadow-2xs'
                  }`}
                >
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    {video.mediaType === 'image' ? (
                      <img
                        src={video.mediaData || video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-10 h-10 text-rose-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[11px] font-mono text-white">
                      {video.duration}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#800020] font-bold bg-rose-50 border border-[#800020]/25 px-2 py-0.5 rounded">
                        {video.subject}
                      </span>
                      <span className="text-slate-400 font-medium">{video.teacherName}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#800020] transition-colors line-clamp-1">
                      {video.title}
                    </h4>

                    {/* Progress Indicator */}
                    <div className="space-y-1 pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>نسبة الإنجاز</span>
                        <span className="font-bold text-slate-700">{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-[#800020]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Teacher Publish Modal in Burgundy & Black */}
      {showPublishModal && isTeacher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#7d0d2b]/25 rounded-3xl max-w-lg w-full p-6 space-y-4 text-right shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#7d0d2b]/15">
              <h3 className="text-base font-extrabold text-slate-900">
                إضافة محتوى تعليمي داخل مادة {newSubject}
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
              
              {/* Type Switcher: Video or Image */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">نوع المحتوى التعليمي</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setContentType('video')}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      contentType === 'video' ? 'bg-white text-[#800020] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <VideoIcon className="w-4 h-4 text-[#800020]" />
                    <span>فيديو تعليمي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentType('image')}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      contentType === 'image' ? 'bg-white text-[#800020] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4 text-[#800020]" />
                    <span>صورة توضيحية / إنفوجرافيك</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان الدرس أو الموضوع</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شرح المفاهيم الأساسية وتطبيقاتها"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#800020] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المادة المستهدفة</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectCategory)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#800020] font-bold"
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

                {contentType === 'video' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">المدة التقديرية</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="15:00"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                )}
              </div>

              {contentType === 'video' ? (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رابط الفيديو (MP4 أو Embed)</label>
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#800020]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-bold mb-1">رفع صورة الدرس من جهازك أو الرابط</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-[#800020] hover:file:bg-rose-100"
                  />
                  {fileUploadPreview && (
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-[#7d0d2b]/20 bg-stone-100">
                      <img src={fileUploadPreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">شرح وتوجيهات للمعلم</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اكتب النقاط الرئيسية، الأهداف، أو التكليفات المرتبطة بهذا الدرس..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#800020] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white font-bold shadow-md shadow-[#800020]/25 cursor-pointer"
                >
                  نشر في مكتبة مادة {newSubject}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

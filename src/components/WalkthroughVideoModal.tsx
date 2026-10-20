import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Users2, 
  Newspaper, 
  LayoutDashboard, 
  ArrowLeft,
  Volume2,
  VolumeX,
  GraduationCap
} from 'lucide-react';
import { WalkthroughStep } from '../types';

interface WalkthroughVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'dashboard' | 'videos' | 'news' | 'friends') => void;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: 'تسجيل الدخول بالاسم وتحديد الدور (طالب / معلم)',
    subtitle: 'تجربة حقيقية بدون كلمات مرور مع ترحيب مخصص',
    description: 'يدخل المستخدم اسمه الشخصي ويحدد ما إذا كان طالباً أو معلماً، لتهيئ المنصة واجهة مخصصة وصلاحيات ملائمة.',
    targetView: 'dashboard',
    videoTime: '00:00 - 01:15',
    featureBadge: 'بوابة الدخول الذكية',
    iconName: 'GraduationCap',
    keyPoints: [
      'الدخول الفوري بالاسم بدون كلمة مرور',
      'تحديد الصف الدراسي أو التخصص التعليمي',
      'صلاحيات موجهة لكل فئة في المدرسة'
    ]
  },
  {
    id: 2,
    title: 'قائمة مهام الطالب الشخصية التفاعلية',
    subtitle: 'أنت من يحدد ويضيف مهامك الدراسية وليس عشوائياً',
    description: 'يستطيع كل طالب إضافة مهام مخصصة لكل مادة (الفيزياء، الكيمياء، البرمجة...) مع تاريخ التسليم وتحديد الأولوية وإتمامها.',
    targetView: 'dashboard',
    videoTime: '01:15 - 02:30',
    featureBadge: 'إدارة المهام الحقيقية',
    iconName: 'LayoutDashboard',
    keyPoints: [
      'إضافة وتعديل وحذف المهام الدراسية الحقيقية',
      'تحديث فوري لنسبة الإنجاز والمعدل التراكمي',
      'تصنيف حسب المواد والأولويات العاجلة'
    ]
  },
  {
    id: 3,
    title: 'أخبار المواد وصلاحيات النشر للمعلم فقط',
    subtitle: 'أخبار مقسمة للمواد السبع، والنشر محصور للمعلمين',
    description: 'تم تصنيف الأخبار إلى (اللغة العربية، الإنجليزية، التاريخ، البرمجة، الكيمياء، الفيزياء، الرياضيات). النشر حصري للمعلمين والطلاب يشاركون بالتعليقات والإعجاب.',
    targetView: 'news',
    videoTime: '02:30 - 03:45',
    featureBadge: 'أخبار المواد المقسمة',
    iconName: 'Newspaper',
    keyPoints: [
      '7 أقسام رئيسية لكافة المواد الدراسية',
      'حصر صلاحية النشر والإعلانات على المعلمين',
      'مشاركة الطلاب في المناقشات والتعليقات'
    ]
  },
  {
    id: 4,
    title: 'مكتبة الفيديوهات التعليمية وحفظ التقدم التلقائي',
    subtitle: 'مشاهدة شروحات المناهج وتدوين الملاحظات',
    description: 'مشغل دروس عالي الدقة يتيح التنقل بين الفصول وتدوين الملاحظات مع حفظ التقدم تلقائياً في قاعدة بيانات My School.',
    targetView: 'videos',
    videoTime: '03:45 - 05:00',
    featureBadge: 'التعلم المرئي وحفظ التقدم',
    iconName: 'BookOpen',
    keyPoints: [
      'فيديوهات مصنفة حسب التخصص الأكاديمي',
      'مفكرة رقمية لحفظ الملاحظات في الباك إند',
      'نشر دروس جديدة من قبل المعلمين المعتمدين'
    ]
  },
  {
    id: 5,
    title: 'شبكة الزملاء وإضافة الأصدقاء',
    subtitle: 'التواصل الأكاديمي الحقيقي بين طلاب My School',
    description: 'إمكانية البحث عن زملاء الصف، إرسال طلبات صداقة، ومشاركتهم الملاحظات عبر محادثة المذاكرة المشتركة.',
    targetView: 'friends',
    videoTime: '05:00 - 06:15',
    featureBadge: 'شبكة الأصدقاء والمذاكرة',
    iconName: 'Users2',
    keyPoints: [
      'البحث في دليل طلاب المدرسة الحقيقيين',
      'إرسال وقبول طلبات الصداقة المعلقة',
      'غرفة دردشة مباشرة لحل الواجبات والاستفسارات'
    ]
  }
];

export const WalkthroughVideoModal: React.FC<WalkthroughVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(20);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackProgress(prev => {
        if (prev >= 100) {
          setActiveStepIndex(cur => (cur + 1) % WALKTHROUGH_STEPS.length);
          return 0;
        }
        return prev + 1.2;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying, activeStepIndex]);

  if (!isOpen) return null;

  const currentStep = WALKTHROUGH_STEPS[activeStepIndex];

  const handleNext = () => {
    setActiveStepIndex(prev => Math.min(WALKTHROUGH_STEPS.length - 1, prev + 1));
    setPlaybackProgress(0);
  };

  const handlePrev = () => {
    setActiveStepIndex(prev => Math.max(0, prev - 1));
    setPlaybackProgress(0);
  };

  const handleJumpToStep = (index: number) => {
    setActiveStepIndex(index);
    setPlaybackProgress(0);
  };

  const handleTryFeatureNow = () => {
    onNavigateTab(currentStep.targetView as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col my-auto animate-fadeIn text-right">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                فيديو الشرح التفاعلي: دليلك الشامل لمنصة My School
              </h2>
              <span className="text-[11px] text-amber-800 font-medium">
                جولة موجهة بالصوت والصورة لاستكشاف كافة إمكانيات المنصة المتطورة
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-slate-700 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          
          {/* Video Stage (7 cols) */}
          <div className="lg:col-span-7 bg-black flex flex-col justify-between relative overflow-hidden">
            <div className="relative aspect-video w-full h-full min-h-[300px] flex items-center justify-center bg-slate-950">
              <img
                src="/src/assets/images/platform_tutorial_cover_1792491933699.jpg"
                alt="My School Walkthrough Cover"
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 p-6 flex flex-col justify-between">
                
                {/* HUD Top Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-200 font-bold bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-amber-500/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>فصل 0{activeStepIndex + 1}: {currentStep.featureBadge}</span>
                  </div>

                  <span className="font-mono text-xs text-stone-200 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full">
                    {currentStep.videoTime}
                  </span>
                </div>

                {/* Center Dynamic Animation Overlay */}
                <div className="flex flex-col items-center text-center space-y-3 px-4">
                  <motion.div
                    key={currentStep.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 rounded-2xl bg-amber-600/90 backdrop-blur border border-amber-300 shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                  </motion.div>

                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs text-amber-200 drop-shadow font-medium">
                      {currentStep.subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Video Controls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="text-[11px] font-mono text-stone-400">
                        {isPlaying ? 'جاري العرض التفاعلي...' : 'متوقف'}
                      </span>
                    </div>

                    <button
                      onClick={() => setPlaybackProgress(0)}
                      className="text-stone-300 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      إعادة
                    </button>
                  </div>

                  {/* Progress Bar in Gold */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-200"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Concept Deck (5 cols) in White & Gold */}
          <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-800 font-extrabold">
                  الفصل {activeStepIndex + 1} من {WALKTHROUGH_STEPS.length}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentStep.videoTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {currentStep.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {currentStep.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  النقاط الأساسية في هذا المقطع:
                </span>
                {currentStep.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters Selector */}
            <div className="space-y-2 pt-4 border-t border-amber-100">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                فصول الشرح:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {WALKTHROUGH_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => handleJumpToStep(idx)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-50 text-slate-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleTryFeatureNow}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white text-xs font-black transition-all shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>الانتقال وتجربة ميزة «{currentStep.featureBadge}» الآن</span>
                <ArrowLeft className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={handlePrev}
                  disabled={activeStepIndex === 0}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-slate-700 font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeStepIndex === WALKTHROUGH_STEPS.length - 1}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-slate-700 font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

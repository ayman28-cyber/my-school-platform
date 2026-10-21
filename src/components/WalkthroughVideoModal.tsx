import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Users2, 
  Newspaper, 
  LayoutDashboard, 
  ArrowLeft,
  GraduationCap,
  Target,
  Compass,
  MessageSquare,
  ShieldCheck,
  Flame,
  AudioWaveform,
  Gauge
} from 'lucide-react';

interface WalkthroughVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'dashboard' | 'videos' | 'news' | 'friends') => void;
}

// Structured guide sections with scripts for speech synthesis
interface GuideSection {
  id: string;
  title: string;
  badge: string;
  icon: 'Target' | 'LayoutDashboard' | 'Newspaper' | 'BookOpen' | 'Users2' | 'ShieldCheck';
  summary: string;
  speechText: string;
  details: string[];
  tabTarget?: 'dashboard' | 'videos' | 'news' | 'friends';
  tabLabel?: string;
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'goals',
    title: 'أهداف ورؤية منصة My School التعليمية الذكية',
    badge: 'الرؤية والأهداف الأكاديمية',
    icon: 'Target',
    summary: 'تم تصميم منصة My School لتكون البيئة المدرسية الرقمية المتكاملة التي تجمع المعلمين والطلاب في مساحة موحدة تحفز التميز الأكاديمي والتعاون المشترك.',
    speechText: 'أهلاً بكم في منصة ماي سكول المدرسية المتكاملة. تهدف المنصة إلى بناء بيئة تعليمية ذكية ومترابطة، تجمع المعلمين والطلاب تحت سقف رقمي موحد. تسعى المنصة إلى تعزيز الشفافية الأكاديمية، وتنظيم المهام الدراسية للطلاب، وتوفير شروحات ومكتبة تفاعلية للمواد السبع المعتمدة، مع بناء شبكة صداقة وتواصل آمنة وموثوقة بين كافة زملاء المدرسة.',
    details: [
      'التحول الرقمي الكامل للمجتمع المدرسي وتسهيل الوصول للدروس والواجبات.',
      'تمكين الطالب من قيادة مساره التعليمي وتحديد أولويات مهامه بنفسه.',
      'حصر النشر والإعلانات الرسمية على المعلمين المعتمدين لضمان دقة المحتوى.',
      'توفير شبكة زملاء حقيقية للتواصل الأكاديمي والمذاكرة المشتركة دون مشتتات.'
    ]
  },
  {
    id: 'login',
    title: '1. تسجيل الدخول السريع وتحديد الهوية المدرسية',
    badge: 'الخطوة الأولى',
    icon: 'ShieldCheck',
    summary: 'دخول مباشر بالاسم الشخصي واختيار الصف والشعبة أو تخصص المعلم مع الحفظ الفوري في قاعدة البيانات.',
    speechText: 'الخطوة الأولى: تسجيل الدخول السريع. تتيح المنصة للطلاب والمعلمين الدخول الفوري بكتابة الاسم واختيار الصف والشعبة الرسمية لطلاب أولى ثانوي من الشعبة واحد على واحد إلى واحد على اثني عشر، ولثانية بكالوريا من الشعبة اثنين على واحد إلى اثنين على تسعة، أو اختيار تخصص المعلم، ويتم حفظ كافة البيانات فورياً في قاعدة البيانات.',
    details: [
      'الدخول الفوري بالاسم بدون تعقيدات كلمات المرور المنسية.',
      'توزيع الشعب المدرسية بدقة متوافقة مع الهيكل الفعلي للمدرسة.',
      'تخصيص كامل للأذونات والصلاحيات بحسب دور المعلم أو الطالب.'
    ],
    tabTarget: 'dashboard',
    tabLabel: 'عرض لوحة التحكم'
  },
  {
    id: 'student-dashboard',
    title: '2. لوحة تحكم الطالب وجدول المهام التفاعلي',
    badge: 'تنظيم الدراسة اليومية',
    icon: 'LayoutDashboard',
    summary: 'أنت من يحدد ويضيف مهامك الدراسية مع تحديد الأولويات وتاريخ التسليم وتحديث المعدل التراكمي لحظياً.',
    speechText: 'الخطوة الثانية: لوحة تحكم الطالب وإدارة المهام. في هذه اللوحة يستطيع كل طالب إضافة مهام مخصصة لمواده الدراسية، كتسليم التجارب أو حل الواجبات، مع تحديد درجة الأهمية وتاريخ التسليم، بالإضافة إلى متابعة نسبة إنجاز المناهج والمعدل التراكمي ونسب الحضور.',
    details: [
      'إضافة وتعديل وحذف المهام الدراسية مع وسمها كمكتملة.',
      'تتبع ساعات المذاكرة لكل مادة ونسبة الحضور والمعدل.',
      'أوسمة التميز والإنجاز الشخصية لتشجيع الاستمرار في التفوق.'
    ],
    tabTarget: 'dashboard',
    tabLabel: 'الانتقال إلى لوحة الطالب'
  },
  {
    id: 'subject-news',
    title: '3. أخبار المواد السبعة وصلاحيات النشر الرسمية',
    badge: 'التواصل الأكاديمي الموثوق',
    icon: 'Newspaper',
    summary: 'أخبار مقسمة للمواد السبع، والنشر محصور للمعلمين بينما يشارك الطلاب بالتعليقات والمناقشات.',
    speechText: 'الخطوة الثالثة: أخبار المواد الدراسية. تم تصنيف الإعلانات إلى سبع مواد رئيسية، تشمل الرياضيات، الفيزياء، الكيمياء، البرمجة، الأحياء، واللغتين العربية والإنجليزية. تمنح المنصة صلاحية النشر حصرياً للمعلمين لضمان مصداقية الإعلانات، بينما يتاح للطلاب التعليق والاستفسار والتفاعل بحرية.',
    details: [
      'أقسام مستقلة لكل مادة دراسية لسهولة المتابعة.',
      'حصر إنشاء المنشورات على المعلمين لمنع الإعلانات العشوائية.',
      'إتاحة التعليقات والتفاعل والإعجاب لكافة الطلاب والأساتذة.'
    ],
    tabTarget: 'news',
    tabLabel: 'تصفح أخبار المواد'
  },
  {
    id: 'video-library',
    title: '4. مكتبة الدروس وحفظ الملاحظات التلقائي',
    badge: 'المستودع التعليمي الرقمي',
    icon: 'BookOpen',
    summary: 'مشاهدة شروحات المناهج وتدوين الملاحظات الدراسية مع حفظ التقدم تلقائياً في السيرفر.',
    speechText: 'الخطوة الرابعة: مكتبة الدروس والشروحات. تضم المكتبة دروساً مرئية ومصورة لكل مادة دراسية. يستطيع الطالب متابعة الدرس وتدوين ملاحظاته الخاصة في مفكرة مدمجة تحفظ تلقائياً، كما يتيح النظام للمعلمين رفع دروس جديدة ومشاركتها مع الطلاب.',
    details: [
      'دروس مصنفة حسب التخصص مع شريط تقدم ونسبة إتمام.',
      'مفكرة ذكية لتدوين الملاحظات أثناء متابعة الشرح.',
      'إمكانية رفع المعلمين لدروس جديدة وصور توضيحية بسهولة.'
    ],
    tabTarget: 'videos',
    tabLabel: 'فتح مكتبة الدروس'
  },
  {
    id: 'friends-network',
    title: '5. شبكة الزملاء وطلبات الصداقة الحقيقية',
    badge: 'المجتمع الصفي والتعاون',
    icon: 'Users2',
    summary: 'البحث عن زملاء المدرسة بالاسم والشعبة، وإرسال واستقبال طلبات صداقة حقيقية، وبدء محادثات المذاكرة.',
    speechText: 'الخطوة الخامسة: شبكة الزملاء وطلبات الصداقة. توفر المنصة دليلاً شاملاً لكافة الطلاب والمعلمين المسجلين في المدرسة. يمكنك إرسال طلب صداقة حقيقي ومتابعته، وقبول طلبات الزملاء، والتواصل الفوري عبر محادثة المذاكرة المشتركة لتبادل الاستفسارات والحلول.',
    details: [
      'دليل حي لطلاب المدرسة مصنف حسب البنين والبنات والشعب.',
      'نظام طلبات صداقة حقيقي يتم حفظه في قاعدة البيانات.',
      'محادثة نصية فورية للمذاكرة والمناقشة الصفية الثنائية.'
    ],
    tabTarget: 'friends',
    tabLabel: 'استكشاف شبكة الزملاء'
  }
];

export const WalkthroughVideoModal: React.FC<WalkthroughVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('goals');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [activeSpeechSectionId, setActiveSpeechSectionId] = useState<string | null>(null);
  const [synthVoiceName, setSynthVoiceName] = useState<string>('');
  const [visualizerBars, setVisualizerBars] = useState<number[]>([40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
      if (arabicVoice) {
        setSynthVoiceName(arabicVoice.name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Equalizer animation effect when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setVisualizerBars([25, 30, 20, 35, 25, 30, 20, 35, 25, 30, 20, 25]);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let interval = setInterval(() => {
      setVisualizerBars(prev => prev.map(() => Math.floor(Math.random() * 75) + 25));
    }, 120);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Stop speech when modal is closed
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
    }
  }, [isOpen]);

  const handleSpeakSection = (section: GuideSection) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // If currently speaking this section, toggle pause/stop
    if (isSpeaking && activeSpeechSectionId === section.id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(section.speechText);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Prefer Arabic voice if found
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-SA';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeechSectionId(section.id);
      setActiveSectionId(section.id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakFullGuide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
      return;
    }

    const fullText = GUIDE_SECTIONS.map(s => `${s.title}. ${s.speechText}`).join(' ... ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-SA';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeechSectionId('all');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechSectionId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeechSectionId(null);
  };

  const activeSection = GUIDE_SECTIONS.find(s => s.id === activeSectionId) || GUIDE_SECTIONS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
      
      {/* Modal Dialog with Burgundy & Black Aesthetic */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl bg-[#0c0d10] border border-[#7d0d2b]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        
        {/* Header: Burgundy & Black Gradient */}
        <div className="bg-gradient-to-r from-black via-[#380412] to-[#6e0a23] p-5 sm:p-6 border-b border-[#850e2e]/40 flex items-center justify-between text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black/60 border border-rose-500/30 flex items-center justify-center shadow-inner text-rose-300">
              <Sparkles className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  دليل منصة My School التعليمية
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-200 hidden sm:inline">
                  شرح نصي وصوت ذكاء اصطناعي
                </span>
              </div>
              <p className="text-xs text-rose-200/90 font-medium mt-0.5">
                تعرف على أهداف المنصة وكيفية استخدام كافة ميزاتها خطوة بخطوة بالصوت والشرح
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/40 hover:bg-black/70 border border-rose-500/30 text-rose-200 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Voice Player Control Bar */}
        <div className="bg-[#14151a] border-b border-[#4d071a]/50 p-3.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Player status & Equalizer */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSpeakFullGuide}
              className={`px-4 py-2 rounded-xl font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isSpeaking && activeSpeechSectionId === 'all'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-gradient-to-r from-[#6e0a23] to-[#910d2e] hover:from-[#800b29] hover:to-[#a31034] text-white shadow-[#6e0a23]/30'
              }`}
              title="الاستماع للشرح الكامل بصوت الذكاء الاصطناعي"
            >
              {isSpeaking && activeSpeechSectionId === 'all' ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف القراءة</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>استمع للشرح الكامل (AI)</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/90 border border-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer"
                title="إيقاف نهائي"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Live Audio Visualizer Equalizer */}
            <div className="flex items-center gap-1 h-6 px-2.5 py-1 bg-black/50 border border-rose-900/40 rounded-lg">
              {visualizerBars.map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking ? 'bg-gradient-to-t from-rose-700 to-rose-400' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>

            <span className="text-[11px] text-stone-400 truncate max-w-[200px] hidden md:inline">
              {isSpeaking 
                ? (activeSpeechSectionId === 'all' ? 'جاري قراءة الدليل الكامل...' : `يقرأ: ${GUIDE_SECTIONS.find(s => s.id === activeSpeechSectionId)?.title.slice(0, 25)}...`)
                : (synthVoiceName ? `الصوت المعتمد: ${synthVoiceName}` : 'الصوت العربي الذكي جاهز')}
            </span>
          </div>

          {/* Speed & Narration Options */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-stone-400 text-[11px]">سرعة الصوت:</span>
            {[1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                  speechRate === rate
                    ? 'bg-[#700b24] text-white border border-rose-500/50'
                    : 'bg-black/40 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

        </div>

        {/* Body Grid: 2 Columns (Navigation / Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#380512]/60">
          
          {/* Right Navigation Column (4 cols) */}
          <div className="lg:col-span-4 p-4 space-y-2 bg-[#0e0f13]/80 overflow-y-auto">
            <span className="text-[11px] font-extrabold text-stone-400 px-2 block mb-2">
              أقسام الدليل والشرح:
            </span>

            {GUIDE_SECTIONS.map((sec, idx) => {
              const isSelected = activeSectionId === sec.id;
              const isReadingThis = isSpeaking && activeSpeechSectionId === sec.id;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border text-right group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#29030d] to-[#450718] border-rose-600/50 text-white shadow-md'
                      : 'bg-[#15161c]/60 hover:bg-[#1f2029] border-stone-800/80 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-rose-300">
                      {sec.badge}
                    </span>

                    {/* Quick Speak button for this section */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakSection(sec);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isReadingThis 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-black/40 hover:bg-rose-950/70 text-rose-400 hover:text-rose-200 border border-rose-900/30'
                      }`}
                      title={isReadingThis ? 'إيقاف قراءة هذا القسم' : 'استمع لهذا القسم بالصوت'}
                    >
                      {isReadingThis ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-xs font-black mt-1 text-white leading-tight">
                    {sec.title}
                  </h3>

                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {sec.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Left Content Column (8 cols): Detailed Explanations */}
          <div className="lg:col-span-8 p-6 sm:p-8 bg-[#0c0d10] space-y-6 overflow-y-auto">
            
            {/* Active Section Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1a0208] via-[#330511] to-black border border-rose-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300">
                    {activeSection.badge}
                  </span>

                  <button
                    onClick={() => handleSpeakSection(activeSection)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#700b24] hover:bg-[#850d2c] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    {isSpeaking && activeSpeechSectionId === activeSection.id ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>إيقاف الصوت</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع لصوت الذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {activeSection.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  {activeSection.summary}
                </p>
              </div>
            </div>

            {/* Key Practical Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>أبرز النقاط والتعليمات العملية:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSection.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#14151b] border border-stone-800/90 text-xs text-stone-200 leading-relaxed flex items-start gap-2.5 shadow-2xs hover:border-rose-900/60 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#54071b] text-rose-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spoken AI Script Quote Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-[#59071e]/40 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-rose-400">
                <AudioWaveform className="w-3.5 h-3.5" />
                <span>نص الشرح الصوتي للذكاء الاصطناعي:</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-stone-900 font-sans">
                "{activeSection.speechText}"
              </p>
            </div>

            {/* Quick Action Navigation button */}
            {activeSection.tabTarget && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800/80">
                <span className="text-xs text-stone-400">
                  هل تريد تجربة هذا القسم مباشرة في المنصة؟
                </span>

                <button
                  onClick={() => {
                    if (activeSection.tabTarget) {
                      onNavigateTab(activeSection.tabTarget);
                      onClose();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6e0a23] to-[#8f0d30] hover:from-[#800b29] hover:to-[#a31034] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{activeSection.tabLabel || 'الانتقال للقسم'}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0a0d] border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">منصة My School الأكاديمية</span>
            <span>·</span>
            <span>النسخة التفاعلية المطورة بتصميم العنابي والأسود الفاخر</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق ومتابعة الاستخدام
          </button>
        </div>

      </motion.div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Server, 
  Monitor, 
  Sparkles
} from 'lucide-react';
import { SYSTEM_PROMPT_COPY, BACKEND_CODE_EXPORT, FRONTEND_CODE_EXPORT } from '../data/mockCodeSnippets';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'backend' | 'frontend' | 'structure'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const fileStructureText = `
📁 my-school-platform/
├── 📄 server.ts               # خادم Express لحفظ مهام الطلاب، تسجيل الدخول، ونشر الفيديوهات
├── 📁 data/
│   └── 📄 school_database.json # قاعدة بيانات المنصة الحقيقية الدائمة (JSON DB)
├── 📄 package.json            # التبعيات وأوامر التشغيل (dev, build, start)
├── 📄 tsconfig.json           # إعدادات TypeScript
├── 📄 vite.config.ts          # إعدادات Vite و Tailwind CSS
├── 📄 index.html              # ملف البداية (RTL + خطوط Alexandria الفاخرة)
└── 📁 src/
    ├── 📄 main.tsx            # مدخل تطبيق React 19
    ├── 📄 App.tsx             # التطبيق الرئيسي والتحكم بتسجيل الدخول والواجهات
    ├── 📄 index.css           # تنسيقات الثيم الذهبي والأبيض
    ├── 📁 types/
    │   └── 📄 index.ts        # تعريفات البيانات، المهام الشخصية، والأدوار
    ├── 📁 services/
    │   └── 📄 api.ts          # عميل الاتصال بـ REST APIs للباك إند
    └── 📁 components/
        ├── 📄 Navbar.tsx               # شريط التنقل العلوي (My School)
        ├── 📄 LoginScreen.tsx          # صفحة الدخول بالاسم بدون باسورد
        ├── 📄 StudentTaskManager.tsx   # قائمة مهام الطالب الحقيقية
        ├── 📄 StudentDashboard.tsx     # لوحة تحكم الطالب وتحليل الأداء
        ├── 📄 TeacherDashboard.tsx     # لوحة المعلم وسجل الطلاب
        ├── 📄 NewsSection.tsx          # نظام أخبار المواد (نشر للمعلم فقط)
        ├── 📄 FriendsSection.tsx       # نظام إضافة الأصدقاء والدردشة
        ├── 📄 VideoLibrary.tsx         # مكتبة الفيديوهات وحفظ التقدم
        ├── 📄 WalkthroughVideoModal.tsx # فيديو الشرح التفاعلي والمحاكي
        └── 📄 CodeExportModal.tsx      # نافذة نسخ الأكواد المعمارية
`.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col my-auto animate-fadeIn text-right">
        
        {/* Header */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-700">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                مركز الأكواد المنفصلة والمعمارية · My School
              </h2>
              <span className="text-[11px] text-amber-800 font-medium">
                أكواد مقسمة جاهزة للنسخ والاستخدام المستقل (فرونت إند، باك إند، وبرومت البناء)
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

        {/* Tab Switcher */}
        <div className="px-6 py-3 bg-stone-50 border-b border-amber-100 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'prompt' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              البرومت الهندسي (Prompt)
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'backend' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              باك إند (Express)
            </button>

            <button
              onClick={() => setActiveTab('frontend')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'frontend' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-amber-600" />
              فرونت إند (React 19)
            </button>

            <button
              onClick={() => setActiveTab('structure')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'structure' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              هيكلية الملفات
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => {
              if (activeTab === 'prompt') handleCopy(SYSTEM_PROMPT_COPY, 'prompt');
              if (activeTab === 'backend') handleCopy(BACKEND_CODE_EXPORT, 'backend');
              if (activeTab === 'frontend') handleCopy(FRONTEND_CODE_EXPORT, 'frontend');
              if (activeTab === 'structure') handleCopy(fileStructureText, 'structure');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            {copiedKey === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود الحالي</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Container */}
        <div className="p-6 bg-stone-900 font-mono text-xs overflow-y-auto max-h-[460px] text-left leading-relaxed text-slate-100" dir="ltr">
          {activeTab === 'prompt' && (
            <div className="space-y-2 text-slate-200 whitespace-pre-wrap font-sans text-right" dir="rtl">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs mb-4">
                💡 هذا هو البرومت الهندسي الكامل المعتمد لتوليد المنصة في أي بيئة معمارية.
              </div>
              <pre className="p-4 rounded-2xl bg-black/60 border border-stone-800 text-slate-200 overflow-x-auto text-xs whitespace-pre-wrap font-mono">
                {SYSTEM_PROMPT_COPY}
              </pre>
            </div>
          )}

          {activeTab === 'backend' && (
            <pre className="text-amber-300 whitespace-pre-wrap">
              {BACKEND_CODE_EXPORT}
            </pre>
          )}

          {activeTab === 'frontend' && (
            <pre className="text-yellow-200 whitespace-pre-wrap">
              {FRONTEND_CODE_EXPORT}
            </pre>
          )}

          {activeTab === 'structure' && (
            <pre className="text-stone-300 whitespace-pre-wrap font-mono" dir="ltr">
              {fileStructureText}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-amber-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>الباك إند يستضيف قاعدة البيانات الحقيقية محلياً في data/school_database.json</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-slate-800 font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

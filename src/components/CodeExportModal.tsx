import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Server, 
  Monitor, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { 
  SYSTEM_PROMPT_COPY, 
  BACKEND_CODE_EXPORT, 
  FRONTEND_CODE_EXPORT 
} from '../data/mockCodeSnippets';

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
my-school-platform/
├── 📄 server.ts                  # الباك إند الحقيقي (Express + TypeScript + Database)
├── 📄 package.json               # إعدادات المكتبات والأوامر
├── 📄 vite.config.ts             # إعدادات Vite
├── 📁 data/
│   └── 📄 school_database.json   # قاعدة البيانات التخزينية الحقيقية
└── 📁 src/
    ├── 📄 App.tsx                # المنسق الرئيسي وربط الـ State
    ├── 📄 types/index.ts         # الواجهات والأنواع البرمجية
    ├── 📁 services/
    │   └── 📄 api.ts             # عميل التواصل مع السيرفر الحقيقي
    └── 📁 components/
        ├── 📄 Navbar.tsx               # شريط التصفح الذكي
        ├── 📄 LoginScreen.tsx          # شاشة الدخول المباشر بالاسم
        ├── 📄 UserAvatar.tsx           # الصورة الرمزية بأشكال الحروف
        ├── 📄 StudentDashboard.tsx     # لوحة تحكم الطالب
        ├── 📄 TeacherDashboard.tsx     # لوحة تحكم المعلم
        ├── 📄 StudentTaskManager.tsx   # جدول مهام الطالب الشخصي
        ├── 📄 NewsSection.tsx          # أخبار المواد السبعة
        ├── 📄 FriendsSection.tsx       # شبكة الزملاء والتواصل
        ├── 📄 VideoLibrary.tsx         # مكتبة الدروس والوسائط
        ├── 📄 WalkthroughVideoModal.tsx # دليل المنصة والشرح الصوتي AI
        └── 📄 CodeExportModal.tsx      # نافذة نسخ الأكواد المعمارية
`.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-[#7d0d2b]/30 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col my-auto animate-fadeIn text-right">
        
        {/* Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-[#7d0d2b]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black/80 border border-rose-900/60 flex items-center justify-center text-rose-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                مركز الأكواد المنفصلة والمعمارية · My School
              </h2>
              <span className="text-[11px] text-[#800020] font-medium">
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
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'prompt' ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              البرومت الهندسي (Prompt)
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'backend' ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              باك إند (Express)
            </button>

            <button
              onClick={() => setActiveTab('frontend')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'frontend' ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-rose-300" />
              فرونت إند (React 19)
            </button>

            <button
              onClick={() => setActiveTab('structure')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'structure' ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white border border-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] text-white text-xs font-bold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
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
        <div className="p-6 bg-[#0e0f13] font-mono text-xs overflow-y-auto max-h-[460px] text-left leading-relaxed text-slate-100" dir="ltr">
          {activeTab === 'prompt' && (
            <div className="space-y-2 text-slate-200 whitespace-pre-wrap font-sans text-right" dir="rtl">
              <div className="p-3 rounded-xl bg-black/60 border border-rose-900/40 text-rose-200 text-xs mb-4">
                💡 هذا هو البرومت الهندسي الكامل المعتمد لتوليد المنصة في أي بيئة معمارية.
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-stone-800 text-slate-200 overflow-x-auto text-xs whitespace-pre-wrap font-mono">
                {SYSTEM_PROMPT_COPY}
              </pre>
            </div>
          )}

          {activeTab === 'backend' && (
            <pre className="text-rose-200 whitespace-pre-wrap">
              {BACKEND_CODE_EXPORT}
            </pre>
          )}

          {activeTab === 'frontend' && (
            <pre className="text-rose-100 whitespace-pre-wrap">
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
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-slate-500 font-medium">
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

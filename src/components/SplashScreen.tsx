import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, GraduationCap, Crown } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // 'intro' (0-1500ms) -> 'splitting' (1500-2300ms) -> 'done'
  const [phase, setPhase] = useState<'intro' | 'splitting' | 'done'>('intro');

  useEffect(() => {
    // 1.5 seconds intro duration as specifically requested
    const introTimer = setTimeout(() => {
      setPhase('splitting');
    }, 1500);

    // After relaxing split animation finishes (800ms split duration)
    const endTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2350);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (phase === 'intro') {
      setPhase('splitting');
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 700);
    }
  };

  if (phase === 'done') return null;

  const isSplitting = phase === 'splitting';

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden select-none font-sans"
      dir="rtl"
      onClick={handleSkip}
    >
      {/* Right Curtain Panel (slides right in RTL, or left/right split) */}
      <div 
        className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-black via-[#26040d] to-[#450718] border-l border-rose-500/20 shadow-2xl transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${
          isSplitting ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Subtle decorative background lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#800020_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Left Curtain Panel (slides left) */}
      <div 
        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-black via-[#26040d] to-[#450718] border-r border-rose-500/20 shadow-2xl transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-20 ${
          isSplitting ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#800020_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Center Welcome Typography & Emblem */}
      <div 
        className={`absolute inset-0 z-30 flex items-center justify-center p-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSplitting ? 'opacity-0 scale-110 blur-sm pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <div className="max-w-xl w-full text-center space-y-6">
          
          {/* Emblem Icon with Animated Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative inline-flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-black via-[#5e091e] to-[#800020] p-1 shadow-2xl shadow-rose-900/40 border border-rose-400/40 flex items-center justify-center">
              <div className="w-full h-full bg-[#160207] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                <GraduationCap className="w-10 h-10 text-rose-300 drop-shadow-md" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black p-1.5 rounded-full shadow-lg border border-amber-300">
              <Crown className="w-4 h-4 fill-current" />
            </div>
          </motion.div>

          {/* Main Welcome Text Requested by User */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="space-y-4"
          >
            {/* 1. Header Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              مرحباً بك في منصة <span className="text-rose-400 bg-gradient-to-r from-rose-300 to-rose-500 bg-clip-text text-transparent">My School</span>
            </h1>

            {/* Glowing separator line */}
            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />

            {/* 2. "تحتها بادارة انزل سطر ايمن احمد ابراهيم" */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs sm:text-sm text-rose-200/90 font-bold tracking-widest block uppercase">
                بإدارة
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                أيمن أحمد إبراهيم
              </h2>
              <span className="text-xs sm:text-sm text-stone-400 font-mono tracking-wider block font-semibold">
                Ayman Ahmed Ibrahim
              </span>
            </div>

            {/* Official Administrative Subtitle */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-rose-500/30 text-rose-200 text-xs font-semibold backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                المشرف العام ومؤسس المنصة الأكاديمية
              </span>
            </div>
          </motion.div>

          {/* Subtle Progress / Duration Bar (1.5 seconds) */}
          <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-rose-600 via-rose-400 to-amber-400"
            />
          </div>

          <span className="text-[11px] text-stone-500 block">
            اضغط في أي مكان لتخطي شاشة الترحيب والدخول الفوري
          </span>

        </div>
      </div>
    </div>
  );
};

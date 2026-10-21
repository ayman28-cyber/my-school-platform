import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, BookOpen } from 'lucide-react';

interface UserAvatarProps {
  name: string;
  role?: UserRole;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showStatus?: boolean;
  statusOnline?: boolean;
  showRoleBadge?: boolean;
}

// Deterministic burgundy and black gradients for avatars
const BURGUNDY_BLACK_GRADIENTS = [
  'from-black via-[#4a0618] to-[#750b28] text-rose-50 border-[#850e2e]/40',
  'from-[#1f0209] via-[#59071e] to-[#8a0f32] text-rose-100 border-[#941337]/40',
  'from-[#2c030d] via-[#6e0b25] to-black text-white border-[#7d0d2b]/40',
  'from-black via-[#380412] to-[#690923] text-stone-100 border-[#5e081f]/40',
  'from-[#140106] via-[#4f061b] to-[#7d0b2a] text-rose-50 border-[#7d0b2a]/40',
  'from-[#3d0514] via-[#780d2c] to-[#140105] text-white border-[#8f1236]/40'
];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function extractInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'م';
  
  // Clean titles: د., أ., أستاذ, دكتور, etc.
  const cleaned = name
    .trim()
    .replace(/^(دكتور|دكتورة|أستاذ|أستاذة|المهندس|المهندسة|م\.|د\.|أ\.)\s+/i, '')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return name.charAt(0) || 'م';

  // Get primary first letter
  const firstChar = words[0].charAt(0);
  return firstChar;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role,
  size = 'md',
  className = '',
  showStatus = false,
  statusOnline = true,
  showRoleBadge = false
}) => {
  const initial = extractInitials(name);
  const hash = getHash(name || 'user');
  const gradientClass = BURGUNDY_BLACK_GRADIENTS[hash % BURGUNDY_BLACK_GRADIENTS.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] border shadow-2xs font-extrabold',
    sm: 'w-8 h-8 text-xs border shadow-2xs font-extrabold',
    md: 'w-10 h-10 text-sm border-2 shadow-xs font-black',
    lg: 'w-12 h-12 text-base border-2 shadow-md font-black',
    xl: 'w-16 h-16 text-xl border-2 shadow-lg font-black',
    '2xl': 'w-20 h-20 text-2xl border-2 shadow-xl font-black'
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 border-[1px]',
    sm: 'w-2 h-2 border-[1.5px]',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-3.5 h-3.5 border-2',
    '2xl': 'w-4 h-4 border-2'
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Letter Avatar with Burgundy-to-Black Gradient */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center select-none tracking-normal transition-transform ${sizeClasses[size]}`}
        title={name}
        aria-label={`الصورة الرمزية لـ ${name}`}
      >
        <span className="drop-shadow-sm font-sans uppercase">
          {initial}
        </span>
      </div>

      {/* Online Status Dot */}
      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full ${statusSizeClasses[size]} ${
            statusOnline ? 'bg-emerald-500 border-white' : 'bg-stone-400 border-white'
          }`}
          title={statusOnline ? 'متصل الآن' : 'غير متصل'}
        />
      )}

      {/* Role Badge */}
      {showRoleBadge && role && (
        <span
          className={`absolute -top-1 -left-1 p-0.5 rounded-md bg-black/80 border border-[#800020]/60 text-white ${
            size === 'xs' || size === 'sm' ? 'scale-75' : 'scale-90'
          }`}
          title={role === 'teacher' ? 'معلم' : 'طالب'}
        >
          {role === 'teacher' ? (
            <GraduationCap className="w-2.5 h-2.5 text-rose-300" />
          ) : (
            <BookOpen className="w-2.5 h-2.5 text-rose-200" />
          )}
        </span>
      )}
    </div>
  );
};

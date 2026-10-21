import React, { useState } from 'react';
import { 
  Users2, 
  UserPlus, 
  UserCheck, 
  MessageCircle, 
  Search, 
  Check, 
  X, 
  Send, 
  GraduationCap,
  BookOpen,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { User, ChatMessage, FIRST_SECONDARY_BRANCHES, SECOND_BACCALAUREATE_BRANCHES } from '../types';
import { UserAvatar } from './UserAvatar';

interface FriendsSectionProps {
  currentUser: User;
  allUsers: User[];
  friends: User[];
  incomingRequests: { relationId: string; user?: User; createdAt: string }[];
  outgoingPendingUserIds?: string[];
  messages: ChatMessage[];
  onSendFriendRequest: (recipientId: string) => Promise<void>;
  onRespondRequest: (relationId: string, accept: boolean) => Promise<void>;
  onSendMessage: (toId: string, text: string) => Promise<void>;
  onRefreshUsers?: () => Promise<void>;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({
  currentUser,
  allUsers,
  friends,
  incomingRequests,
  outgoingPendingUserIds = [],
  messages,
  onSendFriendRequest,
  onRespondRequest,
  onSendMessage,
  onRefreshUsers
}) => {
  // Tabs: 'boys' (بنين) | 'girls' (بنات) | 'teachers' (معلمين)
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<'boys' | 'girls' | 'teachers'>('boys');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | 'first_secondary' | 'second_baccalaureate'>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  
  const [activeChatUser, setActiveChatUser] = useState<User | null>(friends[0] || null);
  const [msgInput, setMsgInput] = useState('');
  const [requestSentFeedback, setRequestSentFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [localPendingIds, setLocalPendingIds] = useState<string[]>([]);

  const friendIds = friends.map(f => f.id);

  // Real Counts for the 3 Categories
  const boysCount = allUsers.filter(u => u.role === 'student' && (u.gender === 'male' || !u.gender)).length;
  const girlsCount = allUsers.filter(u => u.role === 'student' && u.gender === 'female').length;
  const teachersCount = allUsers.filter(u => u.role === 'teacher').length;

  // Filter users strictly by the 3 main categories: بنين / بنات / معلمين
  const categorizedUsers = allUsers.filter(u => {
    if (u.id === currentUser.id) return false;

    if (activeDirectoryTab === 'teachers') {
      return u.role === 'teacher';
    }

    if (activeDirectoryTab === 'boys') {
      return u.role === 'student' && (u.gender === 'male' || !u.gender);
    }

    if (activeDirectoryTab === 'girls') {
      return u.role === 'student' && u.gender === 'female';
    }

    return true;
  });

  // Apply search, grade, and specific branch filters
  const filteredUsers = categorizedUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.schoolClass && u.schoolClass.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.gradeOrSubject && u.gradeOrSubject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesGrade = true;
    if (selectedGradeFilter === 'first_secondary') {
      matchesGrade = u.gradeOrSubject === 'أولى ثانوي' || FIRST_SECONDARY_BRANCHES.includes(u.schoolClass || '');
    } else if (selectedGradeFilter === 'second_baccalaureate') {
      matchesGrade = u.gradeOrSubject === 'ثانية بكالوريا' || SECOND_BACCALAUREATE_BRANCHES.includes(u.schoolClass || '');
    }

    let matchesBranch = true;
    if (selectedBranchFilter !== 'all') {
      matchesBranch = u.schoolClass === selectedBranchFilter;
    }

    return matchesSearch && matchesGrade && matchesBranch;
  });

  const handleManualRefresh = async () => {
    if (!onRefreshUsers) return;
    setIsRefreshing(true);
    setRefreshSuccess(false);
    try {
      await onRefreshUsers();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2500);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendRequest = async (recipientId: string, recipientName: string) => {
    setLocalPendingIds(prev => Array.from(new Set([...prev, recipientId])));
    await onSendFriendRequest(recipientId);
    setRequestSentFeedback(`تم إرسال طلب الصداقة بنجاح إلى ${recipientName}`);
    setTimeout(() => setRequestSentFeedback(null), 3500);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatUser || !msgInput.trim()) return;
    await onSendMessage(activeChatUser.id, msgInput.trim());
    setMsgInput('');
  };

  const activeChatMessages = activeChatUser
    ? messages.filter(
        m => (m.fromId === currentUser.id && m.toId === activeChatUser.id) ||
             (m.fromId === activeChatUser.id && m.toId === currentUser.id)
      )
    : [];

  return (
    <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      
      {/* Top Header & Sync Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#7d0d2b]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/80 border border-rose-900/60 flex items-center justify-center text-rose-300">
              <Users2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  شبكة الزملاء والتواصل الصفي
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-[#800020]/25">
                  قاعدة بيانات المدرسة الحية
                </span>
              </div>
              <span className="text-xs text-[#800020] font-bold">
                {allUsers.length} مستخدم مسجل في المدرسة · مقسمين حسب البنين والبنات والمعلمين
              </span>
            </div>
          </div>
        </div>

        {/* Search & Refresh Actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو الشعبة..."
              className="w-full bg-white border border-stone-300 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#800020] font-medium"
            />
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-[#800020]/25 text-[#800020] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:border-[#800020] shrink-0"
            title="تحديث قائمة المستخدمين الآن من السيرفر"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#800020] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث الشبكة</span>
          </button>
        </div>
      </div>

      {/* User's Own Visibility Confirmation Card with Letter Avatar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-rose-50/30 border border-[#7d0d2b]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={currentUser.name}
            role={currentUser.role}
            size="md"
            showStatus
            statusOnline
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">{currentUser.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                مسجل ومحفوظ في السيرفر
              </span>
            </div>
            <span className="text-[11px] text-[#800020] font-medium">
              حسابك ظاهر لباقي الزملاء في قسم ({currentUser.role === 'teacher' ? 'المعلمين' : currentUser.gender === 'female' ? 'البنات' : 'البنين'})
              {currentUser.schoolClass ? ` · شعبة ${currentUser.schoolClass}` : ''}
              {currentUser.gradeOrSubject ? ` · ${currentUser.gradeOrSubject}` : ''}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 bg-white/80 border border-stone-200 px-3 py-1 rounded-xl self-start sm:self-center font-mono">
          معرّف حسابك: {currentUser.id.slice(0, 10)}...
        </div>
      </div>

      {requestSentFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{requestSentFeedback}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* 3 Main Directory Category Tabs in Burgundy & Black: بنين / بنات / معلمين */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => {
              setActiveDirectoryTab('boys');
              setSelectedBranchFilter('all');
            }}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeDirectoryTab === 'boys'
                ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-md shadow-[#800020]/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>قسم البنين (الطلاب)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeDirectoryTab === 'boys' ? 'bg-white/20 text-white' : 'bg-stone-200 text-slate-700'
            }`}>
              {boysCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveDirectoryTab('girls');
              setSelectedBranchFilter('all');
            }}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeDirectoryTab === 'girls'
                ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-md shadow-[#800020]/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>قسم البنات (الطالبات)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeDirectoryTab === 'girls' ? 'bg-white/20 text-white' : 'bg-stone-200 text-slate-700'
            }`}>
              {girlsCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveDirectoryTab('teachers');
              setSelectedBranchFilter('all');
            }}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeDirectoryTab === 'teachers'
                ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white shadow-md shadow-[#800020]/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>هيئة التدريس (المعلمون)</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              activeDirectoryTab === 'teachers' ? 'bg-white/20 text-white' : 'bg-stone-200 text-slate-700'
            }`}>
              {teachersCount}
            </span>
          </button>
        </div>

        {/* Grade & Branch Filter Bar */}
        {(activeDirectoryTab === 'boys' || activeDirectoryTab === 'girls') && (
          <div className="bg-white border border-[#7d0d2b]/20 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                تصفية الطلاب حسب الصف والشعبة الدراسية المعتمدة:
              </span>

              {/* Grade Selector Pills */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => {
                    setSelectedGradeFilter('all');
                    setSelectedBranchFilter('all');
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedGradeFilter === 'all'
                      ? 'bg-[#800020] text-white'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  جميع الصفوف
                </button>
                <button
                  onClick={() => {
                    setSelectedGradeFilter('first_secondary');
                    setSelectedBranchFilter('all');
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedGradeFilter === 'first_secondary'
                      ? 'bg-[#800020] text-white'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  أولى ثانوي (12 شعبة)
                </button>
                <button
                  onClick={() => {
                    setSelectedGradeFilter('second_baccalaureate');
                    setSelectedBranchFilter('all');
                  }}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedGradeFilter === 'second_baccalaureate'
                      ? 'bg-[#800020] text-white'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  ثانية بكلوريا (9 شعب)
                </button>
              </div>
            </div>

            {/* Visual Quick Branch Grid for Fast Filtering */}
            <div className="space-y-2">
              {/* First Secondary Branches: 1/1 to 1/12 */}
              {(selectedGradeFilter === 'all' || selectedGradeFilter === 'first_secondary') && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#800020] block">
                    شعب أولى ثانوي (1/1 إلى 1/12):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {FIRST_SECONDARY_BRANCHES.map(br => (
                      <button
                        key={br}
                        onClick={() => setSelectedBranchFilter(selectedBranchFilter === br ? 'all' : br)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer ${
                          selectedBranchFilter === br
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-rose-100 text-slate-700 border border-stone-200'
                        }`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Second Baccalaureate Branches: 2/1 to 2/9 */}
              {(selectedGradeFilter === 'all' || selectedGradeFilter === 'second_baccalaureate') && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-[#800020] block">
                    شعب ثانية بكلوريا (2/1 إلى 2/9):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SECOND_BACCALAUREATE_BRANCHES.map(br => (
                      <button
                        key={br}
                        onClick={() => setSelectedBranchFilter(selectedBranchFilter === br ? 'all' : br)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer ${
                          selectedBranchFilter === br
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-rose-100 text-slate-700 border border-stone-200'
                        }`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedBranchFilter !== 'all' && (
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100 text-[11px]">
                  <span className="text-[#800020] font-bold">
                    تمت التصفية لعرض طلاب شعبة: <strong className="font-mono text-[#800020]">{selectedBranchFilter}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedBranchFilter('all')}
                    className="text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
                  >
                    إلغاء تصفية الشعبة (عرض الكل)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Incoming Requests Section with Letter Avatars */}
      {incomingRequests.length > 0 && (
        <div className="bg-rose-50/70 border border-[#7d0d2b]/25 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-extrabold text-[#800020] flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[#800020]" />
            طلبات الصداقة الواردة إليك ({incomingRequests.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incomingRequests.map((req) => (
              <div
                key={req.relationId}
                className="bg-white border border-[#7d0d2b]/20 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <UserAvatar
                    name={req.user?.name || 'مستخدم'}
                    role={req.user?.role}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 truncate block">
                      {req.user?.name}
                    </span>
                    <span className="text-[10px] text-[#800020] block truncate font-mono">
                      {req.user?.schoolClass ? `شعبة ${req.user.schoolClass}` : req.user?.gradeOrSubject}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onRespondRequest(req.relationId, true)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                    title="قبول الصداقة"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRespondRequest(req.relationId, false)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="رفض"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Directory Roster & Live Study Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Directory Roster & Friends */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Friends List with Letter Avatars */}
          <div className="bg-white border border-[#7d0d2b]/20 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                أصدقاؤك المقبولون في My School
              </span>
              <span className="text-xs font-bold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-full border border-[#800020]/20">
                {friends.length} صديق
              </span>
            </h3>

            {friends.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                لم تقم بإضافة أصدقاء بعد. تصفح قائمة الزملاء في الأسفل واضغط على «إضافة صديق» لبدء التواصل.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setActiveChatUser(friend)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                      activeChatUser?.id === friend.id
                        ? 'bg-rose-50/70 border border-[#800020]/40 shadow-2xs'
                        : 'bg-stone-50/70 border border-stone-200 hover:border-[#800020]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        name={friend.name}
                        role={friend.role}
                        size="sm"
                        showStatus
                        statusOnline
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{friend.name}</div>
                        <div className="text-[11px] text-[#800020] truncate font-mono">
                          {friend.schoolClass ? `شعبة ${friend.schoolClass}` : friend.gradeOrSubject} · {friend.gender === 'female' ? 'بنات' : 'بنين'}
                        </div>
                      </div>
                    </div>

                    <MessageCircle className="w-4 h-4 text-[#800020] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Directory Users List with Letter Avatars */}
          <div className="bg-white border border-[#7d0d2b]/20 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                {activeDirectoryTab === 'boys' && 'سجل الطلاب (قسم البنين)'}
                {activeDirectoryTab === 'girls' && 'سجل الطالبات (قسم البنات)'}
                {activeDirectoryTab === 'teachers' && 'سجل هيئة التدريس (المعلمين)'}
              </h3>
              <span className="text-xs font-bold text-[#800020] bg-rose-50 px-2 py-0.5 rounded-full border border-[#800020]/20">
                {filteredUsers.length} متاح
              </span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-stone-50 rounded-xl space-y-2">
                <Users2 className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs font-medium">
                  {selectedBranchFilter !== 'all' 
                    ? `لا يوجد طلاب مسجلون حالياً في شعبة ${selectedBranchFilter}. بمجرد تسجيل أي طالب دخوله واختيار هذه الشعبة سيظهر هنا فوراً!`
                    : 'لا يوجد مستخدمون مطابقون لبحثك في هذا القسم حالياً.'}
                </p>
                {selectedBranchFilter !== 'all' && (
                  <button
                    onClick={() => setSelectedBranchFilter('all')}
                    className="text-xs text-[#800020] font-bold hover:underline cursor-pointer"
                  >
                    عرض جميع الشعب
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
                {filteredUsers.map((user) => {
                  const isFriend = friendIds.includes(user.id);

                  return (
                    <div
                      key={user.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#800020]/40 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          name={user.name}
                          role={user.role}
                          size="md"
                          showStatus
                          statusOnline
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate text-xs">{user.name}</div>
                          
                          <div className="text-[11px] text-[#800020] font-medium truncate flex items-center gap-1.5 mt-0.5">
                            <span>{user.gradeOrSubject}</span>
                            {user.schoolClass && (
                              <>
                                <span>·</span>
                                <span className="font-mono bg-rose-100 text-[#800020] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {user.role === 'student' ? `شعبة ${user.schoolClass}` : user.schoolClass}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {isFriend ? (
                          <button
                            onClick={() => setActiveChatUser(user)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-100 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>مراسلة</span>
                          </button>
                        ) : (outgoingPendingUserIds.includes(user.id) || localPendingIds.includes(user.id)) ? (
                          <div className="px-3 py-1.5 rounded-lg bg-rose-50 text-[#800020] border border-[#800020]/30 text-[11px] font-bold flex items-center gap-1 select-none shadow-2xs">
                            <Sparkles className="w-3 h-3 text-[#800020] animate-pulse" />
                            <span>طلب معلق ⏳</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSendRequest(user.id, user.name)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-gradient-to-r hover:from-[#5e091e] hover:to-[#800020] text-[#800020] hover:text-white border border-[#800020]/30 font-bold transition-all text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>إضافة صديق</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (7 cols): Live Study Chat with Letter Avatar */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#7d0d2b]/20 rounded-2xl h-[560px] flex flex-col justify-between overflow-hidden shadow-xs">
            
            {/* Chat Header */}
            {activeChatUser ? (
              <div className="p-4 bg-stone-50 border-b border-[#7d0d2b]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={activeChatUser.name}
                    role={activeChatUser.role}
                    size="md"
                    showStatus
                    statusOnline
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{activeChatUser.name}</h4>
                    <span className="text-[11px] text-[#800020] font-medium">
                      {activeChatUser.schoolClass ? `شعبة ${activeChatUser.schoolClass}` : activeChatUser.gradeOrSubject} · متصل الآن للمذاكرة
                    </span>
                  </div>
                </div>

                <span className="text-xs text-[#800020] font-bold hidden sm:inline bg-rose-50 border border-[#800020]/25 px-2.5 py-1 rounded-full">
                  غرفة المذاكرة والتفاعل المباشر
                </span>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 border-b border-stone-200 text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>اختر زميلاً أو صديقاً من القائمة لبدء المحادثة والمذاكرة المشتركة</span>
                <Sparkles className="w-4 h-4 text-[#800020]" />
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/40">
              {!activeChatUser ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <MessageCircle className="w-12 h-12 text-stone-300" />
                  <p className="text-xs max-w-sm">
                    اضغط على زر «مراسلة» بجوار أي صديق أو اختر زميلاً لمناقشة الدروس والواجبات المدرسية معاً.
                  </p>
                </div>
              ) : activeChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <p className="text-xs">لا توجد رسائل سابقة مع {activeChatUser.name}. ابدأ المحادثة الآن وشارك الاستفسارات الدراسية!</p>
                </div>
              ) : (
                activeChatMessages.map((msg) => {
                  const isMe = msg.fromId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium ${
                          isMe
                            ? 'bg-gradient-to-r from-black via-[#5e091e] to-[#800020] text-white rounded-br-none shadow-md shadow-[#800020]/20'
                            : 'bg-white text-slate-800 rounded-bl-none border border-stone-200 shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            {activeChatUser && (
              <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-[#7d0d2b]/15 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`اكتب رسالة دراسية إلى ${activeChatUser.name}...`}
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#800020] font-medium"
                />
                <button
                  type="submit"
                  disabled={!msgInput.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-black via-[#5e091e] to-[#800020] hover:from-[#1b0208] hover:to-[#991136] disabled:opacity-40 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { NewsSection } from './components/NewsSection';
import { FriendsSection } from './components/FriendsSection';
import { VideoLibrary } from './components/VideoLibrary';
import { WalkthroughVideoModal } from './components/WalkthroughVideoModal';
import { SplashScreen } from './components/SplashScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { api } from './services/api';
import { User, NewsItem, VideoLesson, StudentProgress, ChatMessage, StudentTask, SubjectCategory, UserRole } from './types';

const STORAGE_KEY_USER = 'myschool_authenticated_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'videos' | 'news' | 'friends'>('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  
  // Real data stores
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<{ relationId: string; user?: User; createdAt: string }[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<{ relationId: string; user?: User; createdAt: string }[]>([]);
  const [outgoingRequestIds, setOutgoingRequestIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Modals & sub-views
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const broadcastSync = (type: string) => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('myschool_sync_channel');
        bc.postMessage({ type, timestamp: Date.now() });
        bc.close();
      } catch {
        // ignore
      }
    }
  };

  // 1. Initial Load: Check localStorage and fetch database
  useEffect(() => {
    async function init() {
      const usersData = await api.getUsers();
      setAllUsers(usersData);

      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          // Verify with latest user data if available
          const found = usersData.find(u => u.id === parsed.id);
          setCurrentUser(found || parsed);
        } catch {
          // ignore
        }
      }

      const allNews = await api.getNews();
      setNewsList(allNews);

      const allVideos = await api.getVideos();
      setVideos(allVideos);
    }
    init();
  }, []);

  // 2. Sync user-specific data (Tasks, Progress, Friends) when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));

    async function loadUserData() {
      if (!currentUser) return;

      // Load tasks
      if (currentUser.role === 'student') {
        const studentTasks = await api.getTasks(currentUser.id);
        setTasks(studentTasks);
      }

      // Load lesson progress
      const progs = await api.getStudentProgress(currentUser.id);
      setProgressList(progs);

      // Load friends and requests
      const friendsData = await api.getFriendsData(currentUser.id);
      setFriends(friendsData.friends);
      setIncomingRequests(friendsData.incomingRequests);
      setOutgoingRequests(friendsData.outgoingRequests || []);
      setOutgoingRequestIds(friendsData.outgoingPendingUserIds || []);

      // Load message thread
      const msgs = await api.getMessages(currentUser.id, 'u-student-2');
      setMessages(msgs);
    }

    loadUserData();
  }, [currentUser]);

  // 3. Continuous Multi-User Real-Time Sync & Inter-Tab Broadcast
  useEffect(() => {
    let isMounted = true;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('myschool_sync_channel') : null;

    const pullLiveUpdates = async () => {
      if (!isMounted) return;
      try {
        const [freshUsers, freshNews, freshVideos] = await Promise.all([
          api.getUsers(),
          api.getNews(),
          api.getVideos()
        ]);
        if (!isMounted) return;
        setAllUsers(freshUsers);
        setNewsList(freshNews);
        setVideos(freshVideos);

        if (currentUser) {
          const freshFriends = await api.getFriendsData(currentUser.id);
          if (!isMounted) return;
          setFriends(freshFriends.friends);
          setIncomingRequests(freshFriends.incomingRequests);
          setOutgoingRequests(freshFriends.outgoingRequests || []);
          setOutgoingRequestIds(freshFriends.outgoingPendingUserIds || []);

          if (currentUser.role === 'student') {
            const freshTasks = await api.getTasks(currentUser.id);
            if (!isMounted) return;
            setTasks(freshTasks);
          }
        }
      } catch {
        // network silent
      }
    };

    if (channel) {
      channel.onmessage = () => {
        pullLiveUpdates();
      };
    }

    const timer = setInterval(pullLiveUpdates, 3500);
    window.addEventListener('focus', pullLiveUpdates);

    return () => {
      isMounted = false;
      clearInterval(timer);
      window.removeEventListener('focus', pullLiveUpdates);
      if (channel) channel.close();
    };
  }, [currentUser]);

  // Auth: Real Login by Name & Role & Gender (no password required)
  const handleLogin = async (name: string, role: UserRole, gender: 'male' | 'female', gradeOrSubject?: string, schoolClass?: string) => {
    const user = await api.login(name, role, gender, gradeOrSubject, schoolClass);
    if (user) {
      setCurrentUser(user);
      const updatedUsers = await api.getUsers();
      setAllUsers(updatedUsers);
      broadcastSync('USER_LOGIN');
    }
  };

  const handleRefreshUsers = async () => {
    const freshUsers = await api.getUsers();
    setAllUsers(freshUsers);
  };

  // Auto-refresh users directory whenever user switches to the friends tab
  useEffect(() => {
    if (activeTab === 'friends') {
      handleRefreshUsers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setCurrentUser(null);
  };

  // Student Task Handlers (Persisted to database)
  const handleAddTask = async (taskData: {
    title: string;
    subject: SubjectCategory;
    dueDate: string;
    priority: 'عاجل' | 'متوسط' | 'عادي';
    notes?: string;
  }) => {
    if (!currentUser) return;
    const created = await api.createTask({
      studentId: currentUser.id,
      ...taskData
    });

    if (created) {
      setTasks(prev => {
        const exists = prev.some(t => t.id === created.id);
        if (exists) return prev;
        return [created, ...prev];
      });
      broadcastSync('TASK_ADDED');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = await api.toggleTask(taskId);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      broadcastSync('TASK_TOGGLED');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await api.deleteTask(taskId);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      broadcastSync('TASK_DELETED');
    }
  };

  // Update profile
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = await api.updateUserProfile(currentUser.id, updatedData);
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      const freshUsers = await api.getUsers();
      setAllUsers(freshUsers);
      broadcastSync('USER_UPDATED');
    }
  };

  // Lesson click handler
  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('videos');
  };

  // Video progress save
  const handleSaveProgress = async (lessonId: string, progressPct: number, completed: boolean, notes: string) => {
    if (!currentUser) return;
    const updated = await api.saveProgress({
      studentId: currentUser.id,
      lessonId,
      progressPct,
      completed,
      notes
    });

    if (updated) {
      setProgressList(prev => {
        const idx = prev.findIndex(p => p.lessonId === lessonId && p.studentId === currentUser.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = updated;
          return clone;
        }
        return [...prev, updated];
      });
    }
  };

  // Video publish (Teacher only)
  const handlePublishVideo = async (videoData: Partial<VideoLesson>) => {
    const res = await api.publishVideo(videoData);
    if (res.success && res.data) {
      setVideos(prev => [res.data!, ...prev]);
      broadcastSync('VIDEO_PUBLISHED');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // News Actions (Teacher publishes, everyone comments & likes)
  const handleLikeNews = async (newsId: string) => {
    const res = await api.likeNews(newsId);
    if (res.success) {
      setNewsList(prev => prev.map(n => n.id === newsId ? { ...n, likes: res.likes } : n));
      broadcastSync('NEWS_LIKED');
    }
  };

  const handleAddComment = async (newsId: string, text: string) => {
    if (!currentUser) return;
    const comment = await api.addComment(newsId, {
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text
    });
    if (comment) {
      setNewsList(prev => prev.map(n => n.id === newsId ? { ...n, comments: [...n.comments, comment] } : n));
      broadcastSync('NEWS_COMMENTED');
    }
  };

  const handlePublishNews = async (postData: Partial<NewsItem>) => {
    const res = await api.createNews(postData);
    if (res.success && res.data) {
      setNewsList(prev => [res.data!, ...prev]);
      broadcastSync('POST_PUBLISHED');
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Friends Actions
  const handleSendFriendRequest = async (recipientId: string) => {
    if (!currentUser) return;
    setOutgoingRequestIds(prev => Array.from(new Set([...prev, recipientId])));
    await api.sendFriendRequest(currentUser.id, recipientId);
    const data = await api.getFriendsData(currentUser.id);
    setFriends(data.friends);
    setIncomingRequests(data.incomingRequests);
    setOutgoingRequests(data.outgoingRequests || []);
    setOutgoingRequestIds(data.outgoingPendingUserIds || []);
    broadcastSync('FRIEND_REQUEST');
  };

  const handleRespondFriendRequest = async (relationId: string, accept: boolean) => {
    if (!currentUser) return;
    const success = await api.respondFriendRequest(relationId, accept);
    if (success) {
      const data = await api.getFriendsData(currentUser.id);
      setFriends(data.friends);
      setIncomingRequests(data.incomingRequests);
      setOutgoingRequests(data.outgoingRequests || []);
      setOutgoingRequestIds(data.outgoingPendingUserIds || []);
      broadcastSync('FRIEND_RESPONDED');
    }
  };

  const handleCancelFriendRequest = async (relationId: string) => {
    if (!currentUser) return;
    const success = await api.cancelFriendRequest(relationId, currentUser.id);
    if (success) {
      const data = await api.getFriendsData(currentUser.id);
      setFriends(data.friends);
      setIncomingRequests(data.incomingRequests);
      setOutgoingRequests(data.outgoingRequests || []);
      setOutgoingRequestIds(data.outgoingPendingUserIds || []);
      broadcastSync('FRIEND_CANCELLED');
    }
  };

  const handleSendMessage = async (toId: string, text: string) => {
    if (!currentUser) return;
    const msg = await api.sendMessage(currentUser.id, toId, text);
    if (msg) {
      setMessages(prev => [...prev, msg]);
      broadcastSync('CHAT_MESSAGE');
    }
  };

  const handleCommentOnVideo = async (videoId: string, text: string) => {
    if (!currentUser) return;
    const comment = await api.commentOnVideo(videoId, {
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text
    });
    if (comment) {
      setVideos(prev => prev.map(v => {
        if (v.id === videoId) {
          const list = v.comments ? [...v.comments, comment] : [comment];
          return { ...v, comments: list };
        }
        return v;
      }));
    }
  };

  // If user is not logged in, render the Login Screen with optional Splash overlay
  if (!currentUser) {
    return (
      <>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
        <LoginScreen
          onLogin={handleLogin}
          onReplaySplash={() => setShowSplash(true)}
          existingUsers={allUsers.map(u => ({
            name: u.name,
            role: u.role,
            gender: u.gender,
            avatar: u.avatar,
            gradeOrSubject: u.gradeOrSubject,
            schoolClass: u.schoolClass,
            userCode: u.userCode
          }))}
        />
      </>
    );
  }

  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0d10] text-slate-900 dark:text-stone-100 flex flex-col font-sans selection:bg-[#800020] selection:text-white transition-colors duration-200" dir="rtl">
      
      {/* 1.5s Splash Screen with split curtain animation */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTutorial={() => setShowTutorialModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        incomingRequestsCount={incomingRequests.length}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          isTeacher ? (
            <TeacherDashboard
              teacher={currentUser}
              students={allUsers.filter(u => u.role === 'student')}
              videos={videos}
              progressList={progressList}
              onOpenPublishModal={() => setActiveTab('videos')}
              onOpenLesson={handleOpenLesson}
              onNavigateNews={() => setActiveTab('news')}
            />
          ) : (
            <StudentDashboard
              user={currentUser}
              lessons={videos}
              progressList={progressList}
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onOpenLesson={handleOpenLesson}
              onNavigateTab={setActiveTab}
            />
          )
        )}

        {activeTab === 'videos' && (
          <VideoLibrary
            videos={videos}
            progressList={progressList}
            currentUser={currentUser}
            activeLessonId={activeLessonId}
            onSaveProgress={handleSaveProgress}
            onPublishVideo={handlePublishVideo}
            onCommentOnVideo={handleCommentOnVideo}
          />
        )}

        {activeTab === 'news' && (
          <NewsSection
            newsList={newsList}
            currentUser={currentUser}
            onLike={handleLikeNews}
            onAddComment={handleAddComment}
            onPublishNews={handlePublishNews}
          />
        )}

        {activeTab === 'friends' && (
          <FriendsSection
            currentUser={currentUser}
            allUsers={allUsers}
            friends={friends}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            outgoingPendingUserIds={outgoingRequestIds}
            messages={messages}
            onSendFriendRequest={handleSendFriendRequest}
            onRespondRequest={handleRespondFriendRequest}
            onCancelRequest={handleCancelFriendRequest}
            onSendMessage={handleSendMessage}
            onRefreshUsers={handleRefreshUsers}
          />
        )}

      </main>

      {/* Footer in Burgundy & Black Theme with Administrator Badges & Credits */}
      <footer className="border-t border-[#7d0d2b]/20 dark:border-rose-950/40 bg-white dark:bg-[#0c0d10] text-xs text-slate-500 dark:text-stone-400 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right">
            <span className="font-extrabold text-slate-900 dark:text-white">My School · المنصة المدرسية المتكاملة</span>
            <span className="hidden sm:inline">·</span>
            <span>بإدارة وإشراف: <strong className="text-slate-800 dark:text-stone-200 font-bold">أيمن أحمد إبراهيم (Ayman Ahmed Ibrahim)</strong></span>
            <span className="hidden sm:inline">·</span>
            <span>جميع الحقوق محفوظة © 2026</span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={() => setShowTutorialModal(true)}
              className="text-[#800020] dark:text-rose-400 hover:text-[#9e1336] dark:hover:text-rose-300 transition-colors cursor-pointer"
            >
              دليل أهداف المنصة والشرح الصوتي (AI)
            </button>
            <button
              onClick={() => setShowSplash(true)}
              className="text-slate-500 dark:text-stone-400 hover:text-[#800020] dark:hover:text-rose-300 transition-colors cursor-pointer text-[11px]"
              title="مشاهدة شاشة الترحيب وانقسام الصفحة"
            >
              شاشة الترحيب
            </button>
          </div>
        </div>
      </footer>

      {/* Walkthrough Video Modal */}
      <WalkthroughVideoModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onNavigateTab={setActiveTab}
      />

      {/* User Profile & Unified Academic Code Modal */}
      {showProfileModal && currentUser && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

    </div>
  );
}

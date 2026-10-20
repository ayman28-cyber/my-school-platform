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
import { api } from './services/api';
import { User, NewsItem, VideoLesson, StudentProgress, ChatMessage, StudentTask, SubjectCategory, UserRole } from './types';

const STORAGE_KEY_USER = 'myschool_authenticated_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'videos' | 'news' | 'friends'>('dashboard');
  
  // Real data stores
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<{ relationId: string; user?: User; createdAt: string }[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Modals & sub-views
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

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

      // Load message thread
      const msgs = await api.getMessages(currentUser.id, 'u-student-2');
      setMessages(msgs);
    }

    loadUserData();
  }, [currentUser]);

  // Auth: Real Login by Name & Role & Gender (no password required)
  const handleLogin = async (name: string, role: UserRole, gender: 'male' | 'female', gradeOrSubject?: string, schoolClass?: string) => {
    const user = await api.login(name, role, gender, gradeOrSubject, schoolClass);
    if (user) {
      setCurrentUser(user);
      // Immediately refresh users list so newly logged in student is visible to all
      const updatedUsers = await api.getUsers();
      setAllUsers(updatedUsers);
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

  // Student Task Handlers (Real student-created tasks)
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
      setTasks(prev => [created, ...prev]);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = await api.toggleTask(taskId);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await api.deleteTask(taskId);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
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
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // News Actions (Teacher publishes, everyone comments & likes)
  const handleLikeNews = async (newsId: string) => {
    const res = await api.likeNews(newsId);
    if (res.success) {
      setNewsList(prev => prev.map(n => n.id === newsId ? { ...n, likes: res.likes } : n));
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
    }
  };

  const handlePublishNews = async (postData: Partial<NewsItem>) => {
    const res = await api.createNews(postData);
    if (res.success && res.data) {
      setNewsList(prev => [res.data!, ...prev]);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Friends Actions
  const handleSendFriendRequest = async (recipientId: string) => {
    if (!currentUser) return;
    await api.sendFriendRequest(currentUser.id, recipientId);
  };

  const handleRespondFriendRequest = async (relationId: string, accept: boolean) => {
    if (!currentUser) return;
    const success = await api.respondFriendRequest(relationId, accept);
    if (success) {
      const data = await api.getFriendsData(currentUser.id);
      setFriends(data.friends);
      setIncomingRequests(data.incomingRequests);
    }
  };

  const handleSendMessage = async (toId: string, text: string) => {
    if (!currentUser) return;
    const msg = await api.sendMessage(currentUser.id, toId, text);
    if (msg) {
      setMessages(prev => [...prev, msg]);
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

  // If user is not logged in, render the Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        existingUsers={allUsers.map(u => ({
          name: u.name,
          role: u.role,
          gender: u.gender,
          avatar: u.avatar,
          gradeOrSubject: u.gradeOrSubject,
          schoolClass: u.schoolClass
        }))}
      />
    );
  }

  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white" dir="rtl">
      
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTutorial={() => setShowTutorialModal(true)}
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
            messages={messages}
            onSendFriendRequest={handleSendFriendRequest}
            onRespondRequest={handleRespondFriendRequest}
            onSendMessage={handleSendMessage}
            onRefreshUsers={handleRefreshUsers}
          />
        )}

      </main>

      {/* Footer in White & Gold */}
      <footer className="border-t border-amber-200/80 bg-white text-xs text-slate-500 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">My School · المنصة المدرسية المتكاملة</span>
            <span>·</span>
            <span>بيئة تعليمية ذكية مخصصة للطلاب والمعلمين لمتابعة الدروس والتفاعل الصفي</span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={() => setShowTutorialModal(true)}
              className="text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              دليل استخدام المنصة
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

    </div>
  );
}

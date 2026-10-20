export const SYSTEM_PROMPT_COPY = `
[برومت معماري احترافي لإنتاج منصة My School التعليمية الذكية]

قم ببناء منصة مدرسية متكاملة باسم "My School" بتصميم فاخر يعتمد على اللون الأبيض والذهبي (White & Gold Luxury Academic Palette) مع توافق كامل مع كافة الأجهزة (الهواتف الذكية والأجهزة المكتبية) ودعم اللغة العربية (RTL).

المتطلبات الوظيفية الرئيسية:
1. صفحة تسجيل دخول حقيقية بالاسم فقط (بدون كلمة مرور):
   - يختار المستخدم التسجيل إما كـ "طالب" أو "معلم".
   - يتم الترحيب بالاسم الشخصي المدخل في كافة أرجاء المنصة وفي التعليقات والتفاعلات.
2. قائمة مهام دراسية شخصية حقيقية يضيفها الطالب بنفسه:
   - إضافة المهمة مع تحديد المادة (الفيزياء، الكيمياء، الرياضيات، البرمجة، اللغة العربية، اللغة الإنجليزية، التاريخ)، موعد التسليم، والأولوية.
   - إمكانية تحديد المهمة كمكتملة أو حذفها، مع حفظها في خادم الباك إند.
3. نظام أخبار المواد التعليمية (مع حصر صلاحية النشر للمعلمين فقط):
   - تقسيم الأخبار بدقة إلى: أخبار اللغة العربية، أخبار اللغة الإنجليزية، التاريخ، البرمجة، الكيمياء، الفيزياء، الرياضيات.
   - المعلم فقط هو من يحق له نشر الأخبار والإعلانات.
   - الطلاب يستطيعون القراءة، التصفية حسب المادة، إبداء الإعجاب، وإضافة التعليقات.
4. مكتبة الفيديوهات التعليمية مع الحفظ التلقائي للتقدم:
   - تشغيل الدروس، القفز بين الفصول، وتدوين الملاحظات التفاعلية وحفظها تلقائياً في قاعدة البيانات.
   - نشر الفيديوهات مقتصر على المعلمين المعتمدين.
5. نظام إضافة الأصدقاء والشبكة الصفية:
   - البحث عن زملاء الصف الحقيقيين، إرسال واستقبال طلبات الصداقة، والدردشة المباشرة لحل المسائل.
6. فيديو وشرح تفاعلي بالرسوم المتحركة لكيفية استخدام كافة ميزات المنصة.

المعمارية والتقسيم التقني:
- الفرونت إند (Front-End): React 19 + TypeScript + Tailwind CSS v4 + Motion للأنيميشن بتصميم أبيض وذهبي أنيق.
- الباك إند (Back-End): خادم Node.js / Express بسيط ومستقل يقوم بحفظ قاعدة بيانات المنصة (Users, Tasks, News, Videos, Friends) في ملف دائم (Persistent JSON Database).

تنبيه مهم:
في نهاية الاستجابة، قم بتوفير كود كل لغة وكل ملف في كتلة برمجية منفصلة ومستقلة تماماً (كود الفرونت إند، كود الباك إند) لسهولة النسخ المباشر.
`.trim();

export const BACKEND_CODE_EXPORT = `
/**
 * ========================================================
 * BACK-END SERVER: server.ts
 * Platform: My School
 * Language: Node.js / Express + TypeScript
 * Purpose: Persistent REST API for Tasks, Auth, News, Videos & Friends
 * ========================================================
 */

import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'school_database.json');

app.use(express.json());

// In-Memory & File-based JSON Database
let db = {
  users: [],
  news: [],
  videos: [],
  tasks: [],
  progress: [],
  friends: []
};

// 1. Auth: Login with Name & Role (No Password Required)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { name, role, gradeOrSubject, schoolClass } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'الاسم مطلوب' });

  let user = db.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase() && u.role === role);
  if (!user) {
    user = {
      id: 'u-' + Date.now(),
      name: name.trim(),
      role: role === 'teacher' ? 'teacher' : 'student',
      gradeOrSubject: gradeOrSubject || 'المرحلة الثانوية',
      schoolClass: schoolClass || 'الشعبة 3/أ',
      stats: { gpa: 98.4, attendanceRate: 99.2, points: 1500 }
    };
    db.users.push(user);
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  }
  res.json(user);
});

// 2. Student Real Tasks (Added by Student, Not AI)
app.get('/api/tasks/:studentId', (req: Request, res: Response) => {
  res.json(db.tasks.filter(t => t.studentId === req.params.studentId));
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  const { studentId, title, subject, dueDate, priority, notes } = req.body;
  const task = {
    id: 'task-' + Date.now(),
    studentId,
    title,
    subject: subject || 'الفيزياء',
    dueDate: dueDate || 'قريباً',
    priority: priority || 'عادي',
    completed: false,
    notes: notes || ''
  };
  db.tasks.unshift(task);
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(task);
});

app.patch('/api/tasks/:id/toggle', async (req: Request, res: Response) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (task) {
    task.completed = !task.completed;
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    return res.json(task);
  }
  res.status(404).json({ error: 'المهمة غير موجودة' });
});

// 3. News System (Teacher Role Gated!)
app.get('/api/news', (_req: Request, res: Response) => res.json(db.news));

app.post('/api/news', async (req: Request, res: Response) => {
  const { title, content, category, authorId, authorRole, author } = req.body;
  const user = db.users.find(u => u.id === authorId);
  if (user && user.role !== 'teacher') {
    return res.status(403).json({ error: 'عذراً، النشر مقتصر على المعلمين فقط!' });
  }
  const post = { id: 'news-' + Date.now(), title, content, category, author, authorRole, likes: 0, comments: [] };
  db.news.unshift(post);
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  res.status(201).json(post);
});

// 4. Video Lessons & Student Progress
app.get('/api/videos', (_req: Request, res: Response) => res.json(db.videos));

app.post('/api/progress', async (req: Request, res: Response) => {
  const { studentId, lessonId, progressPct, completed, notes } = req.body;
  const idx = db.progress.findIndex(p => p.studentId === studentId && p.lessonId === lessonId);
  if (idx >= 0) {
    db.progress[idx] = { ...db.progress[idx], progressPct, completed, notes };
  } else {
    db.progress.push({ studentId, lessonId, progressPct, completed, notes });
  }
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log('My School Backend running on port ' + PORT));
`.trim();

export const FRONTEND_CODE_EXPORT = `
/**
 * ========================================================
 * FRONT-END MAIN APP: src/App.tsx
 * Platform: My School
 * Language: React 19 + TypeScript + Tailwind CSS v4
 * Theme: White & Gold Luxury Academic Palette
 * ========================================================
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { NewsSection } from './components/NewsSection';
import { VideoLibrary } from './components/VideoLibrary';
import { FriendsSection } from './components/FriendsSection';
import { api } from './services/api';

export default function MySchoolApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);

  // Authenticate by real name without password
  const handleLogin = async (name, role, gradeOrSubject, schoolClass) => {
    const loggedUser = await api.login(name, role, gradeOrSubject, schoolClass);
    if (loggedUser) setUser(loggedUser);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans" dir="rtl">
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <>
          <Navbar activeTab={activeTab} onSelectTab={setActiveTab} currentUser={user} onLogout={() => setUser(null)} />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {activeTab === 'dashboard' && (
              user.role === 'teacher' ? <TeacherDashboard teacher={user} /> : <StudentDashboard user={user} tasks={tasks} />
            )}
            {activeTab === 'videos' && <VideoLibrary currentUser={user} videos={videos} />}
            {activeTab === 'news' && <NewsSection currentUser={user} newsList={news} />}
            {activeTab === 'friends' && <FriendsSection currentUser={user} />}
          </main>
        </>
      )}
    </div>
  );
}
`.trim();

import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(__dirname, 'data', 'school_database.json');

app.use(express.json({ limit: '25mb' }));

interface DatabaseSchema {
  users: any[];
  news: any[];
  videos: any[];
  tasks: any[];
  progress: any[];
  friends: any[];
  messages: any[];
}

// Clean fresh database: No old news, No fake lessons
const freshDatabase: DatabaseSchema = {
  users: [
    {
      id: 'u-teacher-1',
      name: 'أ. محمد المنصور',
      role: 'teacher',
      gender: 'male',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      gradeOrSubject: 'الفيزياء',
      email: 'm.almansour@myschool.edu',
      schoolClass: 'هيئة التدريس - قسم العلوم',
      badges: ['معلم معتمد في My School'],
      stats: { completedLessons: 0, gpa: 5.0, attendanceRate: 100, points: 2000 }
    },
    {
      id: 'u-teacher-2',
      name: 'أ. مريم الدوسري',
      role: 'teacher',
      gender: 'female',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      gradeOrSubject: 'الكيمياء',
      email: 'm.aldosari@myschool.edu',
      schoolClass: 'هيئة التدريس - قسم العلوم',
      badges: ['معلمة معتمدة في My School'],
      stats: { completedLessons: 0, gpa: 5.0, attendanceRate: 100, points: 2000 }
    },
    {
      id: 'u-student-1',
      name: 'عبدالرحمن الشهري',
      role: 'student',
      gender: 'male',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      gradeOrSubject: 'أولى ثانوي',
      email: 'a.alshehri@myschool.edu',
      schoolClass: '1/3',
      badges: ['طالب في My School'],
      stats: { completedLessons: 0, gpa: 98.5, attendanceRate: 100, points: 500 }
    },
    {
      id: 'u-student-2',
      name: 'سارة الزهراني',
      role: 'student',
      gender: 'female',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      gradeOrSubject: 'ثانية بكالوريا',
      email: 'sara.alzahrani@myschool.edu',
      schoolClass: '2/4',
      badges: ['طالبة في My School'],
      stats: { completedLessons: 0, gpa: 99.2, attendanceRate: 100, points: 650 }
    }
  ],
  news: [],       // Clean: 0 old news
  videos: [],     // Clean: 0 old lessons
  tasks: [],      // Clean: 0 mock tasks
  progress: [],
  friends: [],
  messages: []
};

let db: DatabaseSchema = freshDatabase;

async function initDatabase() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    try {
      const content = await fs.readFile(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      // Ensure seed users exist if empty
      if (!db.users || db.users.length === 0) {
        db.users = freshDatabase.users;
        await persistDB();
      }
    } catch {
      db = freshDatabase;
      await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
    console.log('✨ Database initialized with user persistence and branch structure.');
  } catch (err) {
    console.error('Error initializing database file:', err);
  }
}

async function persistDB() {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

initDatabase();

// --- 1. Real Login / Registration API (Name, Role, Gender, Grade & Branch) ---
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { name, role, gender, gradeOrSubject, schoolClass } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'الرجاء إدخال الاسم للدخول إلى المنصة' });
  }

  const cleanName = name.trim();
  const selectedRole = role === 'teacher' ? 'teacher' : 'student';
  const selectedGender = gender === 'female' ? 'female' : 'male';

  // Check if user already exists
  let existing = db.users.find(u => u.name.toLowerCase() === cleanName.toLowerCase() && u.role === selectedRole);

  if (existing) {
    if (gender) existing.gender = selectedGender;
    if (gradeOrSubject) existing.gradeOrSubject = gradeOrSubject;
    if (schoolClass) existing.schoolClass = schoolClass;
    await persistDB();
    return res.json(existing);
  }

  // Create real persistent user
  const newUser = {
    id: `u-${selectedRole}-${Date.now()}`,
    name: cleanName,
    role: selectedRole,
    gender: selectedGender,
    avatar: selectedGender === 'female'
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      : (selectedRole === 'teacher'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
    gradeOrSubject: gradeOrSubject || (selectedRole === 'teacher' ? 'الفيزياء' : 'أولى ثانوي'),
    email: `${cleanName.replace(/\s+/g, '.').toLowerCase()}@myschool.edu`,
    schoolClass: schoolClass || (selectedRole === 'teacher' ? 'هيئة التدريس' : '1/1'),
    badges: selectedRole === 'teacher' ? ['معلم معتمد في My School'] : ['طالب في My School'],
    stats: selectedRole === 'teacher'
      ? { completedLessons: 0, gpa: 5.0, attendanceRate: 100, points: 2000 }
      : { completedLessons: 0, gpa: 95.0, attendanceRate: 100, points: 500 }
  };

  db.users.push(newUser);
  await persistDB();
  res.status(201).json(newUser);
});

// --- 2. Users directory ---
app.get('/api/users', (req: Request, res: Response) => {
  const role = req.query.role as string;
  if (role) {
    return res.json(db.users.filter(u => u.role === role));
  }
  res.json(db.users);
});

// --- 3. Student Tasks API ---
app.get('/api/tasks/:studentId', (req: Request, res: Response) => {
  const studentTasks = db.tasks.filter(t => t.studentId === req.params.studentId);
  res.json(studentTasks);
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  const { studentId, title, subject, dueDate, priority, notes } = req.body;
  if (!studentId || !title || !title.trim()) {
    return res.status(400).json({ error: 'بيانات المهمة غير مكتملة' });
  }

  const newTask = {
    id: `task-${Date.now()}`,
    studentId,
    title: title.trim(),
    subject: subject || 'الفيزياء',
    dueDate: dueDate || 'قريباً',
    priority: priority || 'عادي',
    completed: false,
    notes: notes || '',
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.tasks.unshift(newTask);
  await persistDB();
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/toggle', async (req: Request, res: Response) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'المهمة غير موجودة' });

  task.completed = !task.completed;
  await persistDB();
  res.json(task);
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'المهمة غير موجودة' });

  db.tasks.splice(idx, 1);
  await persistDB();
  res.json({ success: true, message: 'تم حذف المهمة بنجاح' });
});

// --- 4. News System (Only Teacher can publish, students can comment & like) ---
app.get('/api/news', (_req: Request, res: Response) => {
  res.json(db.news);
});

app.post('/api/news', async (req: Request, res: Response) => {
  const { title, content, category, author, authorId, authorRole, tags, imageUrl } = req.body;

  // STRICT ROLE GATING
  const user = db.users.find(u => u.id === authorId);
  if (user && user.role !== 'teacher') {
    return res.status(403).json({
      error: 'عذراً، نشر الأخبار والإعلانات مقتصر على المعلمين فقط!'
    });
  }

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'يرجى ملء العنوان والمحتوى واختيار المادة' });
  }

  const newPost = {
    id: `news-${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    category,
    author: author || 'المعلم',
    authorId: authorId || 'u-teacher-default',
    authorRole: authorRole || 'معلم المادة',
    date: 'الآن',
    likes: 0,
    comments: [],
    tags: tags && tags.length ? tags : [category, 'My_School'],
    imageUrl
  };

  db.news.unshift(newPost);
  await persistDB();
  res.status(201).json(newPost);
});

app.post('/api/news/:id/like', async (req: Request, res: Response) => {
  const post = db.news.find(n => n.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'المنشور غير موجود' });
  post.likes += 1;
  await persistDB();
  res.json({ success: true, likes: post.likes });
});

app.post('/api/news/:id/comment', async (req: Request, res: Response) => {
  const post = db.news.find(n => n.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'المنشور غير موجود' });

  const { userName, userAvatar, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'التعليق فارغ' });

  const comment = {
    id: `c-${Date.now()}`,
    userName: userName || 'عضو المنصة',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: text.trim(),
    date: 'الآن'
  };

  post.comments.push(comment);
  await persistDB();
  res.status(201).json(comment);
});

// --- 5. Educational Videos & Lessons (Only Teacher can publish within their subject) ---
app.get('/api/videos', (req: Request, res: Response) => {
  const subject = req.query.subject as string;
  if (subject && subject !== 'all') {
    return res.json(db.videos.filter(v => v.subject === subject));
  }
  res.json(db.videos);
});

app.post('/api/videos', async (req: Request, res: Response) => {
  const { title, subject, teacherId, teacherName, duration, videoUrl, mediaType, mediaData, description, chapters } = req.body;

  // STRICT ROLE GATING
  const author = db.users.find(u => u.id === teacherId);
  if (author && author.role !== 'teacher') {
    return res.status(403).json({ error: 'عذراً، إضافة الدروس والفيديوهات والصور مخصصة للمعلمين فقط' });
  }

  if (!title || !subject) {
    return res.status(400).json({ error: 'عنوان الدرس والمادة مطلوبان' });
  }

  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title.trim(),
    subject,
    teacherId: teacherId || 'u-teacher-default',
    teacherName: teacherName || 'المعلم',
    duration: duration || '15:00',
    durationSeconds: 900,
    mediaType: mediaType || 'video', // 'video' | 'image'
    videoUrl: videoUrl || '',
    mediaData: mediaData || '', // Base64 or uploaded image/video url
    thumbnail: mediaType === 'image' ? (mediaData || videoUrl) : '',
    description: description || 'محتوى تعليمي أضيف بواسطة المعلم داخل مادته.',
    views: 0,
    chapters: chapters && chapters.length ? chapters : [
      { title: 'بداية الشرح', time: '00:00', timestamp: 0 }
    ],
    comments: [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.videos.unshift(newVideo);
  await persistDB();
  res.status(201).json(newVideo);
});

// Comments on lesson / video
app.post('/api/videos/:id/comment', async (req: Request, res: Response) => {
  const video = db.videos.find(v => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'الدرس غير موجود' });

  const { userName, userAvatar, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'التعليق فارغ' });

  if (!video.comments) video.comments = [];
  const comment = {
    id: `vc-${Date.now()}`,
    userName: userName || 'طالب',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: text.trim(),
    date: 'الآن'
  };

  video.comments.push(comment);
  await persistDB();
  res.status(201).json(comment);
});

// --- 6. Student Lesson Progress Tracking ---
app.get('/api/progress/:studentId', (req: Request, res: Response) => {
  const list = db.progress.filter(p => p.studentId === req.params.studentId);
  res.json(list);
});

app.post('/api/progress', async (req: Request, res: Response) => {
  const { studentId, lessonId, progressPct, completed, notes } = req.body;
  if (!studentId || !lessonId) {
    return res.status(400).json({ error: 'معرف الطالب والدرس مطلوبان' });
  }

  const existingIdx = db.progress.findIndex(p => p.studentId === studentId && p.lessonId === lessonId);
  const now = new Date().toISOString().split('T')[0];

  if (existingIdx >= 0) {
    db.progress[existingIdx] = {
      ...db.progress[existingIdx],
      progressPct: Math.min(100, Math.max(0, progressPct ?? db.progress[existingIdx].progressPct)),
      completed: completed ?? db.progress[existingIdx].completed,
      notes: notes ?? db.progress[existingIdx].notes,
      lastUpdated: now
    };
    await persistDB();
    return res.json(db.progress[existingIdx]);
  } else {
    const record = {
      studentId,
      lessonId,
      progressPct: Math.min(100, Math.max(0, progressPct ?? 0)),
      completed: !!completed,
      notes: notes || '',
      lastUpdated: now
    };
    db.progress.push(record);
    await persistDB();
    return res.status(201).json(record);
  }
});

// --- 7. Friends & Relations System ---
app.get('/api/friends/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const accepted = db.friends.filter(
    r => (r.requesterId === userId || r.recipientId === userId) && r.status === 'accepted'
  );

  const pendingIncoming = db.friends.filter(
    r => r.recipientId === userId && r.status === 'pending'
  );

  const friendUserIds = accepted.map(r => r.requesterId === userId ? r.recipientId : r.requesterId);
  const friendsList = db.users.filter(u => friendUserIds.includes(u.id));

  const incomingRequests = pendingIncoming.map(r => ({
    relationId: r.id,
    user: db.users.find(u => u.id === r.requesterId),
    createdAt: r.createdAt
  }));

  res.json({
    friends: friendsList,
    incomingRequests
  });
});

app.post('/api/friends/request', async (req: Request, res: Response) => {
  const { requesterId, recipientId } = req.body;
  if (!requesterId || !recipientId || requesterId === recipientId) {
    return res.status(400).json({ error: 'بيانات الطلب غير صالحة' });
  }

  const existing = db.friends.find(
    r => (r.requesterId === requesterId && r.recipientId === recipientId) ||
         (r.requesterId === recipientId && r.recipientId === requesterId)
  );

  if (existing) {
    return res.status(400).json({ error: 'يوجد طلب مسبق أو صداقة قائمة بالفعل' });
  }

  const newRel = {
    id: `fr-${Date.now()}`,
    requesterId,
    recipientId,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.friends.push(newRel);
  await persistDB();
  res.status(201).json({ success: true, relation: newRel });
});

app.post('/api/friends/respond', async (req: Request, res: Response) => {
  const { relationId, accept } = req.body;
  const rel = db.friends.find(r => r.id === relationId);
  if (!rel) return res.status(404).json({ error: 'الطلب غير موجود' });

  rel.status = accept ? 'accepted' : 'rejected';
  await persistDB();
  res.json({ success: true, status: rel.status });
});

// --- 8. Messages ---
app.get('/api/messages', (req: Request, res: Response) => {
  const { userA, userB } = req.query;
  if (!userA || !userB) return res.json(db.messages);

  const thread = db.messages.filter(
    m => (m.fromId === userA && m.toId === userB) || (m.fromId === userB && m.toId === userA)
  );
  res.json(thread);
});

app.post('/api/messages', async (req: Request, res: Response) => {
  const { fromId, toId, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'الرسالة فارغة' });

  const msg = {
    id: `m-${Date.now()}`,
    fromId,
    toId,
    text: text.trim(),
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  };

  db.messages.push(msg);
  await persistDB();
  res.status(201).json(msg);
});

// Vite Middleware & Static Serving
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const distIndexExists = fsSync.existsSync(path.join(distPath, 'index.html'));
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start' ||
    (distIndexExists && process.env.NODE_ENV !== 'development' && process.env.npm_lifecycle_event !== 'dev');

  if (isProduction) {
    console.log('📦 Serving production static bundle from:', distPath);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('⚡ Initializing Vite development middleware...');
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 My School Platform successfully listening at http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  });
}

startServer();

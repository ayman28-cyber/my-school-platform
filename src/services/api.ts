import { User, NewsItem, VideoLesson, StudentProgress, Comment, ChatMessage, StudentTask } from '../types';

export const api = {
  // 1. Auth: Real Login by Name & Role & Gender (no password required)
  async login(name: string, role: 'student' | 'teacher', gender?: 'male' | 'female', gradeOrSubject?: string, schoolClass?: string): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, gender, gradeOrSubject, schoolClass })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback local storage creation
    }
    const fallbackUser: User = {
      id: `u-${role}-${Date.now()}`,
      name: name.trim(),
      role,
      gender: gender || 'male',
      avatar: gender === 'female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
        : (role === 'teacher'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
      gradeOrSubject: gradeOrSubject || (role === 'teacher' ? 'الفيزياء' : 'أولى ثانوي'),
      email: `${name.replace(/\s+/g, '.').toLowerCase()}@myschool.edu`,
      schoolClass: schoolClass || (role === 'teacher' ? 'هيئة التدريس' : '1/1'),
      badges: [role === 'teacher' ? 'معلم في My School' : 'طالب في My School'],
      stats: { completedLessons: 0, gpa: 96.0, attendanceRate: 100, points: 500 }
    };
    return fallbackUser;
  },

  // 2. Users directory
  async getUsers(role?: string): Promise<User[]> {
    try {
      const url = role ? `/api/users?role=${role}` : '/api/users';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Return empty
    }
    return [];
  },

  // 3. Student Tasks (User-driven task manager)
  async getTasks(studentId: string): Promise<StudentTask[]> {
    try {
      const res = await fetch(`/api/tasks/${studentId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async createTask(taskData: {
    studentId: string;
    title: string;
    subject: string;
    dueDate: string;
    priority: 'عاجل' | 'متوسط' | 'عادي';
    notes?: string;
  }): Promise<StudentTask | null> {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  async toggleTask(taskId: string): Promise<StudentTask | null> {
    try {
      const res = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'PATCH'
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 4. News
  async getNews(): Promise<NewsItem[]> {
    try {
      const res = await fetch('/api/news');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async createNews(post: Partial<NewsItem>): Promise<{ success: boolean; data?: NewsItem; error?: string }> {
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      const data = await res.json();
      if (res.ok) return { success: true, data };
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'تعذر الاتصال بالخادم' };
    }
  },

  async likeNews(id: string): Promise<{ success: boolean; likes: number }> {
    try {
      const res = await fetch(`/api/news/${id}/like`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: false, likes: 0 };
  },

  async addComment(newsId: string, data: { userName: string; userAvatar: string; text: string }): Promise<Comment | null> {
    try {
      const res = await fetch(`/api/news/${newsId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // 5. Videos
  async getVideos(): Promise<VideoLesson[]> {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async publishVideo(video: Partial<VideoLesson>): Promise<{ success: boolean; data?: VideoLesson; error?: string }> {
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video)
      });
      const data = await res.json();
      if (res.ok) return { success: true, data };
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'تعذر الاتصال بالخادم' };
    }
  },

  async commentOnVideo(videoId: string, data: { userName: string; userAvatar: string; text: string }): Promise<Comment | null> {
    try {
      const res = await fetch(`/api/videos/${videoId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // 6. Progress
  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      const res = await fetch(`/api/progress/${studentId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async saveProgress(data: {
    studentId: string;
    lessonId: string;
    progressPct: number;
    completed?: boolean;
    notes?: string;
  }): Promise<StudentProgress | null> {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  // 7. Friends
  async getFriendsData(userId: string): Promise<{
    friends: User[];
    incomingRequests: { relationId: string; user?: User; createdAt: string }[];
  }> {
    try {
      const res = await fetch(`/api/friends/${userId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { friends: [], incomingRequests: [] };
  },

  async sendFriendRequest(requesterId: string, recipientId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId, recipientId })
      });
      const data = await res.json();
      if (res.ok) return { success: true };
      return { success: false, message: data.error };
    } catch {
      return { success: false, message: 'تعذر الاتصال بالخادم' };
    }
  },

  async respondFriendRequest(relationId: string, accept: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationId, accept })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 8. Messages
  async getMessages(userA: string, userB: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`/api/messages?userA=${userA}&userB=${userB}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  },

  async sendMessage(fromId: string, toId: string, text: string): Promise<ChatMessage | null> {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromId, toId, text })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  }
};

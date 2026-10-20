export type UserRole = 'student' | 'teacher';

export type SubjectCategory = 
  | 'اللغة العربية' 
  | 'اللغة الإنجليزية' 
  | 'التاريخ' 
  | 'البرمجة' 
  | 'الكيمياء' 
  | 'الفيزياء' 
  | 'الرياضيات';

export const FIRST_SECONDARY_BRANCHES = [
  '1/1', '1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/9', '1/10', '1/11', '1/12'
];

export const SECOND_BACCALAUREATE_BRANCHES = [
  '2/1', '2/2', '2/3', '2/4', '2/5', '2/6', '2/7', '2/8', '2/9'
];

export interface UserStats {
  completedLessons: number;
  gpa: number;
  attendanceRate: number;
  points: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  gender?: 'male' | 'female';
  avatar: string;
  gradeOrSubject: string;
  email: string;
  schoolClass?: string;
  badges?: string[];
  stats?: UserStats;
}

export interface StudentTask {
  id: string;
  studentId: string;
  title: string;
  subject: SubjectCategory;
  dueDate: string;
  priority: 'عاجل' | 'متوسط' | 'عادي';
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: SubjectCategory | 'إعلانات عامة' | 'تكريمات';
  author: string;
  authorId: string;
  authorRole: string;
  date: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  imageUrl?: string;
}

export interface VideoChapter {
  title: string;
  time: string;
  timestamp: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: SubjectCategory | 'التوجيه والإرشاد';
  teacherId: string;
  teacherName: string;
  duration: string;
  durationSeconds: number;
  mediaType?: 'video' | 'image';
  videoUrl?: string;
  mediaData?: string;
  thumbnail?: string;
  description: string;
  views: number;
  chapters?: VideoChapter[];
  comments?: Comment[];
  createdAt: string;
}

export interface StudentProgress {
  studentId: string;
  lessonId: string;
  progressPct: number;
  completed: boolean;
  notes: string;
  lastUpdated: string;
}

export interface FriendRelation {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: string;
}

export interface WalkthroughStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  targetView: string;
  videoTime: string;
  featureBadge: string;
  iconName: string;
  keyPoints: string[];
}

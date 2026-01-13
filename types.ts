export type TaskStatus = 'done' | 'ongoing';

export interface Task {
  id: string;
  subHeading: string;
  name: string;
  description: string;
  link?: string;
  status?: TaskStatus;
  timestamp: number;
}

export interface DailyReportConfig {
  useAI: boolean;
  tone: 'professional' | 'casual' | 'bullet-points';
}

export type ReportStatus = 'idle' | 'generating' | 'success' | 'error';

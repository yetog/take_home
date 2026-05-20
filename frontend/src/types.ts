export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface ActivityLog {
  timestamp: string;
  old_status: boolean;
  new_status: boolean;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
}

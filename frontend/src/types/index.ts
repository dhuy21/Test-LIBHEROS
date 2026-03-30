export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TaskList {
  id: number;
  name: string;
  createdAt: string;
}

export interface Task {
  id: number;
  shortDescription: string;
  longDescription: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  taskListId: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

import type { ReactNode } from "react";

export interface ModalBaseProps {

  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;

  /** @deprecated - используйте onPrimaryAction */
  onSubmit?: () => void;
  /** @deprecated - используйте disablePrimary */
  disableSubmit?: boolean;

  primaryBtnText?: string;
  secondaryBtnText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  disablePrimary?: boolean;
  disableSecondary?: boolean;
  showActions?: boolean;
  isLoading?: boolean;
  primaryBtnColor?: string;
  secondaryBtnColor?: string;

  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  dividers?: boolean;
}

export interface AddTaskFormValues {
  title: string;
  priority: TaskPriority;
  dueDate: string;
  tags: string;
  assignee: string[];
}

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: AddTaskFormValues) => void;
}

export interface TaskFormData {
  title: string;
  priority: TaskPriority;
  deadline: string | null;
  tags: string;
  assignee: string[];
}

export interface CSVTask {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  deadline?: string;
  assigneeIds?: string[];
  authorId?: string;
}

export interface CreateTaskModalProps {
  onCreateTask: (taskData: any) => Promise<void>;
  onCreateTasksBatch?: (tasksData: any[]) => Promise<void>;
  currentUserId: string;
  isSubmitting?: boolean;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";
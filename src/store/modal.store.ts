import { create } from "zustand";
import type { Task } from "@/types/types";

interface ModalStore {
	isCreateTaskModalOpen: boolean;
	openCreateTaskModal: () => void;
	closeCreateTaskModal: () => void;

	isEditTaskModalOpen: boolean;
	editingTask: Task | null;
	openEditTaskModal: (task: Task) => void;
	closeEditTaskModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	isCreateTaskModalOpen: false,
	openCreateTaskModal: () => set({ isCreateTaskModalOpen: true }),
	closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false }),

	isEditTaskModalOpen: false,
	editingTask: null,
	openEditTaskModal: (task) =>
		set({
			isEditTaskModalOpen: true,
			editingTask: task,
		}),
	closeEditTaskModal: () =>
		set({
			isEditTaskModalOpen: false,
			editingTask: null,
		}),
}));

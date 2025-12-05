import { create } from "zustand";
import type { Task } from "@/types/types";

interface ModalStore {
	isTaskModalOpen: boolean;
	editingTask: Task | null;
	openTaskModal: (task?: Task | null) => void;
	closeTaskModal: () => void;

	isUserSelectModalOpen: boolean;
	openUserSelectModal: () => void;
	closeUserSelectModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	isTaskModalOpen: false,
	editingTask: null,
	openTaskModal: (task = null) =>
		set({
			isTaskModalOpen: true,
			editingTask: task,
		}),
	closeTaskModal: () =>
		set({
			isTaskModalOpen: false,
			editingTask: null,
		}),

	isUserSelectModalOpen: false,
	openUserSelectModal: () => set({ isUserSelectModalOpen: true }),
	closeUserSelectModal: () => set({ isUserSelectModalOpen: false }),
}));

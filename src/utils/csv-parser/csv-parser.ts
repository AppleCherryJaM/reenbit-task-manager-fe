export async function parseCSVToTasks(file: File): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const csvText = event.target?.result as string;
				const lines = csvText.split("\n").filter((line) => line.trim());

				if (lines.length < 2) {
					reject(new Error("CSV file must have at least a header and one data row"));
					return;
				}

				const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

				if (!headers.includes("title")) {
					reject(new Error("CSV must contain 'title' column"));
					return;
				}

				const tasks: any[] = [];

				// Обрабатываем ВСЕ строки данных
				for (let i = 1; i < lines.length; i++) {
					const values = lines[i].split(",").map((v) => v.trim());
					const task: any = {};

					headers.forEach((header, index) => {
						const value = values[index] || "";

						// Для assigneeIds преобразуем строку в массив
						if (header === "assigneeids" && value) {
							task.assigneeIds = value
								.split(",")
								.map((id: string) => id.trim())
								.filter((id: string) => id.length > 0);
						} else if (value) {
							// Приводим к camelCase
							const camelCaseKey = header === "authorid" ? "authorId" : header;
							task[camelCaseKey] = value;
						}
					});

					// Нормализуем значения
					if (task.priority) {
						task.priority = task.priority.toLowerCase();
					}

					if (task.status) {
						task.status = task.status.toLowerCase().replace(" ", "_");
					}

					// Добавляем задачу только если есть title
					if (task.title) {
						tasks.push(task);
					}
				}

				if (tasks.length === 0) {
					reject(new Error("No valid tasks found in CSV file"));
					return;
				}

				resolve(tasks);
			} catch (_error) {
				reject(new Error("Invalid CSV format"));
			}
		};

		reader.onerror = () => {
			reject(new Error("Failed to read file"));
		};

		reader.readAsText(file);
	});
}

export async function parseCSVToTasks(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const tasks = parseCSVContent(csvText);
        resolve(tasks);
      } catch (_error) {
        reject(new Error("Failed to parse CSV file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
}

function parseCSVContent(csvText: string): any[] {
  const lines = csvText.split("\n").filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error("CSV file must have at least a header and one data row");
  }

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());

  if (!headers.includes("title")) {
    throw new Error("CSV must contain 'title' column");
  }
  
  const tasks: any[] = [];
  
  if (lines.length > 1) {
    const values = lines[1].split(",").map(v => v.trim());
    const task: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];

      if (value) {
        task[header] = value;
      }

    });

    if (task.priority) {
      task.priority = task.priority.toLowerCase();
    }
    
    if (task.status) {
      task.status = task.status.toLowerCase().replace(" ", "_");
    }
    
    tasks.push(task);
  }
  
  return tasks;
}
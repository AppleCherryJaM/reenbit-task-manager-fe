import "./App.css";
import TasksPage from "./pages/task-page/TasksPage";
import { ToastProvider } from "./providers/ToastProvider";

function App() {
	return (
		<ToastProvider>
			<TasksPage />
		</ToastProvider>
	);
}

export default App;

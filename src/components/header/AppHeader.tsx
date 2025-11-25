import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Avatar, Badge, Box, IconButton, InputBase, Toolbar } from "@mui/material";

export default function AppHeader() {
	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{
				bgcolor: "#fff",
				color: "#000",
				borderBottom: "1px solid #e5e7eb",
				px: 3,
			}}
		>
			<Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						bgcolor: "#F1F3F5",
						px: 2,
						py: 0.7,
						borderRadius: 2,
						width: 320,
					}}
				>
					<SearchIcon sx={{ mr: 1, color: "gray" }} />
					<InputBase placeholder="Search tasks..." fullWidth />
				</Box>

				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
					<IconButton>
						<Badge badgeContent={3} color="error">
							<NotificationsNoneIcon fontSize="medium" />
						</Badge>
					</IconButton>

					<IconButton>
						<Avatar sx={{ bgcolor: "#4F46E5" }}>M</Avatar>
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	IconButton,
	InputBase,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import { useState } from "react";
import type { AppHeaderProps } from "./app-header.type";

export default function AppHeader({ onLogout }: AppHeaderProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleClose();
		if (onLogout) {
			onLogout();
		}
	};

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

					<IconButton onClick={handleMenuClick}>
						<Avatar sx={{ bgcolor: "#4F46E5", cursor: "pointer" }}>M</Avatar>
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
					>
						<MenuItem onClick={handleClose}>
							<Typography>Profile</Typography>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<Typography>Settings</Typography>
						</MenuItem>
						<MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
							<Typography>Logout</Typography>
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

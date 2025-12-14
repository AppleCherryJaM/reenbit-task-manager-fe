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
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import type { AppHeaderProps } from "./app-header.type";

export default function AppHeader({ onLogout }: AppHeaderProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
				px: { xs: 1.5, sm: 3 },
			}}
		>
			<Toolbar
				disableGutters
				sx={{
					display: "flex",
					justifyContent: "space-between",
					minHeight: { xs: 56, sm: 64 },
				}}
			>
				{!isMobile ? (
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
				) : (
					<Box sx={{ width: 40 }} />
				)}

				<Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
					<IconButton size={isMobile ? "medium" : "large"}>
						<Badge badgeContent={3} color="error">
							<NotificationsNoneIcon fontSize="medium" />
						</Badge>
					</IconButton>

					<IconButton onClick={handleMenuClick} size={isMobile ? "medium" : "large"}>
						<Avatar
							sx={{ bgcolor: "#4F46E5", width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}
						>
							M
						</Avatar>
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
						slotProps={{
							paper: {
								sx: { mt: 1, minWidth: 160 },
							},
						}}
					>
						<MenuItem onClick={handleClose}>Profile</MenuItem>
						<MenuItem onClick={handleClose}>Settings</MenuItem>
						<MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
							Logout
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

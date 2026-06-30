import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  {
    label: "All Notifications",
    path: "/",
    icon: <NotificationsActiveIcon fontSize="small" />
  },
  {
    label: "Priority Notifications",
    path: "/priority",
    icon: <PriorityHighIcon fontSize="small" />
  }
];

export function Layout() {
  return (
    <Box className="app-shell">
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar className="topbar">
          <Typography variant="h6" component="div" className="brand">
            Affordmed Notifications
          </Typography>
          <Stack direction="row" spacing={1} className="nav-actions">
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                startIcon={item.icon}
                className="nav-link"
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="page-container">
        <Outlet />
      </Container>
    </Box>
  );
}

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <Drawer variant="permanent">
      <List>

        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/meus-chamados">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Meus Chamados" />
        </ListItemButton>

        <ListItemButton component={Link} to="/abrir-chamado">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Abrir Chamado" />
        </ListItemButton>

        <ListItemButton component={Link} to="/configuracoes">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}

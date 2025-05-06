import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Badge,
  Collapse,
  List,
  Box,
  Tooltip,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

const MainListItems = ({ drawerClose }) => {
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openAdminSubmenu, setOpenAdminSubmenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  useEffect(() => {
    // Check if the current path is under admin section and expand submenu
    const isAdminPath = location.pathname.includes('/users') || 
                         location.pathname.includes('/queues') || 
                         location.pathname.includes('/settings');
    
    if (isAdminPath) {
      setOpenAdminSubmenu(true);
    }
  }, [location]);

  const handleAdminSubmenuClick = () => {
    setOpenAdminSubmenu(!openAdminSubmenu);
  };

  return (
    <Box onClick={drawerClose} sx={{ width: '100%' }}>
      <ListItemButton 
        component={RouterLink} 
        to="/"
        selected={location.pathname === '/'}
      >
        <ListItemIcon>
          <DashboardOutlinedIcon color={location.pathname === '/' ? "primary" : "inherit"} />
        </ListItemIcon>
        <ListItemText primary={i18n.t("mainDrawer.listItems.dashboard")} />
      </ListItemButton>
      
      <ListItemButton 
        component={RouterLink} 
        to="/connections"
        selected={location.pathname.startsWith('/connections')}
      >
        <ListItemIcon>
          <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
            <SyncAltIcon color={location.pathname.startsWith('/connections') ? "primary" : "inherit"} />
          </Badge>
        </ListItemIcon>
        <ListItemText primary={i18n.t("mainDrawer.listItems.connections")} />
      </ListItemButton>
      
      <ListItemButton 
        component={RouterLink} 
        to="/tickets"
        selected={location.pathname.startsWith('/tickets')}
      >
        <ListItemIcon>
          <WhatsAppIcon color={location.pathname.startsWith('/tickets') ? "primary" : "inherit"} />
        </ListItemIcon>
        <ListItemText primary={i18n.t("mainDrawer.listItems.tickets")} />
      </ListItemButton>

      <ListItemButton 
        component={RouterLink} 
        to="/contacts"
        selected={location.pathname.startsWith('/contacts')}
      >
        <ListItemIcon>
          <ContactPhoneOutlinedIcon color={location.pathname.startsWith('/contacts') ? "primary" : "inherit"} />
        </ListItemIcon>
        <ListItemText primary={i18n.t("mainDrawer.listItems.contacts")} />
      </ListItemButton>
      
      <ListItemButton 
        component={RouterLink} 
        to="/quickAnswers"
        selected={location.pathname.startsWith('/quickAnswers')}
      >
        <ListItemIcon>
          <QuestionAnswerOutlinedIcon color={location.pathname.startsWith('/quickAnswers') ? "primary" : "inherit"} />
        </ListItemIcon>
        <ListItemText primary={i18n.t("mainDrawer.listItems.quickAnswers")} />
      </ListItemButton>

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider sx={{ my: 2 }} />
            
            <ListItemButton onClick={handleAdminSubmenuClick}>
              <ListItemIcon>
                <SettingsOutlinedIcon color={openAdminSubmenu ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("mainDrawer.listItems.administration")} />
              {openAdminSubmenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={openAdminSubmenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to="/users"
                  selected={location.pathname.startsWith('/users')}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <PeopleAltOutlinedIcon 
                      color={location.pathname.startsWith('/users') ? "primary" : "inherit"}
                      fontSize="small"
                    />
                  </ListItemIcon>
                  <ListItemText primary={i18n.t("mainDrawer.listItems.users")} />
                </ListItemButton>
                
                <ListItemButton 
                  component={RouterLink} 
                  to="/queues"
                  selected={location.pathname.startsWith('/queues')}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AccountTreeOutlinedIcon 
                      color={location.pathname.startsWith('/queues') ? "primary" : "inherit"} 
                      fontSize="small"
                    />
                  </ListItemIcon>
                  <ListItemText primary={i18n.t("mainDrawer.listItems.queues")} />
                </ListItemButton>
                
                <ListItemButton 
                  component={RouterLink} 
                  to="/settings"
                  selected={location.pathname.startsWith('/settings')}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <SettingsOutlinedIcon 
                      color={location.pathname.startsWith('/settings') ? "primary" : "inherit"} 
                      fontSize="small"
                    />
                  </ListItemIcon>
                  <ListItemText primary={i18n.t("mainDrawer.listItems.settings")} />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
      />
    </Box>
  );
};

export default MainListItems;

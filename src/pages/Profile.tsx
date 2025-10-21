// src/components/Profile.tsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import ProfileTab from './ProfileTab';
import UserManagementTab from './UserManagementTab';
import TaskAssignmentTab from './TaskAssignmentTab';
import AppConstants from '../api/AppConstants';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const localUser = localStorage.getItem('user');
  const parsedUser = localUser ? JSON.parse(localUser).data ? JSON.parse(localUser).data : JSON.parse(localUser) : null;
  const isAdmin = parsedUser?.role === AppConstants.UserRolesString.Admin;
  const [tabValue, setTabValue] = useState(0);

  // Define all tabs
  const tabs = [
    {
      label: 'My Profile',
      icon: <PersonIcon />,
      component: <ProfileTab />,
      showFor: 'all'
    },
    {
      label: 'User Management',
      icon: <GroupIcon />,
      component: <UserManagementTab />,
      showFor: 'admin'
    },
    {
      label: 'Task Assignment',
      icon: <AssignmentIcon />,
      component: <TaskAssignmentTab />,
      showFor: 'admin'
    }
  ];

  // Filter tabs based on role
  const visibleTabs = tabs.filter(tab => 
    tab.showFor === 'all' || (tab.showFor === 'admin' && isAdmin)
  );

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Card sx={{ maxWidth: 1200, margin: 'auto' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {isAdmin ? 'Admin Dashboard' : 'Profile'}
          </Typography>

          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            {visibleTabs.map((tab, index) => (
              <Tab 
                key={tab.label}
                icon={tab.icon} 
                label={tab.label} 
                iconPosition="start"
              />
            ))}
          </Tabs>

          {visibleTabs.map((tab, index) => (
            <TabPanel key={tab.label} value={tabValue} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
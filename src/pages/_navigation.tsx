import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined'
import ForkRightOutlinedIcon from '@mui/icons-material/ForkRightOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined'
import { type ComponentType, type ReactNode } from 'react'

import { navigationItems } from './_navigation-meta'
import ConnectionsPage from './connections'
import HomePage from './home'
import HomeDiagnostics from './home-diagnostics'
import LogsPage from './logs'
import NodesPage from './nodes'
import ProfilePage from './profiles'
import ProxyPage from './proxies'
import RulesPage from './rules'
import SettingPage from './settings'
import UnlockPage from './unlock'

type NavigationItem = {
  label: (typeof navigationItems)[keyof typeof navigationItems]['label']
  path: string
  icon: ReactNode
  Component: ComponentType
}

export const navItems: NavigationItem[] = [
  {
    label: navigationItems.home.label,
    path: '/diagnostics/overview',
    icon: null,
    Component: HomeDiagnostics,
  },
  {
    label: navigationItems.proxies.label,
    path: '/diagnostics/proxies',
    icon: null,
    Component: ProxyPage,
  },
  {
    ...navigationItems.home,
    icon: <HomeOutlinedIcon />,
    Component: HomePage,
  },
  {
    ...navigationItems.proxies,
    icon: <WifiOutlinedIcon />,
    Component: NodesPage,
  },
  {
    ...navigationItems.profiles,
    icon: <DnsOutlinedIcon />,
    Component: ProfilePage,
  },
  {
    ...navigationItems.connections,
    icon: <LanguageOutlinedIcon />,
    Component: ConnectionsPage,
  },
  {
    ...navigationItems.rules,
    icon: <ForkRightOutlinedIcon />,
    Component: RulesPage,
  },
  {
    ...navigationItems.logs,
    icon: <SubjectOutlinedIcon />,
    Component: LogsPage,
  },
  {
    ...navigationItems.unlock,
    icon: <LockOpenOutlinedIcon />,
    Component: UnlockPage,
  },
  {
    ...navigationItems.settings,
    icon: <SettingsOutlinedIcon />,
    Component: SettingPage,
  },
]

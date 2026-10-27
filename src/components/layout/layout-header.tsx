import { DnsOutlined, SettingsOutlined } from '@mui/icons-material'
import { Badge, Box, ButtonBase, IconButton, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import appIcon from '@/assets/image/app-icon.svg'
import { useUpdate } from '@/hooks/use-update'
import { useWindowDecorations } from '@/hooks/use-window'

import { WindowControls } from './window-controller'

export const LayoutHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { decorated } = useWindowDecorations()
  const { updateInfo } = useUpdate()

  return (
    <Box component="header" className="clashx-header" data-tauri-drag-region>
      <ButtonBase
        className="clashx-brand"
        aria-label={t('layout.redesign.backToHome')}
        onClick={() => navigate('/')}
      >
        <Box component="img" src={appIcon} alt="" />
        ClashX
      </ButtonBase>
      <Box className="page-drag-region" data-tauri-drag-region />
      <Box component="nav" className="clashx-navigation">
        <Tooltip title={t('layout.components.navigation.tabs.profiles')}>
          <IconButton
            aria-label={t('layout.components.navigation.tabs.profiles')}
            aria-pressed={pathname === '/profile'}
            onClick={() => navigate('/profile')}
          >
            <DnsOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            updateInfo?.available
              ? t('layout.redesign.updateAvailable', {
                  version: updateInfo.version,
                })
              : t('layout.components.navigation.tabs.settings')
          }
        >
          <IconButton
            aria-label={t('layout.components.navigation.tabs.settings')}
            aria-pressed={pathname === '/settings'}
            onClick={() => navigate('/settings')}
          >
            <Badge
              variant="dot"
              color="error"
              invisible={!updateInfo?.available}
            >
              <SettingsOutlined />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      {decorated === false && (
        <Box className="page-window-controls">
          <WindowControls />
        </Box>
      )}
    </Box>
  )
}

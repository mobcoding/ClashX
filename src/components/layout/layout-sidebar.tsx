import { DragDropProvider, KeyboardSensor, PointerSensor } from '@dnd-kit/react'
import { Box, List, Menu, MenuItem, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import appIcon from '@/assets/image/app-icon.svg'
import { useAppUptime } from '@/hooks/use-system-state'
import { useUpdate } from '@/hooks/use-update'
import { useVerge } from '@/hooks/use-verge'
import { useNavMenuOrder } from '@/pages/_layout/hooks'
import { primaryNavItems } from '@/pages/_navigation'
import { useSystemData } from '@/providers/app-data-context'

import { SortableItem } from '../base'

import { LayoutItem } from './layout-item'

type MenuContextPosition = { top: number; left: number }

interface LayoutSidebarProps {
  isDark: boolean
  isCollapsed: boolean
}

const SENSORS = [PointerSensor, KeyboardSensor]

export const LayoutSidebar = (props: LayoutSidebarProps) => {
  const { isCollapsed } = props
  const uptime = useAppUptime()
  const seconds = Math.floor(uptime / 1000)
  const elapsed = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
  const { runningMode } = useSystemData()
  const coreRunning = runningMode === 'Service' || runningMode === 'Sidecar'
  const { t } = useTranslation()
  const { updateInfo } = useUpdate()
  const updateIndicator = updateInfo?.available ? (
    <Box
      component="span"
      role="img"
      aria-label={t('layout.redesign.updateAvailable', {
        version: updateInfo.version,
      })}
      title={t('layout.redesign.updateAvailable', {
        version: updateInfo.version,
      })}
      sx={{
        position: 'absolute',
        right: isCollapsed ? 6 : 14,
        top: isCollapsed ? 6 : 'calc(50% - 3px)',
        width: 6,
        height: 6,
        borderRadius: '50%',
        bgcolor: 'error.main',
        pointerEvents: 'auto',
      }}
    />
  ) : null
  const { verge, mutateVerge, patchVerge } = useVerge()
  const [menuUnlocked, setMenuUnlocked] = useState(false)
  const [menuContextPosition, setMenuContextPosition] =
    useState<MenuContextPosition | null>(null)

  const handleMenuOrderOptimisticUpdate = useCallback(
    (order: string[]) => {
      mutateVerge(
        (prev) => (prev ? { ...prev, menu_order: order } : prev),
        false,
      )
    },
    [mutateVerge],
  )

  const handleMenuOrderPersist = useCallback(
    (order: string[]) => patchVerge({ menu_order: order }),
    [patchVerge],
  )

  const {
    menuOrder,
    navItemMap,
    handleMenuDragEnd,
    isDefaultOrder,
    resetMenuOrder,
  } = useNavMenuOrder({
    enabled: menuUnlocked,
    items: primaryNavItems,
    storedOrder: verge?.menu_order,
    onOptimisticUpdate: handleMenuOrderOptimisticUpdate,
    onPersist: handleMenuOrderPersist,
  })

  const handleMenuContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setMenuContextPosition({ top: event.clientY, left: event.clientX })
    },
    [],
  )

  const handleMenuContextClose = useCallback(() => {
    setMenuContextPosition(null)
  }, [])

  const handleResetMenuOrder = useCallback(() => {
    setMenuContextPosition(null)
    void resetMenuOrder()
  }, [resetMenuOrder])

  const handleUnlockMenu = useCallback(() => {
    setMenuUnlocked(true)
    setMenuContextPosition(null)
  }, [])

  const handleLockMenu = useCallback(() => {
    setMenuUnlocked(false)
    setMenuContextPosition(null)
  }, [])

  const handleToggleNavCollapsed = useCallback(() => {
    setMenuContextPosition(null)
    void patchVerge({ collapse_navbar: !isCollapsed })
  }, [isCollapsed, patchVerge])

  // Navigation menu items
  const navMenuItems = menuOrder.map((path, index) => {
    const item = navItemMap.get(path)
    if (!item) return null

    // A registered sortable, even a disabled one, gets the drag-and-drop ARIA
    // attributes, so screen readers announce every item as a disabled draggable.
    if (!menuUnlocked) {
      return (
        <LayoutItem
          key={item.path}
          to={item.path}
          icon={item.icon}
          endAdornment={item.path === '/settings' ? updateIndicator : undefined}
        >
          {t(item.label)}
        </LayoutItem>
      )
    }

    return (
      <SortableItem key={item.path} id={item.path} index={index}>
        {(sortable) => (
          <LayoutItem
            to={item.path}
            icon={item.icon}
            sortable={sortable}
            endAdornment={
              item.path === '/settings' ? updateIndicator : undefined
            }
          >
            {t(item.label)}
          </LayoutItem>
        )}
      </SortableItem>
    )
  })

  return (
    <div className="layout-content__left">
      {/* Logo */}
      <div className="the-logo" data-tauri-drag-region="false">
        <div
          data-tauri-drag-region="true"
          style={{
            height: '27px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component="img"
            src={appIcon}
            alt=""
            className="clashx-brand-mark"
          />
          {!isCollapsed && (
            <Typography
              sx={{ fontSize: 22, fontWeight: 650, letterSpacing: -0.7 }}
            >
              ClashX
            </Typography>
          )}
        </div>
      </div>

      {/* Edit navigation menu badge */}
      {menuUnlocked && (
        <Box
          sx={(theme) => ({
            px: 1.5,
            py: 0.75,
            mx: 'auto',
            mb: 1,
            maxWidth: 250,
            borderRadius: 1.5,
            fontSize: 12,
            fontWeight: 600,
            textAlign: 'center',
            color: theme.palette.warning.contrastText,
            bgcolor:
              theme.palette.mode === 'light'
                ? theme.palette.warning.main
                : theme.palette.warning.dark,
          })}
        >
          {t('layout.components.navigation.menu.reorderMode')}
        </Box>
      )}

      {/* Navigation menu */}
      <List className="the-menu" onContextMenu={handleMenuContextMenu}>
        <DragDropProvider sensors={SENSORS} onDragEnd={handleMenuDragEnd}>
          {navMenuItems}
        </DragDropProvider>
      </List>

      {/* Context menu */}
      <Menu
        open={Boolean(menuContextPosition)}
        onClose={handleMenuContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuContextPosition
            ? {
                top: menuContextPosition.top,
                left: menuContextPosition.left,
              }
            : undefined
        }
        transitionDuration={200}
        slotProps={{
          list: {
            sx: { py: 0.5 },
          },
        }}
      >
        <MenuItem onClick={handleToggleNavCollapsed} dense>
          {isCollapsed
            ? t('layout.components.navigation.menu.expandNavBar')
            : t('layout.components.navigation.menu.collapseNavBar')}
        </MenuItem>
        <MenuItem
          onClick={menuUnlocked ? handleLockMenu : handleUnlockMenu}
          dense
        >
          {menuUnlocked
            ? t('layout.components.navigation.menu.lock')
            : t('layout.components.navigation.menu.unlock')}
        </MenuItem>
        <MenuItem
          onClick={handleResetMenuOrder}
          dense
          disabled={isDefaultOrder}
        >
          {t('layout.components.navigation.menu.restoreDefaultOrder')}
        </MenuItem>
      </Menu>

      {/* Traffic */}
      <div className="the-traffic">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <Box
            component="span"
            className={
              coreRunning
                ? 'core-status-dot core-status-dot--running'
                : 'core-status-dot'
            }
            title={t(
              coreRunning
                ? 'layout.redesign.coreRunning'
                : 'layout.redesign.coreStopped',
            )}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: coreRunning ? 'error.main' : 'text.disabled',
            }}
          />
          {!isCollapsed &&
            (coreRunning
              ? t('layout.redesign.uptime', { time: elapsed })
              : t('layout.redesign.coreStopped'))}
        </Typography>
      </div>
    </div>
  )
}

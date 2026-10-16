import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import type { ReactNode } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router'

import type { SortableItemRenderProps } from '@/components/base/sortable-item'
import { useVerge } from '@/hooks/use-verge'

interface Props {
  to: string
  children: string
  icon: ReactNode
  sortable?: SortableItemRenderProps
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon, sortable } = props
  const { verge } = useVerge()
  const navCollapsed = verge?.collapse_navbar ?? false
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })
  const navigate = useNavigate()

  return (
    <ListItem
      ref={sortable?.ref}
      style={sortable?.style}
      sx={{ py: 0.5, maxWidth: 250, mx: 'auto', padding: '4px 0px' }}
    >
      <ListItemButton
        ref={sortable?.handleRef}
        selected={!!match}
        sx={[
          {
            borderRadius: 2,
            marginLeft: 1.25,
            paddingLeft: 1,
            paddingRight: 1,
            marginRight: 1.25,
            cursor: 'pointer',
            columnGap: '12px',
            '& .MuiListItemText-primary': {
              color: 'text.primary',
              fontWeight: 500,
            },
          },
          ({ palette: { mode, primary } }) => {
            const bgcolor =
              mode === 'light'
                ? alpha(primary.main, 0.12)
                : alpha(primary.main, 0.18)
            const color = primary.main
            return {
              '&.Mui-selected': { bgcolor },
              '&.Mui-selected:hover': { bgcolor },
              '&.Mui-selected .MuiListItemText-primary': { color },
            }
          },
        ]}
        title={navCollapsed ? children : undefined}
        aria-label={navCollapsed ? children : undefined}
        onClick={() => navigate(to)}
      >
        <ListItemIcon
          sx={{
            color: match ? 'primary.main' : 'text.secondary',
            width: 24,
            minWidth: 24,
            flexShrink: 0,
            marginLeft: '6px',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': { fontSize: 24 },
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          sx={{
            textAlign: 'left',
            marginLeft: 0,
          }}
          primary={children}
        />
      </ListItemButton>
    </ListItem>
  )
}

import {
  PowerSettingsNewRounded,
  ChevronRightRounded,
} from '@mui/icons-material'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { useLockFn } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { BasePage, Switch } from '@/components/base'
import { ClashModeCard } from '@/components/home/clash-mode-card'
import { CurrentProxyCard } from '@/components/home/current-proxy-card'
import { useProfiles } from '@/hooks/use-profiles'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useTrafficData } from '@/hooks/use-traffic-data'
import { useVisibility } from '@/hooks/use-visibility'
import { showNotice } from '@/services/notice-service'
import parseTraffic from '@/utils/parse-traffic'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { current } = useProfiles()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const visible = useVisibility()
  const {
    response: { data: traffic },
  } = useTrafficData({ enabled: visible })
  const toggle = useLockFn(async (enabled: boolean) => {
    try {
      await toggleSystemProxy(enabled)
    } catch (error) {
      showNotice.error(error)
    }
  })
  const extra = current?.extra
  const used = extra ? extra.upload + extra.download : 0
  const progress =
    extra && extra.total > 0
      ? Math.min(100, (used / extra.total) * 100)
      : undefined
  return (
    <BasePage title={t('layout.components.navigation.tabs.home')}>
      <Typography className="page-description">
        {t('layout.redesign.overviewDescription')}
      </Typography>
      <Box className="clashx-panel overview-connection">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.75,
              borderRadius: 2,
              bgcolor: 'action.selected',
              color: indicator ? 'success.main' : 'text.secondary',
              display: 'flex',
            }}
          >
            <PowerSettingsNewRounded />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {t(
                indicator
                  ? 'layout.redesign.proxyEnabled'
                  : 'layout.redesign.proxyDisabled',
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('layout.redesign.proxyDescription')}
            </Typography>
          </Box>
          <Switch
            checked={indicator}
            onChange={(_, value) => {
              void toggle(value)
            }}
            slotProps={{
              input: {
                'aria-label': t('settings.sections.system.toggles.systemProxy'),
              },
            }}
          />
        </Box>
        <Box
          sx={{ borderTop: 1, borderColor: 'divider', mt: 3, pt: 1 }}
          className="overview-current-proxy"
        >
          <CurrentProxyCard compact />
        </Box>
      </Box>
      <Box className="overview-mode">
        <ClashModeCard compact />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 2,
          my: 3,
        }}
      >
        {(['down', 'up'] as const).map((direction) => {
          const [value, unit] = parseTraffic(traffic?.[direction] ?? 0)
          return (
            <Box className="clashx-panel" key={direction} sx={{ mb: 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t(
                  direction === 'down'
                    ? 'layout.redesign.download'
                    : 'layout.redesign.upload',
                )}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: 28, fontWeight: 500 }}
              >
                {value}
              </Typography>
              <Typography
                component="span"
                color="text.secondary"
                sx={{ ml: 1, fontSize: 12 }}
              >
                {unit}/s
              </Typography>
            </Box>
          )
        })}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="body2">
          {t('layout.redesign.currentSubscription')}
        </Typography>
        <Button
          size="small"
          endIcon={<ChevronRightRounded />}
          onClick={() => navigate('/profile')}
        >
          {t('layout.redesign.manageSubscriptions')}
        </Button>
      </Box>
      <Box className="clashx-panel">
        <Typography sx={{ fontWeight: 500 }}>
          {current?.name || t('layout.redesign.noSubscription')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {extra && extra.total > 0
            ? `${parseTraffic(Math.max(0, extra.total - used)).join(' ')} / ${parseTraffic(extra.total).join(' ')}`
            : t('layout.redesign.noTrafficLimit')}
          {extra?.expire
            ? ` · ${new Date(extra.expire * 1000).toLocaleDateString()}`
            : ''}
        </Typography>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            color={
              progress >= 90 ? 'error' : progress >= 70 ? 'warning' : 'success'
            }
            sx={{ mt: 2, height: 4, borderRadius: 2 }}
          />
        )}
        {!current && (
          <Button sx={{ mt: 1 }} onClick={() => navigate('/profile')}>
            {t('layout.redesign.addSubscription')}
          </Button>
        )}
      </Box>
    </BasePage>
  )
}
export default HomePage

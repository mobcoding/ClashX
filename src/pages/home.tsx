import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  ChevronRightRounded,
  PowerSettingsNewRounded,
} from '@mui/icons-material'
import { Box, ButtonBase, Tooltip } from '@mui/material'
import { useLockFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router'

import { BasePage } from '@/components/base'
import { ClashModeCard } from '@/components/home/clash-mode-card'
import { CurrentProxyCard } from '@/components/home/current-proxy-card'
import { useProfiles } from '@/hooks/use-profiles'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useTrafficData } from '@/hooks/use-traffic-data'
import { useVisibility } from '@/hooks/use-visibility'
import { showNotice } from '@/services/notice-service'
import parseTraffic from '@/utils/parse-traffic'

const SessionStatus = ({ startedAt }: { startedAt: number | null }) => {
  const { t } = useTranslation()
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    if (startedAt === null) return
    const timer = window.setInterval(() => setNow(performance.now()), 1000)
    return () => window.clearInterval(timer)
  }, [startedAt])
  const seconds =
    startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000))
  const elapsed = [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
  return (
    <Box className="connection-runtime" sx={{ color: 'text.secondary' }}>
      <Box
        component="span"
        className={
          startedAt === null
            ? 'core-status-dot'
            : 'core-status-dot core-status-dot--running'
        }
        sx={{
          bgcolor: startedAt === null ? 'text.disabled' : 'error.main',
          color: 'error.main',
        }}
      />
      <span>
        {t(
          startedAt === null
            ? 'layout.redesign.coreStopped'
            : 'layout.redesign.running',
        )}
      </span>
      <time>{elapsed}</time>
    </Box>
  )
}

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { current } = useProfiles()
  const { indicator, toggleSystemProxy } = useSystemProxyState()
  const { proxySessionStartedAt } = useOutletContext<{
    proxySessionStartedAt: number | null
  }>()
  const [toggling, setToggling] = useState(false)
  const visible = useVisibility()
  const {
    response: { data: traffic },
  } = useTrafficData({ enabled: visible })
  const toggle = useLockFn(async () => {
    setToggling(true)
    try {
      await toggleSystemProxy(!indicator)
    } catch (error) {
      showNotice.error(error)
    } finally {
      setToggling(false)
    }
  })
  const extra = current?.extra
  const remaining =
    extra && extra.total > 0
      ? t('layout.redesign.quotaAvailable', {
          amount: parseTraffic(
            Math.max(0, extra.total - extra.upload - extra.download),
          ).join(' '),
        })
      : t('layout.redesign.noTrafficLimit')
  const summary = current
    ? `${current.name} · ${remaining}`
    : t('layout.redesign.addSubscription')
  return (
    <BasePage>
      <Box className="connection-overview">
        <Box className="connection-power-ring">
          <Tooltip
            title={t(
              indicator
                ? 'layout.redesign.proxyEnabled'
                : 'layout.redesign.proxyDisabled',
            )}
          >
            <ButtonBase
              className="connection-power"
              aria-label={t('settings.sections.system.toggles.systemProxy')}
              aria-pressed={indicator}
              disabled={toggling}
              onClick={toggle}
              sx={({ palette }) => ({
                bgcolor: indicator ? 'text.primary' : 'action.selected',
                color: indicator ? 'background.default' : 'text.secondary',
                boxShadow: `0 6px 12px ${palette.common.black}18`,
              })}
            >
              <PowerSettingsNewRounded />
            </ButtonBase>
          </Tooltip>
        </Box>
        <SessionStatus
          key={proxySessionStartedAt}
          startedAt={proxySessionStartedAt}
        />
        <CurrentProxyCard compact />
        <Box className="connection-mode">
          <ClashModeCard compact />
        </Box>
        <Box className="connection-footer" sx={{ borderColor: 'divider' }}>
          <Box className="connection-speeds">
            {(['down', 'up'] as const).map((direction) => {
              const [value, unit] = parseTraffic(traffic?.[direction] ?? 0)
              const label = t(
                direction === 'down'
                  ? 'layout.redesign.download'
                  : 'layout.redesign.upload',
              )
              return (
                <Tooltip key={direction} title={label}>
                  <Box className="connection-speed" aria-label={label}>
                    {direction === 'down' ? (
                      <ArrowDownwardRounded />
                    ) : (
                      <ArrowUpwardRounded />
                    )}
                    <span>{value}</span>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                      {unit}/s
                    </Box>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>
          <ButtonBase
            className="connection-subscription"
            onClick={() => navigate('/profile')}
            title={summary}
          >
            <span>{summary}</span>
            <ChevronRightRounded fontSize="small" />
          </ButtonBase>
        </Box>
      </Box>
    </BasePage>
  )
}
export default HomePage

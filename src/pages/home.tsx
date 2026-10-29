import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  ChevronRightRounded,
  PowerSettingsNewRounded,
} from '@mui/icons-material'
import { Box, ButtonBase, Tooltip } from '@mui/material'
import { useLockFn } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router'

import { BasePage } from '@/components/base'
import { ClashModeCard } from '@/components/home/clash-mode-card'
import { CurrentProxyCard } from '@/components/home/current-proxy-card'
import { useProfiles } from '@/hooks/use-profiles'
import type { useProxyControl } from '@/hooks/use-proxy-control'
import { useTrafficData } from '@/hooks/use-traffic-data'
import { useVisibility } from '@/hooks/use-visibility'
import { showNotice } from '@/services/notice-service'
import parseTraffic from '@/utils/parse-traffic'

const SessionStatus = ({
  startedAt,
  systemProxy,
  tun,
}: {
  startedAt: number | null
  systemProxy: boolean
  tun: boolean
}) => {
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
          systemProxy
            ? tun
              ? 'layout.redesign.systemProxyAndTun'
              : 'settings.sections.system.toggles.systemProxy'
            : tun
              ? 'layout.redesign.tunMode'
              : 'layout.redesign.proxyOff',
        )}
      </span>
      <time aria-label={t('layout.redesign.sessionDuration')}>{elapsed}</time>
    </Box>
  )
}

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { current } = useProfiles()
  const { proxySessionStartedAt, proxyControl } = useOutletContext<{
    proxySessionStartedAt: number | null
    proxyControl: ReturnType<typeof useProxyControl>
  }>()
  const { enabled, systemProxy, tun, toggling } = proxyControl
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let frame = 0
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scale = Math.min(
        1.75,
        Math.max(0.75, Math.min(width / 800, height / 500)),
        width / 400,
        height / 320,
      )
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        stage.style.setProperty('--connection-scale', String(scale))
      })
    })
    observer.observe(stage)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])
  const visible = useVisibility()
  const {
    response: { data: traffic },
  } = useTrafficData({ enabled: visible })
  const toggle = useLockFn(async () => {
    try {
      await proxyControl.toggle()
    } catch (error) {
      showNotice.error(error)
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
        <Box className="connection-stage" ref={stageRef}>
          <Box className="connection-controls">
            <Box className="connection-power-ring">
              <Tooltip
                title={t(
                  enabled
                    ? 'layout.redesign.disableProxy'
                    : 'layout.redesign.enableProxy',
                )}
              >
                <ButtonBase
                  className="connection-power"
                  aria-label={t(
                    enabled
                      ? 'layout.redesign.disableProxy'
                      : 'layout.redesign.enableProxy',
                  )}
                  aria-pressed={enabled}
                  disabled={toggling}
                  onClick={toggle}
                  sx={({ palette }) => ({
                    bgcolor: enabled ? 'text.primary' : 'action.selected',
                    color: enabled ? 'background.default' : 'text.secondary',
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
              systemProxy={systemProxy}
              tun={tun}
            />
            <CurrentProxyCard compact />
            <Box className="connection-mode">
              <ClashModeCard compact />
            </Box>
          </Box>
        </Box>
        <Box className="connection-footer">
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

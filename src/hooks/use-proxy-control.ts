import { useEffect, useRef, useState } from 'react'
import { closeAllConnections } from 'tauri-plugin-mihomo-api'

import {
  useAppRefreshers,
  useClashConfigData,
} from '@/providers/app-data-context'
import { mutate } from '@/services/mutate'
import { requestService } from '@/services/service-request'

import { useSystemProxyState } from './use-system-proxy-state'
import { useSystemState } from './use-system-state'
import { useVerge } from './use-verge'

const LAST_MODES_KEY = 'clashx-last-proxy-modes'

const readLastModes = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_MODES_KEY) ?? 'null')
    if (
      typeof saved?.systemProxy === 'boolean' &&
      typeof saved?.tun === 'boolean' &&
      (saved.systemProxy || saved.tun)
    ) {
      return { systemProxy: saved.systemProxy, tun: saved.tun }
    }
  } catch {
    // Storage may be unavailable; the first connection uses the system proxy.
  }
  return { systemProxy: true, tun: false }
}

export const useProxyControl = () => {
  const { verge, patchVerge } = useVerge()
  const { indicator: systemProxy, invalidateProxyState } = useSystemProxyState()
  const { isTunModeAvailable, isLoading, mutateSystemState } = useSystemState()
  const { clashConfig, isClashConfigPending } = useClashConfigData()
  const { refreshClashConfig } = useAppRefreshers()
  const tun = Boolean(isTunModeAvailable && clashConfig?.tun?.enable)
  const enabled = systemProxy || tun
  const [toggling, setToggling] = useState(false)
  const busyRef = useRef(false)
  const [initialModes] = useState(readLastModes)
  const lastModesRef = useRef(initialModes)

  useEffect(() => {
    if (toggling || isLoading || isClashConfigPending || !verge || !enabled)
      return
    const modes = { systemProxy, tun }
    lastModesRef.current = modes
    try {
      localStorage.setItem(LAST_MODES_KEY, JSON.stringify(modes))
    } catch {
      // The in-memory preference still survives page navigation.
    }
  }, [
    systemProxy,
    tun,
    enabled,
    toggling,
    isLoading,
    isClashConfigPending,
    verge,
  ])

  const toggle = async () => {
    if (busyRef.current) return
    const target = enabled
      ? { enable_system_proxy: false, enable_tun_mode: false }
      : {
          enable_system_proxy: lastModesRef.current.systemProxy,
          enable_tun_mode: lastModesRef.current.tun,
        }
    if (target.enable_tun_mode && !isTunModeAvailable) {
      requestService({ reason: 'tunNeedsService', restore: target })
      return
    }
    busyRef.current = true
    setToggling(true)
    try {
      await patchVerge(target)
      if (
        !target.enable_system_proxy &&
        !target.enable_tun_mode &&
        verge?.auto_close_connection
      ) {
        await mutate(() => closeAllConnections(), {
          id: 'close-all-connections',
          errorNotice: false,
        }).catch(() => {})
      }
    } finally {
      await Promise.allSettled([
        invalidateProxyState(),
        refreshClashConfig(),
        mutateSystemState(),
      ])
      busyRef.current = false
      setToggling(false)
    }
  }

  return {
    systemProxy,
    tun,
    enabled,
    toggle,
    toggling: toggling || isLoading || isClashConfigPending || !verge,
  }
}

import {
  MoreHorizRounded,
  RefreshRounded,
  SearchRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useLockFn } from 'ahooks'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { BasePage } from '@/components/base'
import { ProxyItem } from '@/components/proxy/proxy-item'
import { useProfiles } from '@/hooks/use-profiles'
import { useProxySelection } from '@/hooks/use-proxy-selection'
import { useForgetSelection } from '@/hooks/use-record-selection'
import { useVerge } from '@/hooks/use-verge'
import {
  useAppRefreshers,
  useClashConfigData,
  useProxiesData,
} from '@/providers/app-data-context'
import delayManager from '@/services/delay'
import { showNotice } from '@/services/notice-service'
import { profileTestUrls } from '@/services/proxy-test-url'
import { isInteractableMember, resolveMember } from '@/types/proxy-view'

const NodesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { proxyView, isProxyViewPending, isProxyViewError } = useProxiesData()
  const { clashConfig } = useClashConfigData()
  const { refreshProxy } = useAppRefreshers()
  const { current } = useProfiles()
  const { verge } = useVerge()
  const forgetSelection = useForgetSelection()
  const [searchParams] = useSearchParams()
  const [groupName, setGroupName] = useState(
    () => searchParams.get('group') ?? '',
  )
  const [search, setSearch] = useState('')
  const [testing, setTesting] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(
    () =>
      clashConfig?.mode === 'global' && proxyView?.global
        ? [proxyView.global]
        : (proxyView?.groups.filter(
            (item) =>
              !item.hidden &&
              (item.type === 'Selector' || item.type === 'URLTest'),
          ) ?? []),
    [clashConfig?.mode, proxyView],
  )
  const group = groups.find((item) => item.name === groupName) ?? groups[0]
  const members = useMemo(
    () =>
      proxyView && group
        ? group.members
            .map((member, index) => ({
              member: resolveMember(proxyView, member),
              index,
            }))
            .filter(({ member }) =>
              member.ref.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()),
            )
        : [],
    [proxyView, group, search],
  )
  const { handleProxyGroupChange } = useProxySelection({
    onSuccess: () => {
      void refreshProxy()
        .then(() => navigate('/'))
        .catch(showNotice.error)
    },
    onError: showNotice.error,
  })
  const virtualizer = useVirtualizer({
    count: members.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 50,
    overscan: 6,
    getItemKey: (index) => `${group?.name}:${members[index].index}`,
  })
  const test = useLockFn(async () => {
    if (!group || !proxyView) return
    setTesting(true)
    try {
      delayManager.setUrl(
        group.name,
        (current ? profileTestUrls(current)[group.name] : undefined) ||
          group.testUrl ||
          verge?.default_latency_test ||
          'https://www.gstatic.com/generate_204',
      )
      await delayManager.checkGroupDelay(
        group.members
          .map((member) => resolveMember(proxyView, member))
          .filter(isInteractableMember),
        group,
        verge?.default_latency_timeout || 10000,
      )
      if (group.type === 'URLTest') await forgetSelection(group.name)
      await refreshProxy()
    } catch (error) {
      showNotice.error(error)
    } finally {
      setTesting(false)
    }
  })
  return (
    <BasePage
      title={t('layout.components.navigation.tabs.proxies')}
      full
      contentStyle={{ height: '100%' }}
      header={
        <Button
          size="small"
          startIcon={<RefreshRounded />}
          onClick={test}
          loading={testing}
          disabled={!members.length}
        >
          {t('layout.redesign.testLatency')}
        </Button>
      }
    >
      <Box className="nodes-page">
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('layout.redesign.searchNodes')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            variant="outlined"
            aria-label={t('layout.redesign.advanced')}
            onClick={() => navigate('/diagnostics/proxies')}
          >
            <MoreHorizRounded />
          </Button>
        </Box>
        {group && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              gap: 1,
            }}
          >
            <Select
              size="small"
              value={group.name}
              onChange={(event) => {
                setGroupName(event.target.value)
                const storageKey = 'clash-verge-selected-proxy-group'
                localStorage.setItem(
                  current?.uid ? `${storageKey}:${current.uid}` : storageKey,
                  event.target.value,
                )
                virtualizer.scrollToOffset(0)
              }}
              sx={{ maxWidth: '75%' }}
              inputProps={{ 'aria-label': t('layout.redesign.proxyGroup') }}
            >
              {groups.map((item) => (
                <MenuItem key={item.name} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary">
              {members.length} {t('layout.redesign.nodeCount')}
            </Typography>
          </Box>
        )}
        {isProxyViewPending ? (
          <Typography>{t('layout.redesign.loading')}</Typography>
        ) : !members.length ? (
          <Box className="clashx-panel">
            <Typography color="text.secondary">
              {t(
                isProxyViewError
                  ? 'layout.redesign.loadFailed'
                  : search
                    ? 'layout.redesign.noMatches'
                    : 'layout.redesign.noNodes',
              )}
            </Typography>
            <Button
              onClick={() =>
                isProxyViewError ? void refreshProxy() : navigate('/profile')
              }
            >
              {t(
                isProxyViewError
                  ? 'layout.redesign.retry'
                  : 'layout.redesign.manageSubscriptions',
              )}
            </Button>
          </Box>
        ) : null}
        <Box
          ref={scrollRef}
          className="node-list-scroll"
          sx={{ flex: 1, minHeight: 0, overflow: 'auto', borderRadius: '12px' }}
        >
          <Box
            className="node-list"
            sx={{ height: virtualizer.getTotalSize(), position: 'relative' }}
          >
            {group &&
              virtualizer.getVirtualItems().map((row) => {
                const { member } = members[row.index]
                return (
                  <Box
                    key={row.key}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: row.size,
                      transform: `translateY(${row.start}px)`,
                    }}
                  >
                    <ProxyItem
                      group={group}
                      member={member}
                      showType={false}
                      compact
                      selected={member.ref.name === (group.fixed || group.now)}
                      onClick={(item) =>
                        handleProxyGroupChange(group, item.ref)
                      }
                      sx={{ p: 0 }}
                    />
                  </Box>
                )
              })}
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          {t('layout.redesign.nodesHint')}
        </Typography>
      </Box>
    </BasePage>
  )
}
export default NodesPage

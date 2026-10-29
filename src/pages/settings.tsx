import {
  ExpandMoreRounded,
  ChevronRightRounded,
  TuneRounded,
  LanOutlined,
  DashboardOutlined,
  BuildOutlined,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  BasePage,
  type DialogRef,
  Switch,
  TooltipIcon,
} from '@/components/base'
import { ClashCoreViewer } from '@/components/setting/mods/clash-core-viewer'
import { GuardState } from '@/components/setting/mods/guard-state'
import {
  SettingItem,
  SettingList,
} from '@/components/setting/mods/setting-comp'
import { ThemeModeSwitch } from '@/components/setting/mods/theme-mode-switch'
import { UpdateViewer } from '@/components/setting/mods/update-viewer'
import SettingClash from '@/components/setting/setting-clash'
import SettingSystem from '@/components/setting/setting-system'
import SettingVergeAdvanced from '@/components/setting/setting-verge-advanced'
import SettingVergeBasic from '@/components/setting/setting-verge-basic'
import { useClash } from '@/hooks/use-clash'
import { useUpdate } from '@/hooks/use-update'
import { useVerge } from '@/hooks/use-verge'
import { exportDiagnosticInfo } from '@/services/cmds'
import { resolveLanguage } from '@/services/i18n'
import { mutate } from '@/services/mutate'
import { showNotice } from '@/services/notice-service'
import { version } from '@root/package.json'

const SettingsSection = ({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) => (
  <Box component="section" className="settings-card">
    <Typography component="h2" className="settings-card-title">
      {icon}
      {title}
    </Typography>
    {children}
  </Box>
)

const SettingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { verge, patchVerge } = useVerge()
  const { version: coreVersion } = useClash()
  const updateRef = useRef<DialogRef>(null)
  const coreRef = useRef<DialogRef>(null)
  const { checkUpdate, updateInfo, loading } = useUpdate(false)
  const check = async () => {
    try {
      const { data } = await checkUpdate()
      if (data?.available) updateRef.current?.open()
      else
        showNotice.success(
          'settings.components.verge.advanced.notifications.latestVersion',
        )
    } catch (error) {
      showNotice.error(error)
    }
  }
  const exportDiagnostics = async () => {
    try {
      await mutate(() => exportDiagnosticInfo(), {
        id: 'export-diagnostic-info',
      })
      showNotice.success('shared.feedback.notifications.common.copySuccess')
    } catch {
      // The shared mutation boundary reports the failure.
    }
  }

  return (
    <BasePage title={t('settings.page.title')}>
      <Box className="settings-page">
        <SettingsSection
          title={t('settings.page.groups.common')}
          icon={<TuneRounded />}
        >
          <Box className="settings-columns settings-common">
            <SettingSystem onError={showNotice.error} />
            <SettingList>
              <SettingItem
                label={t('settings.components.verge.basic.fields.language')}
              >
                <GuardState
                  value={resolveLanguage(verge?.language ?? undefined)}
                  onFormat={(event) => event.target.value}
                  onGuard={(value) => patchVerge({ language: value })}
                  onCatch={showNotice.error}
                >
                  <Select
                    size="small"
                    inputProps={{
                      'aria-label': t(
                        'settings.components.verge.basic.fields.language',
                      ),
                    }}
                  >
                    <MenuItem value="zh">简体中文</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </GuardState>
              </SettingItem>
              <SettingItem
                label={t('settings.components.verge.basic.fields.themeMode')}
              >
                <GuardState
                  value={verge?.theme_mode ?? 'system'}
                  onGuard={(value) => patchVerge({ theme_mode: value })}
                  onCatch={showNotice.error}
                >
                  <ThemeModeSwitch />
                </GuardState>
              </SettingItem>
              <SettingItem
                label={t('settings.sections.system.fields.silentStart')}
                extra={
                  <TooltipIcon
                    title={t('settings.sections.system.tooltips.silentStart')}
                  />
                }
              >
                <GuardState
                  value={verge?.enable_silent_start ?? false}
                  valueProps="checked"
                  onFormat={(_, checked: boolean) => checked}
                  onGuard={(value) =>
                    patchVerge({ enable_silent_start: value })
                  }
                  onCatch={showNotice.error}
                >
                  <Switch
                    edge="end"
                    slotProps={{
                      input: {
                        'aria-label': t(
                          'settings.sections.system.fields.silentStart',
                        ),
                      },
                    }}
                  />
                </GuardState>
              </SettingItem>
            </SettingList>
          </Box>
        </SettingsSection>

        <Box className="settings-columns settings-primary-groups">
          <SettingsSection
            title={t('settings.page.groups.network')}
            icon={<LanOutlined />}
          >
            <SettingClash onError={showNotice.error} />
          </SettingsSection>
          <SettingsSection
            title={t('settings.page.groups.appearance')}
            icon={<DashboardOutlined />}
          >
            <SettingVergeBasic onError={showNotice.error} />
          </SettingsSection>
        </Box>

        <Accordion
          className="settings-maintenance"
          disableGutters
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRounded />}>
            <Typography component="h2" className="settings-card-title">
              <BuildOutlined />
              {t('settings.page.groups.maintenance')}
            </Typography>
            <Typography
              className="settings-maintenance-caption"
              variant="caption"
              color="text.secondary"
            >
              {t('settings.page.groups.maintenanceDescription')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="settings-columns settings-maintenance-groups">
              <Box>
                <SettingClash
                  section="maintenance"
                  onError={showNotice.error}
                />
                <SettingVergeBasic
                  section="maintenance"
                  onError={showNotice.error}
                />
              </Box>
              <SettingVergeAdvanced onError={showNotice.error} />
            </Box>
            <Box className="settings-diagnostics">
              <Typography component="h3" variant="body2">
                {t('layout.redesign.diagnostics')}
              </Typography>
              <Box className="settings-diagnostic-actions">
                {(['connections', 'rules', 'logs', 'unlock'] as const).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => navigate(`/${page}`)}
                      endIcon={<ChevronRightRounded />}
                    >
                      {t(`layout.components.navigation.tabs.${page}`)}
                    </Button>
                  ),
                )}
                <Button
                  onClick={() => navigate('/diagnostics/overview')}
                  endIcon={<ChevronRightRounded />}
                >
                  {t('layout.redesign.detailedOverview')}
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box component="section" className="settings-card settings-about">
          <Box className="settings-about-info">
            <Typography component="h2" variant="body2" sx={{ fontWeight: 600 }}>
              {t('settings.page.groups.about')}
            </Typography>
            <Box className="settings-version-info">
              <Button
                className="settings-version"
                onClick={() => {
                  navigator.clipboard
                    .writeText(`v${version}`)
                    .then(() => {
                      showNotice.success(
                        'settings.components.verge.advanced.notifications.versionCopied',
                      )
                    })
                    .catch(showNotice.error)
                }}
              >
                <span>{t('settings.page.groups.appVersion')}</span>
                <strong>{version}</strong>
              </Button>
              <Button
                className="settings-version"
                onClick={() => coreRef.current?.open()}
              >
                <span>{t('settings.page.groups.coreVersion')}</span>
                <strong>{coreVersion}</strong>
              </Button>
            </Box>
            {updateInfo?.available && (
              <Typography variant="caption" color="error.main">
                {t('layout.redesign.updateAvailable', {
                  version: updateInfo.version,
                })}
              </Typography>
            )}
          </Box>
          <Box className="settings-about-actions">
            <Button onClick={exportDiagnostics}>
              {t('settings.components.verge.advanced.fields.exportDiagnostics')}
            </Button>
            <Button
              variant="outlined"
              disabled={loading}
              onClick={
                updateInfo?.available ? () => updateRef.current?.open() : check
              }
            >
              {t(
                updateInfo?.available
                  ? 'layout.redesign.updateNow'
                  : 'layout.redesign.checkUpdate',
              )}
            </Button>
          </Box>
        </Box>
      </Box>
      <ClashCoreViewer ref={coreRef} />
      <UpdateViewer ref={updateRef} />
    </BasePage>
  )
}
export default SettingPage

import { ExpandMoreRounded, ChevronRightRounded } from '@mui/icons-material'
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
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { BasePage, type DialogRef, Switch } from '@/components/base'
import { GuardState } from '@/components/setting/mods/guard-state'
import { SettingItem } from '@/components/setting/mods/setting-comp'
import { ThemeModeSwitch } from '@/components/setting/mods/theme-mode-switch'
import { UpdateViewer } from '@/components/setting/mods/update-viewer'
import SettingClash from '@/components/setting/setting-clash'
import SettingSystem from '@/components/setting/setting-system'
import SettingVergeAdvanced from '@/components/setting/setting-verge-advanced'
import SettingVergeBasic from '@/components/setting/setting-verge-basic'
import ProxyControlSwitches from '@/components/shared/proxy-control-switches'
import { useUpdate } from '@/hooks/use-update'
import { useVerge } from '@/hooks/use-verge'
import { resolveLanguage } from '@/services/i18n'
import { showNotice } from '@/services/notice-service'
import { version } from '@root/package.json'

const SettingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { verge, patchVerge } = useVerge()
  const updateRef = useRef<DialogRef>(null)
  const { checkUpdate } = useUpdate(false)
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
  return (
    <BasePage title={t('settings.page.title')}>
      <Typography className="setting-group-title">
        {t('layout.redesign.general')}
      </Typography>
      <Box className="clashx-panel settings-panel">
        {(['enable_auto_launch', 'enable_silent_start'] as const).map(
          (field) => (
            <SettingItem
              key={field}
              label={t(
                field === 'enable_auto_launch'
                  ? 'settings.sections.system.fields.autoLaunch'
                  : 'settings.sections.system.fields.silentStart',
              )}
            >
              <GuardState
                value={verge?.[field] ?? false}
                valueProps="checked"
                onFormat={(_, checked: boolean) => checked}
                onGuard={(value) => patchVerge({ [field]: value })}
                onCatch={showNotice.error}
              >
                <Switch />
              </GuardState>
            </SettingItem>
          ),
        )}
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
      </Box>
      <Typography className="setting-group-title">
        {t('layout.redesign.networkTools')}
      </Typography>
      <Box className="clashx-panel settings-panel">
        <ProxyControlSwitches
          compact
          label={t('settings.sections.system.toggles.tunMode')}
          onError={showNotice.error}
        />
      </Box>
      <Accordion
        className="clashx-accordion advanced-settings-accordion"
        disableGutters
      >
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Box>
            <Typography>{t('layout.redesign.advanced')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('layout.redesign.advancedDescription')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails className="advanced-settings-details">
          <Box className="advanced-settings">
            <Box className="advanced-settings-column">
              <Box className="advanced-settings-card">
                <SettingSystem onError={showNotice.error} />
              </Box>
              <Box className="advanced-settings-card">
                <SettingClash onError={showNotice.error} />
              </Box>
            </Box>
            <Box className="advanced-settings-column">
              <Box className="advanced-settings-card">
                <SettingVergeBasic onError={showNotice.error} />
              </Box>
              <Box className="advanced-settings-card">
                <SettingVergeAdvanced onError={showNotice.error} />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion className="clashx-accordion" disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreRounded />}>
          <Box>
            <Typography>{t('layout.redesign.diagnostics')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('layout.redesign.diagnosticsDescription')}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(['connections', 'rules', 'logs', 'unlock'] as const).map(
              (page) => (
                <Button
                  key={page}
                  onClick={() =>
                    navigate(page === 'unlock' ? '/unlock' : `/${page}`)
                  }
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
        </AccordionDetails>
      </Accordion>
      <Box
        className="clashx-panel"
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography>{t('layout.redesign.about')}</Typography>
          <Typography variant="caption" color="text.secondary">
            ClashX · {version}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={check}>
          {t('layout.redesign.checkUpdate')}
        </Button>
      </Box>
      <UpdateViewer ref={updateRef} />
    </BasePage>
  )
}
export default SettingPage

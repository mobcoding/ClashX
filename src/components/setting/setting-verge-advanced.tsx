import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { DialogRef, TooltipIcon } from '@/components/base'
import {
  exitApp,
  openAppDir,
  openCoreDir,
  openDevTools,
  openLogsDir,
} from '@/services/cmds'
import { mutate } from '@/services/mutate'

import { BackupViewer } from './mods/backup-viewer'
import { ConfigViewer } from './mods/config-viewer'
import { LiteModeViewer } from './mods/lite-mode-viewer'
import { SettingItem, SettingList } from './mods/setting-comp'

interface Props {
  onError?: (err: Error) => void
}

const SettingVergeAdvanced = ({ onError: _ }: Props) => {
  const { t } = useTranslation()

  const configRef = useRef<DialogRef>(null)
  const backupRef = useRef<DialogRef>(null)
  const liteModeRef = useRef<DialogRef>(null)

  return (
    <SettingList>
      <ConfigViewer ref={configRef} />
      <BackupViewer ref={backupRef} />
      <LiteModeViewer ref={liteModeRef} />

      <SettingItem
        onClick={() => backupRef.current?.open()}
        label={t('settings.components.verge.advanced.fields.backupSetting')}
        extra={
          <TooltipIcon
            title={t('settings.components.verge.advanced.tooltips.backupInfo')}
            sx={{ opacity: '0.7' }}
          />
        }
      />

      <SettingItem
        onClick={() => configRef.current?.open()}
        label={t('settings.components.verge.advanced.fields.runtimeConfig')}
      />

      <SettingItem
        onClick={openAppDir}
        label={t('settings.components.verge.advanced.fields.openConfDir')}
        extra={
          <TooltipIcon
            title={t('settings.components.verge.advanced.tooltips.openConfDir')}
            sx={{ opacity: '0.7' }}
          />
        }
      />

      <SettingItem
        onClick={openCoreDir}
        label={t('settings.components.verge.advanced.fields.openCoreDir')}
      />

      <SettingItem
        onClick={openLogsDir}
        label={t('settings.components.verge.advanced.fields.openLogsDir')}
      />

      <SettingItem
        onClick={() => {
          void mutate(() => openDevTools(), {
            id: 'open-devtools',
            errorNotice: false,
          }).catch(() => {})
        }}
        label={t('settings.components.verge.advanced.fields.openDevTools')}
      />

      <SettingItem
        label={t('settings.components.verge.advanced.fields.liteModeSettings')}
        extra={
          <TooltipIcon
            title={t('settings.components.verge.advanced.tooltips.liteMode')}
            sx={{ opacity: '0.7' }}
          />
        }
        onClick={() => liteModeRef.current?.open()}
      />

      <SettingItem
        onClick={() => {
          void mutate(() => exitApp(), {
            id: 'exit-app',
            errorNotice: false,
          }).catch(() => {})
        }}
        label={t('settings.components.verge.advanced.fields.exit')}
      />
    </SettingList>
  )
}

export default SettingVergeAdvanced

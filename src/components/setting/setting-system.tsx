import React from 'react'
import { useTranslation } from 'react-i18next'

import { Switch } from '@/components/base'
import ProxyControlSwitches from '@/components/shared/proxy-control-switches'
import { useVerge } from '@/hooks/use-verge'

import { GuardState } from './mods/guard-state'
import { SettingList, SettingItem } from './mods/setting-comp'

interface Props {
  onError?: (err: Error) => void
}

const SettingSystem = ({ onError }: Props) => {
  const { t } = useTranslation()

  const { verge, mutateVerge, patchVerge } = useVerge()

  const { enable_auto_launch } = verge ?? {}

  const onSwitchFormat = (
    _e: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => value
  const onChangeData = (patch: Partial<IVergeConfig>) => {
    mutateVerge({ ...verge, ...patch }, false)
  }

  return (
    <SettingList>
      <ProxyControlSwitches
        settingsLayout
        label={t('settings.sections.system.toggles.systemProxy')}
        onError={onError}
      />

      <ProxyControlSwitches
        settingsLayout
        label={t('settings.sections.system.toggles.tunMode')}
        onError={onError}
      />

      <SettingItem label={t('settings.sections.system.fields.autoLaunch')}>
        <GuardState
          value={enable_auto_launch ?? false}
          valueProps="checked"
          onCatch={onError}
          onFormat={onSwitchFormat}
          onChange={(e) => {
            onChangeData({ enable_auto_launch: e })
          }}
          onGuard={async (e) => {
            try {
              // 先触发UI更新立即看到反馈
              onChangeData({ enable_auto_launch: e })
              await patchVerge({ enable_auto_launch: e })
              return Promise.resolve()
            } catch (error) {
              // 如果出错，恢复原始状态
              onChangeData({ enable_auto_launch: !e })
              return Promise.reject(error)
            }
          }}
        >
          <Switch edge="end" />
        </GuardState>
      </SettingItem>
    </SettingList>
  )
}

export default SettingSystem

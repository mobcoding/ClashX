import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { WindowControls } from '@/components/layout/window-controller'
import { useWindowDecorations } from '@/hooks/use-window'

import { BaseErrorBoundary } from './base-error-boundary'

interface Props {
  title?: React.ReactNode // the page title
  header?: React.ReactNode // something behind title
  contentStyle?: React.CSSProperties
  children?: ReactNode
  full?: boolean
}

export const BasePage: React.FC<Props> = (props) => {
  const { title, header, contentStyle, full, children } = props
  const theme = useTheme()
  const { decorated } = useWindowDecorations()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isPrimary = ['/', '/proxies', '/profile', '/settings'].includes(
    pathname,
  )

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        <header data-tauri-drag-region="true" style={{ userSelect: 'none' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}
          >
            {!isPrimary && (
              <IconButton
                size="small"
                aria-label={t('layout.redesign.backToSettings')}
                onClick={() => navigate('/settings')}
              >
                <ArrowBackRounded />
              </IconButton>
            )}
            <Typography
              sx={{
                fontSize: '27px',
                fontWeight: 600,
                letterSpacing: '-0.7px',
              }}
              data-tauri-drag-region="true"
            >
              {title}
            </Typography>
          </Box>
          <Box className="page-drag-region" data-tauri-drag-region="true" />
          {decorated === false && (
            <Box className="page-window-controls">
              <WindowControls />
            </Box>
          )}
        </header>
        {header && <Box className="page-toolbar">{header}</Box>}

        <div
          className={full ? 'base-container no-padding' : 'base-container'}
          style={{ backgroundColor: theme.palette.background.default }}
        >
          <section
            style={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
      </div>
    </BaseErrorBoundary>
  )
}

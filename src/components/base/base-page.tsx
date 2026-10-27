import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import { Box, IconButton, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

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
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isPrimary = ['/', '/proxies', '/profile', '/settings'].includes(
    pathname,
  )

  return (
    <BaseErrorBoundary>
      <div className={`base-page${pathname === '/' ? ' base-page--home' : ''}`}>
        {pathname !== '/' && (
          <header style={{ userSelect: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
              }}
            >
              <IconButton
                size="small"
                aria-label={t(
                  isPrimary
                    ? 'layout.redesign.backToHome'
                    : 'layout.redesign.backToSettings',
                )}
                onClick={() => navigate(isPrimary ? '/' : '/settings')}
              >
                <ArrowBackRounded />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '-0.7px',
                }}
              >
                {title}
              </Typography>
            </Box>
            {header && <Box className="page-toolbar">{header}</Box>}
          </header>
        )}

        <div className={full ? 'base-container no-padding' : 'base-container'}>
          <section>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
      </div>
    </BaseErrorBoundary>
  )
}

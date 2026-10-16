import { alpha, Box, styled } from '@mui/material'

export const ProfileBox = styled(Box)(
  ({ theme, 'aria-selected': selected }) => {
    const { primary, text } = theme.palette
    const backgroundColor = selected
      ? alpha(primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.035)
      : theme.palette.background.paper

    const borderSelect = {
      border: '1px solid',
      borderColor: selected ? primary.light : theme.palette.divider,
      width: '100%',
    }

    return {
      position: 'relative',
      display: 'block',
      cursor: 'pointer',
      textAlign: 'left',
      padding: '16px 20px',
      boxSizing: 'border-box',
      backgroundColor,
      ...borderSelect,
      borderRadius: '12px',
      color: text.secondary,
      '& h2': { color: text.primary },
    }
  },
)

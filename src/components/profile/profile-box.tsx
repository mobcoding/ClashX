import { Box, styled } from '@mui/material'

export const ProfileBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  textAlign: 'left',
  padding: '16px 0',
  boxSizing: 'border-box',
  width: '100%',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  '& h2': { color: theme.palette.text.primary },
}))

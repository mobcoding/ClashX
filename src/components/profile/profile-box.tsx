import { Box, styled } from '@mui/material'

export const ProfileBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  textAlign: 'left',
  padding: '16px 12px',
  boxSizing: 'border-box',
  width: '100%',
  borderRadius: 8,
  color: theme.palette.text.secondary,
  '& h2': { color: theme.palette.text.primary },
  '&:hover': { backgroundColor: theme.palette.action.hover },
}))

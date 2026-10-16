import getSystem from '@/utils/get-system'
const OS = getSystem()

// default theme setting
export const defaultTheme = {
  primary_color: '#5078E8',
  secondary_color: '#FC9B76',
  primary_text: '#202B3D',
  secondary_text: '#718096',
  info_color: '#5078E8',
  error_color: '#FF3B30',
  warning_color: '#FF9500',
  success_color: '#06943D',
  background_color: '#F5F7FB',
  font_family: `"Segoe UI", -apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"${
    OS === 'windows' ? ', twemoji mozilla' : ''
  }`,
}

// dark mode
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: '#86A6FF',
  secondary_color: '#FF9F0A',
  primary_text: '#E8EDF5',
  background_color: '#11151C',
  secondary_text: '#939EAF',
  info_color: '#86A6FF',
  error_color: '#FF453A',
  warning_color: '#FF9F0A',
  success_color: '#30D158',
}

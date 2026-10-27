import getSystem from '@/utils/get-system'
const OS = getSystem()

// default theme setting
export const defaultTheme = {
  primary_color: '#5078E8',
  secondary_color: '#FC9B76',
  primary_text: '#26282C',
  secondary_text: '#858D99',
  info_color: '#5078E8',
  error_color: '#FF3B30',
  warning_color: '#FF9500',
  success_color: '#06943D',
  background_color: '#FFFFFF',
  font_family: `"Segoe UI", -apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"${
    OS === 'windows' ? ', twemoji mozilla' : ''
  }`,
}

// dark mode
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: '#86A6FF',
  secondary_color: '#FF9F0A',
  primary_text: '#EEEEF1',
  background_color: '#1D1F24',
  secondary_text: '#A1A7B2',
  info_color: '#86A6FF',
  error_color: '#FF453A',
  warning_color: '#FF9F0A',
  success_color: '#30D158',
}

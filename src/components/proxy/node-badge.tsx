import { Box } from '@mui/material'

const regions = [
  ['SG', /🇸🇬|新加坡|狮城|Singapore|\bSG\b/i],
  ['HK', /🇭🇰|香港|Hong Kong|\bHK\b/i],
  ['JP', /🇯🇵|日本|东京|大阪|Japan|Tokyo|\bJP\b/i],
  ['US', /🇺🇸|美国|洛杉矶|United States|\bUS\b/i],
  ['TW', /🇹🇼|台湾|台灣|Taiwan|\bTW\b/i],
  ['KR', /🇰🇷|韩国|韓國|Korea|\bKR\b/i],
  ['GB', /🇬🇧|英国|英國|United Kingdom|\bUK\b|\bGB\b/i],
  ['DE', /🇩🇪|德国|德國|Germany|\bDE\b/i],
] as const

export const NodeBadge = ({ name }: { name: string }) => (
  <Box
    component="span"
    className="node-badge"
    sx={{ color: 'text.secondary', borderColor: 'divider' }}
  >
    {regions.find(([, pattern]) => pattern.test(name))?.[0] ?? '↝'}
  </Box>
)

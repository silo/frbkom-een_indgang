export type DevTestUserPreset = {
  key: DevTestUserPresetKey
  label: string
  description: string
  userId: string
  role: 'user' | 'admin'
  name: string
  email: string
  phone: string
  cpr: string
  identityType: 'private' | 'professional'
}

export type DevTestUserPresetKey = 'citizen-culture-organizer' | 'citizen-business-owner' | 'admin-caseworker'

export const DEV_TEST_USER_PRESETS: DevTestUserPreset[] = [
  {
    key: 'citizen-culture-organizer',
    label: 'Borger – Maria Madsen',
    description: 'Privat ansøger, der planlægger kulturfestival med vennerne.',
    userId: 'dev-user-maria',
    role: 'user',
    name: 'Maria Madsen',
    email: 'maria.madsen@example.dev',
    phone: '60102030',
    cpr: '1010101010',
    identityType: 'private',
  },
  {
    key: 'citizen-business-owner',
    label: 'Erhverv – Jonas Jensen',
    description: 'Erhvervsdrivende, der søger om plads til foodtruck og events.',
    userId: 'dev-user-jonas',
    role: 'user',
    name: 'Jonas Jensen',
    email: 'jonas.jensen@example.dev',
    phone: '71727374',
    cpr: '2020202020',
    identityType: 'private',
  },
  {
    key: 'admin-caseworker',
    label: 'Sagsbehandler – Anna Andersen',
    description: 'Kommunal medarbejder med adgang til admin-flow.',
    userId: 'dev-admin-anna',
    role: 'admin',
    name: 'Anna Andersen',
    email: 'anna.andersen@example.dev',
    phone: '88990011',
    cpr: '1111111111',
    identityType: 'professional',
  },
]

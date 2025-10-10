/**
 * Configurações de ambiente validadas
 * Garante que as variáveis de ambiente necessárias estejam definidas
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

export const env = {
  apiUrl: getEnvVar(
    'NEXT_PUBLIC_API_URL',
    'https://kitnet-manager-production.up.railway.app/api/v1'
  ),
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Kitnet Manager'),
  appVersion: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const

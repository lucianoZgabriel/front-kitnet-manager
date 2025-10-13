/**
 * Monitor para detectar mudanças no localStorage
 * Útil para debug de problemas de autenticação
 */

if (typeof window !== 'undefined') {
  const originalSetItem = localStorage.setItem
  const originalRemoveItem = localStorage.removeItem
  const originalClear = localStorage.clear

  // Sobrescrever setItem
  localStorage.setItem = function (key: string, value: string) {
    if (key === 'auth-storage') {
      console.log('📝 [localStorage Monitor] setItem chamado:', {
        key,
        valueLength: value?.length,
        timestamp: new Date().toISOString(),
      })
      console.trace('Stack trace:')
    }
    return originalSetItem.apply(this, [key, value])
  }

  // Sobrescrever removeItem
  localStorage.removeItem = function (key: string) {
    if (key === 'auth-storage') {
      console.warn('🗑️ [localStorage Monitor] removeItem chamado para auth-storage!')
      console.trace('Stack trace:')
    }
    return originalRemoveItem.apply(this, [key])
  }

  // Sobrescrever clear
  localStorage.clear = function () {
    console.error('🧹 [localStorage Monitor] localStorage.clear() chamado!')
    console.trace('Stack trace:')
    return originalClear.apply(this)
  }

  console.log('🔐 [localStorage Monitor] Monitoramento ativado!')
}

export {}

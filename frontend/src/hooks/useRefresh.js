import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado mejorado para refrescar datos periódicamente
 * @param {Function} fetchFunction - Función asíncrona que obtiene los datos
 * @param {Object} options - Opciones de configuración
 * @param {number} options.interval - Intervalo de actualización en milisegundos (por defecto 30 segundos)
 * @param {boolean} options.immediate - Si debe ejecutar fetchFunction inmediatamente (por defecto true)
 * @param {boolean} options.debug - Si debe mostrar mensajes de depuración en consola (por defecto false)
 * @param {number} options.initialDelay - Retraso inicial antes de comenzar actualizaciones automáticas (por defecto 3000ms)
 * @param {*} options.initialData - Datos iniciales a usar mientras se carga (por defecto null)
 * @returns {Object} - Objeto con datos, estado de carga, error y función de refresco manual
 */
const useRefresh = (fetchFunction, options = {}) => {
  // Opciones por defecto
  const {
    interval = 30000,
    immediate = true,
    debug = false,
    initialDelay = 3000,
    initialData = null
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Función para obtener datos
  const refreshData = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      
      if (debug) console.log('[useRefresh] Obteniendo datos...');
      
      const result = await fetchFunction();
      
      if (debug) console.log('[useRefresh] Datos obtenidos:', result);
      
      // Validar que result no sea nulo o indefinido
      if (result !== undefined && result !== null) {
        setData(result);
        setLastUpdated(new Date());
        // Resetear contador de reintentos si fue exitoso
        if (retryCount > 0) setRetryCount(0);
      } else {
        console.warn('[useRefresh] La función de obtención de datos retornó un valor nulo o indefinido');
        // Si es un reintento automático debido a datos nulos, incrementar contador
        if (isRetry) {
          setRetryCount(prev => prev + 1);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('[useRefresh] Error al obtener datos:', err);
      setError(err.message || 'Error al cargar los datos');
      
      // Si es un reintento automático debido a error, incrementar contador
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      }
      
      // No cambiar el estado de los datos anteriores si hay un error
    } finally {
      setLoading(false);
      // Marcar como inicializado después de la primera carga
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [fetchFunction, debug, isInitialized, retryCount]);

  // Efecto para carga inicial
  useEffect(() => {
    if (immediate) {
      if (debug) console.log('[useRefresh] Realizando carga inicial de datos');
      
      // Añadir un pequeño retraso antes de la primera carga para evitar problemas de concurrencia
      const initialLoadTimeout = setTimeout(() => {
        refreshData(false);
      }, 500);
      
      return () => clearTimeout(initialLoadTimeout);
    }
    return undefined;
  }, [refreshData, immediate, debug]);

  // Efecto para configuración del intervalo
  useEffect(() => {
    // Solo iniciar el intervalo después del retraso inicial y si ya se inicializó
    if (interval > 0 && isInitialized) {
      if (debug) console.log(`[useRefresh] Configurando intervalo de actualización: ${interval}ms después de ${initialDelay}ms`);
      
      // Esperar un tiempo inicial antes de comenzar las actualizaciones automáticas
      const startIntervalTimeout = setTimeout(() => {
        if (debug) console.log('[useRefresh] Iniciando actualización periódica');
        
        const intervalId = setInterval(() => {
          if (debug) console.log('[useRefresh] Actualizando datos por intervalo');
          refreshData(true); // Marcar como reintento automático
        }, interval);
        
        // Limpiar intervalo cuando el componente se desmonte
        return () => {
          if (debug) console.log('[useRefresh] Limpiando intervalo');
          clearInterval(intervalId);
        };
      }, initialDelay);
      
      return () => clearTimeout(startIntervalTimeout);
    }
    
    return undefined;
  }, [refreshData, interval, debug, isInitialized, initialDelay]);

  // Efecto para reintentar automáticamente si se reciben datos nulos después de varios intentos
  useEffect(() => {
    // Si hay varios reintentos consecutivos (3+), intentar un reinicio más agresivo
    if (retryCount >= 3) {
      if (debug) console.log(`[useRefresh] Detectados ${retryCount} reintentos fallidos, reiniciando...`);
      
      // Esperar un tiempo más largo antes de reintentar
      const recoveryTimeout = setTimeout(() => {
        if (debug) console.log('[useRefresh] Ejecutando reintento de recuperación');
        refreshData(false); // Reinicio completo, no es reintento automático
        setRetryCount(0); // Resetear contador
      }, 5000); // 5 segundos
      
      return () => clearTimeout(recoveryTimeout);
    }
    
    return undefined;
  }, [retryCount, refreshData, debug]);

  return { 
    data, 
    loading, 
    error, 
    refreshData: () => refreshData(false), // La función expuesta no es un reintento
    lastUpdated,
    isInitialized,
    retryCount
  };
};

export default useRefresh; 
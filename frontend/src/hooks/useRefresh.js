import { useState, useCallback } from 'react';

/**
 * Hook personalizado para forzar la actualización de componentes
 * @returns {[number, Function]} Un par con el contador actual y una función para forzar actualización
 */
const useRefresh = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  
  const refresh = useCallback(() => {
    setRefreshCount(prevCount => prevCount + 1);
  }, []);
  
  return [refreshCount, refresh];
};

export default useRefresh; 
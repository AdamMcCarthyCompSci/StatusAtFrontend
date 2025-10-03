import { useState, useCallback } from 'react';
import { ConnectionState, FlowConnection } from '../types';
import { wouldCreateLoop } from '../utils';

export const useConnectionState = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    fromNodeId: null,
    tempConnection: null,
  });

  const startConnection = useCallback((fromNodeId: string) => {
    setConnectionState({
      isConnecting: true,
      fromNodeId,
      tempConnection: null,
    });
  }, []);

  const updateTempConnection = useCallback((position: { x: number; y: number }) => {
    setConnectionState(prev => ({
      ...prev,
      tempConnection: position,
    }));
  }, []);

  const endConnection = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      fromNodeId: null,
      tempConnection: null,
    });
  }, []);

  const canCreateConnection = useCallback((
    fromNodeId: string,
    toNodeId: string,
    existingConnections: FlowConnection[]
  ): boolean => {
    if (fromNodeId === toNodeId) return false;
    
    // Check if connection already exists
    const connectionExists = existingConnections.some(
      conn => conn.fromStepId === fromNodeId && conn.toStepId === toNodeId
    );
    if (connectionExists) return false;
    
    // Check for loops
    return !wouldCreateLoop(fromNodeId, toNodeId, existingConnections);
  }, []);

  return {
    connectionState,
    startConnection,
    updateTempConnection,
    endConnection,
    canCreateConnection,
  };
};

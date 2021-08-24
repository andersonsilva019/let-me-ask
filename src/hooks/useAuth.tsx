import { useContext } from 'react'
import { AuthContext, AuthContextProps } from '../context/AuthContext';

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must ne used within a AuthProvider');
  }

  return context;
}
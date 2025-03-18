'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  walletAddress: null,
  isLoading: false,
  connectWallet: async () => {},
  logout: () => {},
  error: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedWalletAddress = localStorage.getItem('walletAddress');
    
    if (token && storedWalletAddress) {
      setIsAuthenticated(true);
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  // Connect to Phantom wallet
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Phantom is installed
      const phantom = (window as any).solana;
      
      if (!phantom) {
        throw new Error('Phantom wallet is not installed');
      }
      
      // Connect to wallet
      const response = await phantom.connect();
      const address = response.publicKey.toString();
      
      // Get nonce from server
      const nonceResponse = await fetch(`/api/auth/nonce?walletAddress=${address}`);
      const nonceData = await nonceResponse.json();
      
      if (!nonceResponse.ok) {
        throw new Error(nonceData.error || 'Failed to get nonce');
      }
      
      // Create message to sign
      const message = `Sign this message to authenticate with TrapCard: ${nonceData.nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from wallet
      const signatureResponse = await phantom.signMessage(encodedMessage, 'utf8');
      // The signature is already in base58 format from Phantom
      const signature = signatureResponse.signature;
      
      // Authenticate with server
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          signature,
        }),
      });
      
      const loginData = await loginResponse.json();
      
      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Failed to authenticate');
      }
      
      // Store token and wallet address
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('walletAddress', address);
      
      setIsAuthenticated(true);
      setWalletAddress(address);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('walletAddress');
    setIsAuthenticated(false);
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        walletAddress,
        isLoading,
        connectWallet,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

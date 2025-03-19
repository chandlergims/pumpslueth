'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, walletAddress, isLoading, connectWallet, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navbar */}
      <div className={`transition-all duration-300 ${scrolled ? 'bg-[#0f1225]/90 backdrop-blur-md shadow-lg' : 'bg-[#0f1225]'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-white">Pump<span className="text-[#4f87ff]">Sleuth</span></span>
                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-[#4f87ff] text-white rounded">BETA</span>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-6">
                <NavLink href="/" active={pathname === '/'}>
                  Bounties
                </NavLink>
                <NavLink href="/create" active={pathname === '/create'}>
                  Create
                </NavLink>
                {isAuthenticated && (
                  <NavLink href="/my-solutions" active={pathname === '/my-solutions'}>
                    My Solutions
                  </NavLink>
                )}
              </nav>
            </div>

            {/* Right Side - Auth and Links */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/about" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
              
              <a 
                href="https://x.com/PumpSleuthApp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              
              {/* Wallet Connection */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      id="connect-wallet-btn"
                      onClick={toggleDropdown}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141836] border border-[#2a2f52] text-white text-sm font-medium hover:bg-[#1c2045] transition-all"
                    >
                      <svg className="w-4 h-4 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      <span className="truncate max-w-[100px]" title={walletAddress || ''}>
                        {formatWalletAddress(walletAddress || '')}
                      </span>
                    </button>
                    
                    {dropdownOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 rounded-md overflow-hidden bg-[#141836] border border-[#2a2f52] shadow-xl z-50"
                        style={{ top: '100%' }}
                      >
                        <div className="p-3">
                          <div className="flex items-center gap-2 text-sm text-gray-200">
                            <svg className="w-4 h-4 text-[#4f87ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                            </svg>
                            <span className="font-mono">{formatWalletAddress(walletAddress || '')}</span>
                          </div>
                        </div>
                        <div className="h-px bg-[#2a2f52] mx-3"></div>
                        <div className="p-2">
                          <button 
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full p-2 text-sm text-left text-gray-200 hover:bg-[#1c2045] rounded-md transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            <span>Disconnect Wallet</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    id="connect-wallet-btn"
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4f87ff] hover:bg-[#3b6de0] text-white text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>
                      {isLoading ? 'Connecting...' : 'Connect Wallet'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on small screens */}
      <div className="md:hidden bg-[#141836] shadow-lg">
        <div className="flex justify-around">
          <NavLinkMobile href="/" active={pathname === '/'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Bounties</span>
          </NavLinkMobile>
          
          <NavLinkMobile href="/create" active={pathname === '/create'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Create</span>
          </NavLinkMobile>
          
          {isAuthenticated && (
            <NavLinkMobile href="/my-solutions" active={pathname === '/my-solutions'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span>Solutions</span>
            </NavLinkMobile>
          )}
          
          <NavLinkMobile href="/about" active={pathname === '/about'}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>About</span>
          </NavLinkMobile>
        </div>
      </div>
    </div>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<{ href: string; active: boolean; children: React.ReactNode }> = ({ 
  href, 
  active, 
  children 
}) => {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        active 
          ? 'text-white' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
      {active && <div className="h-0.5 bg-[#4f87ff] mt-0.5"></div>}
    </Link>
  );
};

// Mobile Navigation Link Component
const NavLinkMobile: React.FC<{ href: string; active: boolean; children: React.ReactNode }> = ({ 
  href, 
  active, 
  children 
}) => {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center py-3 px-4 text-xs font-medium ${
        active 
          ? 'text-[#4f87ff]' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;

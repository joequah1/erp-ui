"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Search, Store, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, currentShop, userShops, switchShop, logout } = useAuth();

  const [showShopSelector, setShowShopSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const shopSelectorRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopSelectorRef.current && !shopSelectorRef.current.contains(event.target as Node)) {
        setShowShopSelector(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShopSwitch = (shopId: string) => {
    switchShop(shopId);
    setShowShopSelector(false);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await logout();
      // Force a full reload to trigger middleware and redirect
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login'; // Still redirect on error
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left Section - Breadcrumb */}
      <div className="flex items-center space-x-4">
        <nav className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Dashboard</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">Overview</span>
        </nav>
      </div>
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900">New inventory item added</p>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm text-gray-900">Low stock alert for iPhone 15</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Shop Selector */}
        <div className="relative" ref={shopSelectorRef}>
          <button
            onClick={() => setShowShopSelector(!showShopSelector)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Store className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900 max-w-32 truncate">
              {currentShop?.name || 'Select Shop'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showShopSelector && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Select Shop</h3>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {userShops.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => handleShopSwitch(shop.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      currentShop?.id === shop.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                    }`}
                  >
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.name} className="h-8 w-8 rounded-lg object-cover" />
                    ) : (
                      <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Store className="h-4 w-4 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{shop.name}</p>
                      <p className="text-xs text-gray-500 truncate">{shop.description}</p>
                    </div>
                    {currentShop?.id === shop.id && (
                      <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  Manage Shops
                </button>
              </div>
            </div>
          )}
        </div>
        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </button>
              </div>
              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

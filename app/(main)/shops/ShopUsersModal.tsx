"use client";
import React, { useState, useEffect } from 'react';
import { Users, Mail, Plus, Trash2, Crown, Shield, User } from 'lucide-react';
import { Shop, ShopUser, ShopInvitation } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ShopUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
}

export function ShopUsersModal({ isOpen, onClose, shop }: ShopUsersModalProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [invitations, setInvitations] = useState<ShopInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'user' as 'admin' | 'user'
  });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (isOpen && shop) {
      loadUsers();
      loadInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, shop]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockUsers: ShopUser[] = [
        {
          id: '1',
          shopId: shop!.id,
          userId: '1',
          role: 'owner',
          permissions: ['all'],
          invitedAt: '2024-01-01',
          joinedAt: '2024-01-01',
          status: 'active',
          user: {
            id: '1',
            email: 'owner@example.com',
            name: 'Shop Owner',
            role: 'owner',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          }
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInvitations = async () => {
    try {
      // Mock data
      const mockInvitations: ShopInvitation[] = [
        {
          id: '1',
          shopId: shop!.id,
          email: 'pending@example.com',
          role: 'user',
          permissions: ['read'],
          invitedBy: '1',
          token: 'mock-token',
          expiresAt: '2024-12-31',
          status: 'pending',
          createdAt: '2024-01-01'
        }
      ];
      setInvitations(mockInvitations);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Add to invitations list
      const newInvitation: ShopInvitation = {
        id: Date.now().toString(),
        shopId: shop!.id,
        email: inviteForm.email,
        role: inviteForm.role,
        permissions: inviteForm.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
        invitedBy: '1',
        token: 'mock-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setInvitations(prev => [newInvitation, ...prev]);
      setInviteForm({ email: '', role: 'user' });
      setShowInviteForm(false);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user from the shop?')) {
      return;
    }
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInvitations(prev => prev.filter(i => i.id !== invitationId));
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-primary-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-primary-100 text-primary-800',
      admin: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!shop) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shop Users & Invitations" size="lg">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              type="button"
            >
              <Users className="h-4 w-4 inline mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'invitations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              type="button"
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Invitations ({invitations.length})
            </button>
          </nav>
        </div>
        {/* Invite Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center space-x-2"
            type="button"
          >
            <Plus className="h-4 w-4" />
            <span>Invite User</span>
          </Button>
        </div>
        {/* Invite Form */}
        {showInviteForm && (
          <form onSubmit={handleInvite} className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={inviteForm.email}
                onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <Select
                label="Role"
                value={inviteForm.role}
                onChange={e => setInviteForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
                options={[{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]}
              />
              <Button type="submit" isLoading={isInviting}>
                Send Invite
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)} type="button">
                Cancel
              </Button>
            </div>
          </form>
        )}
        {/* Tab Content */}
        <div>
          {activeTab === 'users' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users found.</div>
              ) : (
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(user.role)}
                        <span className="font-medium text-gray-900">{user.user?.name || 'Unknown'}</span>
                        {getRoleBadge(user.role)}
                        <span className="text-xs text-gray-500">{user.user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Joined {formatDate(user.joinedAt || user.invitedAt)}</span>
                        {user.role !== 'owner' && (
                          <Button variant="outline" size="sm" onClick={() => handleRemoveUser(user.id)} type="button">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'invitations' && (
            <div className="space-y-4">
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No invitations found.</div>
              ) : (
                <div className="space-y-2">
                  {invitations.map(invite => (
                    <div key={invite.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{invite.email}</span>
                        {getRoleBadge(invite.role)}
                        <span className="text-xs text-gray-500">Invited {formatDate(invite.createdAt)}</span>
                        <span className="text-xs text-gray-400">Expires {formatDate(invite.expiresAt)}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleCancelInvitation(invite.id)} type="button">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} type="button">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

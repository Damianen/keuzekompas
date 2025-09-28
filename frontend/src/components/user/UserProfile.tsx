import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../services/api';
import type { UpdateUserData, Module } from '../../types';

const UserProfile: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    name: user?.name || '',
    study: user?.study || '',
    email: user?.email || '',
  });
  const [favorites, setFavorites] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // Update form data when user data changes
      setFormData({
        name: user.name || '',
        study: user.study || '',
        email: user.email || '',
      });

      // Fetch favorites
      const fetchFavorites = async () => {
        try {
          const data = await userApi.getFavorites(user.id!);
          setFavorites(data);
        } catch {
          console.error('Failed to load favorites');
        } finally {
          setIsLoadingFavorites(false);
        }
      };

      fetchFavorites();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError('');

    try {
      await userApi.update(user.id, formData);
      await refreshUser();
      setIsEditing(false);
    } catch (err: unknown) {
      let errorMessage = 'Failed to update profile';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { error?: { message?: string }; message?: string } } }).response;
        if (response?.data?.error?.message) {
          errorMessage = response.data.error.message;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await userApi.delete(user.id);
      logout();
    } catch {
      setError('Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          You must be logged in to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and account information.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                {error}
              </div>
            )}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="study" className="block text-sm font-medium text-gray-700">
                    Study Program
                  </label>
                  <input
                    type="text"
                    name="study"
                    id="study"
                    value={formData.study}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Study program</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.study}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.role === 2 ? 'Admin' : 'User'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Member since</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        {/* Favorite Modules */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Favorite Modules
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Modules you have marked as favorites.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoadingFavorites ? (
              <div className="px-4 py-5 sm:px-6">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : favorites.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
                No favorite modules yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {favorites.map((module) => (
                  <li key={module.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{module.name}</p>
                        <p className="text-sm text-gray-500">{module.provider} • {module.location}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {module.duration} weeks
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-red-900">
              Danger Zone
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-red-500">
              Irreversible and destructive actions.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <button
              onClick={handleDelete}
              className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
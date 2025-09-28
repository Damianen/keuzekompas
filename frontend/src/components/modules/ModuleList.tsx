import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moduleApi, userApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import type { Module } from '../../types';

const ModuleList: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulesData, favoritesData] = await Promise.all([
          moduleApi.list(),
          user ? userApi.getFavorites(user.id!) : Promise.resolve([])
        ]);

        setModules(Array.isArray(modulesData) ? modulesData : []);
        setFavorites(favoritesData.map(fav => fav.id!));
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        let errorMessage = 'Failed to load data';
        if (err && typeof err === 'object' && 'response' in err) {
          const response = (err as { response?: { data?: { error?: { message?: string }; message?: string } } }).response;
          if (response?.data?.error?.message) {
            errorMessage = response.data.error.message;
          } else if (response?.data?.message) {
            errorMessage = response.data.message;
          }
        }
        setError(errorMessage);
        setModules([]);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) {
      return;
    }

    try {
      await moduleApi.delete(id);
      setModules(modules.filter(module => module.id !== id));
    } catch {
      setError('Failed to delete module');
    }
  };

  const handleToggleFavorite = async (moduleId: string) => {
    if (!user) return;

    try {
      const isFavorite = favorites.includes(moduleId);

      if (isFavorite) {
        await userApi.removeFavorite(user.id!, moduleId);
        setFavorites(favorites.filter(id => id !== moduleId));
      } else {
        await userApi.addFavorite(user.id!, moduleId);
        setFavorites([...favorites, moduleId]);
      }
    } catch (err: unknown) {
      console.error('Error toggling favorite:', err);
      let errorMessage = 'Failed to update favorite';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { error?: { message?: string }; message?: string } } }).response;
        if (response?.data?.error?.message) {
          errorMessage = response.data.error.message;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Modules</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all available study modules.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {user && user.role === 2 && (
            <Link
              to="/modules/create"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add module
            </Link>
          )}
        </div>
      </div>
      {modules.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">No modules available.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {module.name}
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{module.description}</p>
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Provider:</span>
                  <span className="text-gray-900">{module.provider}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-900">{module.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900">{module.duration} weeks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Language:</span>
                  <span className="text-gray-900">{module.language}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <span className="text-gray-900">{module.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Period:</span>
                  <span className="text-gray-900">{module.period}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex space-x-3">
                <Link
                  to={`/modules/${module.id}`}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View details
                </Link>
                {user && (
                  <button
                    onClick={() => handleToggleFavorite(module.id!)}
                    className={`text-sm font-medium ${
                      favorites.includes(module.id!)
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {favorites.includes(module.id!) ? '❤️ Remove from favorites' : '🤍 Add to favorites'}
                  </button>
                )}
                {user && user.role === 2 && (
                  <>
                    <Link
                      to={`/modules/${module.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(module.id!)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleList;
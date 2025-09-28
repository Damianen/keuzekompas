import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { moduleApi } from '../../services/api';
import type { CreateModuleData, UpdateModuleData } from '../../types';

interface ModuleFormProps {
  isEdit?: boolean;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CreateModuleData>({
    name: '',
    location: '',
    period: 0,
    provider: '',
    duration: 0,
    language: '',
    level: '',
    description: '',
    information: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModule, setIsLoadingModule] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      const fetchModule = async () => {
        try {
          const module = await moduleApi.getById(id);
          setFormData({
            name: module.name,
            location: module.location,
            period: module.period,
            provider: module.provider,
            duration: module.duration,
            language: module.language,
            level: module.level,
            description: module.description,
            information: module.information,
          });
        } catch {
          setError('Failed to load module');
        } finally {
          setIsLoadingModule(false);
        }
      };

      fetchModule();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'period' || name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isEdit && id) {
        await moduleApi.update(id, formData as UpdateModuleData);
      } else {
        await moduleApi.create(formData);
      }
      navigate('/modules');
    } catch (err: unknown) {
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} module`;
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingModule) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEdit ? 'Edit Module' : 'Create New Module'}
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Fill in the details for the module.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  Provider
                </label>
                <input
                  type="text"
                  name="provider"
                  id="provider"
                  required
                  value={formData.provider}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  id="language"
                  required
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  id="level"
                  required
                  value={formData.level}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <input
                  type="number"
                  name="period"
                  id="period"
                  required
                  min="1"
                  value={formData.period}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="information" className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  name="information"
                  id="information"
                  rows={3}
                  required
                  value={formData.information}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/modules')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModuleForm;
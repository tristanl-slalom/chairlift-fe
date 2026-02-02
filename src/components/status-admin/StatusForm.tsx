import { useState, useEffect } from 'react';
import { StatusConfig } from '../../types/status-config';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';
import StatusPreview from './StatusPreview';
import { useStatuses } from '../../hooks/useStatuses';

interface StatusFormProps {
  mode: 'create' | 'edit';
  existingStatus?: StatusConfig;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function StatusForm({ mode, existingStatus, onSubmit, onCancel, isSubmitting }: StatusFormProps) {
  const { data: statuses = [] } = useStatuses();

  // Form state
  const [statusKey, setStatusKey] = useState(existingStatus?.statusKey || '');
  const [displayName, setDisplayName] = useState(existingStatus?.displayName || '');
  const [color, setColor] = useState(existingStatus?.color || '#6B7280');
  const [icon, setIcon] = useState(existingStatus?.icon || '📋');
  const [displayOrder, setDisplayOrder] = useState(
    existingStatus?.displayOrder ?? Math.max(...statuses.map(s => s.displayOrder), 0) + 10
  );
  const [isDefault, setIsDefault] = useState(existingStatus?.isDefault || false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update color in hex input when changed from picker
  useEffect(() => {
    setColor(color);
  }, [color]);

  // Validation logic
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Status key validation (only for create mode)
    if (mode === 'create') {
      if (!statusKey) {
        newErrors.statusKey = 'Status key is required';
      } else if (!/^[A-Z_]{2,50}$/.test(statusKey)) {
        newErrors.statusKey = 'Status key must be 2-50 uppercase letters and underscores';
      } else if (statuses.some(s => s.statusKey === statusKey)) {
        newErrors.statusKey = 'Status key already exists';
      }
    }

    // Display name validation
    if (!displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (displayName.length < 1 || displayName.length > 50) {
      newErrors.displayName = 'Display name must be 1-50 characters';
    }

    // Color validation
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      newErrors.color = 'Color must be a valid hex code';
    }

    // Icon validation
    if (!icon) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = mode === 'create'
      ? { statusKey, displayName, displayOrder, color, icon, isDefault }
      : { displayName, displayOrder, color, icon, isDefault };

    await onSubmit(data);
  };

  const isValid = Object.keys(errors).length === 0 && displayName && (mode === 'edit' || statusKey);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Form fields */}
        <div className="space-y-4">
          {/* Status Key (create only) */}
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Key *
              </label>
              <input
                type="text"
                name="statusKey"
                value={statusKey}
                onChange={(e) => setStatusKey(e.target.value.toUpperCase())}
                onBlur={validate}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.statusKey ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="MY_STATUS"
                maxLength={50}
              />
              {errors.statusKey && (
                <p className="mt-1 text-sm text-red-600">{errors.statusKey}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Uppercase letters and underscores only. Cannot be changed after creation.
              </p>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={validate}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.displayName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="My Status"
              maxLength={50}
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
            )}
          </div>

          {/* Color Picker */}
          <ColorPicker
            value={color}
            onChange={setColor}
            label="Color *"
          />

          {/* Icon Picker */}
          <IconPicker
            value={icon}
            onChange={setIcon}
            label="Icon *"
          />

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first in lists
            </p>
          </div>

          {/* Is Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Set as default status for new tasks
            </label>
          </div>
        </div>

        {/* Right column - Preview */}
        <div>
          <StatusPreview
            displayName={displayName || 'Status Name'}
            color={color}
            icon={icon}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Status' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

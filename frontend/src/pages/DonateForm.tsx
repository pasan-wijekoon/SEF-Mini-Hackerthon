import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRole } from '../context/RoleContext';

type FormData = {
  donorName: string;
  donorType: string;
  foodItem: string;
  quantity: string;
  quantityUnit: string;
  forWhom: string;
  location: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  contactNumber: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  donorName: '',
  donorType: '',
  foodItem: '',
  quantity: '',
  quantityUnit: '',
  forWhom: '',
  location: '',
  pickupWindowStart: '',
  pickupWindowEnd: '',
  contactNumber: '',
  notes: '',
};

const donorTypes = ['hotel', 'bakery', 'restaurant', 'household', 'other'];
const quantityUnits = ['kg', 'packets', 'plates', 'loaves', 'items'];
const forWhomOptions = ['people', 'animals', 'both'];

export function DonateForm() {
  const { role } = useRole();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'donorName':
        return value.trim() ? '' : 'Donor name is required';
      case 'donorType':
        return value ? '' : 'Donor type is required';
      case 'foodItem':
        return value.trim() ? '' : 'Food item is required';
      case 'quantity':
        return value && Number(value) > 0 ? '' : 'Quantity must be a positive number';
      case 'quantityUnit':
        return value ? '' : 'Quantity unit is required';
      case 'forWhom':
        return value ? '' : 'For whom is required';
      case 'location':
        return value.trim() ? '' : 'Location is required';
      case 'pickupWindowStart':
        return value ? '' : 'Pickup start time is required';
      case 'pickupWindowEnd':
        return value ? '' : 'Pickup end time is required';
      case 'contactNumber':
        return /^(?:\+94|0)[0-9]{9}$/.test(value)
          ? ''
          : 'Enter a valid Sri Lankan phone number (e.g., 0771234567)';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    // Cross-field validation
    if (formData.pickupWindowStart && formData.pickupWindowEnd) {
      const start = new Date(formData.pickupWindowStart);
      const end = new Date(formData.pickupWindowEnd);
      if (end <= start) {
        newErrors.pickupWindowEnd = 'Pickup end must be after start time';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        pickupWindowStart: new Date(formData.pickupWindowStart).toISOString(),
        pickupWindowEnd: new Date(formData.pickupWindowEnd).toISOString(),
      };

      await axios.post('/api/v1/listings', payload);
      navigate('/my-listings');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const serverErrors: Errors = {};
        err.response.data.errors.forEach((e: { field: string; message: string }) => {
          serverErrors[e.field as keyof FormData] = e.message;
        });
        setErrors(serverErrors);
      } else {
        setSubmitError('Failed to create listing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (role !== 'donor') {
    return (
      <div className="page-container">
        <div className="access-denied">
          <h2>Donor Access Required</h2>
          <p>Please switch to Donor role to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-page">
        <h1 className="page-title">Donate Food</h1>
        <p className="page-subtitle">Fill in the details below to list your surplus food</p>

        {submitError && <div className="alert alert-error">{submitError}</div>}

        <form onSubmit={handleSubmit} className="donate-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="donorName">Donor Name *</label>
              <input
                type="text"
                id="donorName"
                name="donorName"
                value={formData.donorName}
                onChange={handleChange}
                className={errors.donorName ? 'error' : ''}
                placeholder="e.g., Perera Bakery"
              />
              {errors.donorName && <span className="error-message">{errors.donorName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="donorType">Donor Type *</label>
              <select
                id="donorType"
                name="donorType"
                value={formData.donorType}
                onChange={handleChange}
                className={errors.donorType ? 'error' : ''}
              >
                <option value="">Select type</option>
                {donorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.donorType && <span className="error-message">{errors.donorType}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="foodItem">Food Item *</label>
              <input
                type="text"
                id="foodItem"
                name="foodItem"
                value={formData.foodItem}
                onChange={handleChange}
                className={errors.foodItem ? 'error' : ''}
                placeholder="e.g., Bread loaves"
              />
              {errors.foodItem && <span className="error-message">{errors.foodItem}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={errors.quantity ? 'error' : ''}
                placeholder="e.g., 20"
                min="1"
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantityUnit">Quantity Unit *</label>
              <select
                id="quantityUnit"
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className={errors.quantityUnit ? 'error' : ''}
              >
                <option value="">Select unit</option>
                {quantityUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.quantityUnit && <span className="error-message">{errors.quantityUnit}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="forWhom">For Whom *</label>
              <select
                id="forWhom"
                name="forWhom"
                value={formData.forWhom}
                onChange={handleChange}
                className={errors.forWhom ? 'error' : ''}
              >
                <option value="">Select</option>
                {forWhomOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.forWhom && <span className="error-message">{errors.forWhom}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="e.g., Ratnapura Town"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupWindowStart">Pickup Window Start *</label>
              <input
                type="datetime-local"
                id="pickupWindowStart"
                name="pickupWindowStart"
                value={formData.pickupWindowStart}
                onChange={handleChange}
                className={errors.pickupWindowStart ? 'error' : ''}
              />
              {errors.pickupWindowStart && <span className="error-message">{errors.pickupWindowStart}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pickupWindowEnd">Pickup Window End *</label>
              <input
                type="datetime-local"
                id="pickupWindowEnd"
                name="pickupWindowEnd"
                value={formData.pickupWindowEnd}
                onChange={handleChange}
                className={errors.pickupWindowEnd ? 'error' : ''}
              />
              {errors.pickupWindowEnd && <span className="error-message">{errors.pickupWindowEnd}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number *</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={errors.contactNumber ? 'error' : ''}
              placeholder="e.g., 0771234567"
            />
            {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional information (e.g., vegetarian, halal, pickup instructions)"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Listing'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
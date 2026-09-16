import React, { useState, useEffect } from 'react';
import packageService from '../services/packageService';
import destinationService from '../services/destinationService';
import adminService from '../services/adminService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatCurrency';
import { CATEGORIES } from '../utils/constants';
import { Plus, Edit2, Trash2, Image, Upload, AlertCircle, Check } from 'lucide-react';

export const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    destinationId: '',
    name: '',
    description: '',
    durationDays: 4,
    durationNights: 3,
    pricePerPerson: 25000,
    maxTravellers: 10,
    category: 'Family',
    mainImageUrl: '',
    includedServices: 'Hotel stay, Breakfast, Sightseeing transfers, Guide',
    excludedServices: 'Flight tickets, Personal shopping, Tips',
    itinerary: 'Day 1: Arrival & Hotel Check-in\nDay 2: Guided Sightseeing Tour\nDay 3: Nature & Leisure Exploration\nDay 4: Departure transfer',
    cancellationPolicy: 'Free cancellation up to 7 days before departure.',
    status: 'ACTIVE',
    galleryImages: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPackagesAndDestinations();
  }, []);

  const fetchPackagesAndDestinations = async () => {
    setLoading(true);
    try {
      const [pkgs, dests] = await Promise.all([
        packageService.getAllForAdmin(),
        destinationService.getAll(false)
      ]);
      setPackages(pkgs || []);
      setDestinations(dests || []);
      if (dests && dests.length > 0 && !formData.destinationId) {
        setFormData(prev => ({ ...prev, destinationId: dests[0].id }));
      }
    } catch (err) {
      console.error("Error loading packages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      ...initialFormState,
      destinationId: destinations.length > 0 ? destinations[0].id : ''
    });
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setIsEditing(true);
    setCurrentId(pkg.id);
    setFormData({
      destinationId: pkg.destinationId,
      name: pkg.name,
      description: pkg.description || '',
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
      pricePerPerson: pkg.pricePerPerson,
      maxTravellers: pkg.maxTravellers,
      category: pkg.category || 'Family',
      mainImageUrl: pkg.mainImageUrl || '',
      includedServices: pkg.includedServices || '',
      excludedServices: pkg.excludedServices || '',
      itinerary: pkg.itinerary || '',
      cancellationPolicy: pkg.cancellationPolicy || '',
      status: pkg.status,
      galleryImages: pkg.images || []
    });
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await adminService.uploadImage(file);
      setFormData(prev => ({ ...prev, mainImageUrl: res.url }));
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (isEditing) {
        await packageService.update(currentId, formData);
        setSuccessMessage("Package updated successfully!");
      } else {
        await packageService.create(formData);
        setSuccessMessage("Package created successfully and is now live on TravelGo!");
      }
      setTimeout(() => {
        setModalOpen(false);
        fetchPackagesAndDestinations();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save package.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? If bookings exist, this package will be safely deactivated.")) return;
    try {
      await packageService.delete(id);
      fetchPackagesAndDestinations();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  if (loading) return <Loader message="Loading packages table..." />;

  return (
    <div className="space-y-6">
      
      {/* Top action bar matching UI reference */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Tour Packages</h2>
          <p className="text-xs text-gray-500">Live database CRUD directly impacting the customer storefront</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Package
        </button>
      </div>

      {/* Package Management Table matching UI Reference */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-4">
                    <img
                      src={pkg.mainImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80'}
                      alt={pkg.name}
                      className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{pkg.name}</td>
                  <td className="py-3 px-4 text-gray-600">{pkg.destinationName}</td>
                  <td className="py-3 px-4 font-extrabold text-gray-900">
                    {formatCurrency(pkg.pricePerPerson)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      pkg.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {pkg.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Package"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete / Deactivate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Package Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Tour Package' : 'Create New Holiday Package'}
        maxWidth="max-w-3xl"
      >
        {successMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center">
            <Check className="w-4 h-4 mr-2" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination *</label>
              <select
                required
                value={formData.destinationId}
                onChange={(e) => setFormData({ ...formData, destinationId: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration Days</label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nights</label>
              <input
                type="number"
                min="0"
                required
                value={formData.durationNights}
                onChange={(e) => setFormData({ ...formData, durationNights: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹/person)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.pricePerPerson}
                onChange={(e) => setFormData({ ...formData, pricePerPerson: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Capacity</label>
              <input
                type="number"
                min="1"
                required
                value={formData.maxTravellers}
                onChange={(e) => setFormData({ ...formData, maxTravellers: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* Main Image URL & Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Main Image URL / Upload to Cloudinary
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.mainImageUrl}
                onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer flex items-center shrink-0 border border-gray-300">
                <Upload className="w-4 h-4 mr-1.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Included Services</label>
              <textarea
                rows={2}
                value={formData.includedServices}
                onChange={(e) => setFormData({ ...formData, includedServices: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Excluded Services</label>
              <textarea
                rows={2}
                value={formData.excludedServices}
                onChange={(e) => setFormData({ ...formData, excludedServices: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Itinerary (One day per line)</label>
            <textarea
              rows={4}
              value={formData.itinerary}
              onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
            >
              {isEditing ? 'Save Changes' : 'Create Package'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ManagePackages;

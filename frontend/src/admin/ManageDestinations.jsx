import React, { useState, useEffect } from 'react';
import destinationService from '../services/destinationService';
import adminService from '../services/adminService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Upload, AlertCircle, Check, MapPin } from 'lucide-react';

export const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    name: '',
    state: '',
    country: 'India',
    description: '',
    imageUrl: '',
    category: '',
    latitude: 20.5937,
    longitude: 78.9629,
    status: 'ACTIVE'
  };

  const [formData, setFormData] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll(false);
      setDestinations(data || []);
    } catch (err) {
      console.error("Error loading destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialForm);
    setErrorMessage('');
    setSuccessMessage('');
    setModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setIsEditing(true);
    setCurrentId(d.id);
    setFormData({
      name: d.name,
      state: d.state || '',
      country: d.country || 'India',
      description: d.description || '',
      imageUrl: d.imageUrl || '',
      category: d.category || '',
      latitude: d.latitude || 20.5937,
      longitude: d.longitude || 78.9629,
      status: d.status
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
      setFormData(prev => ({ ...prev, imageUrl: res.url }));
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
        await destinationService.update(currentId, formData);
        setSuccessMessage("Destination updated successfully!");
      } else {
        await destinationService.create(formData);
        setSuccessMessage("Destination created successfully!");
      }
      setTimeout(() => {
        setModalOpen(false);
        fetchDestinations();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save destination.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? If packages depend on this destination, it will be safely deactivated.")) return;
    try {
      await destinationService.delete(id);
      fetchDestinations();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  if (loading) return <Loader message="Loading destinations..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Destinations</h2>
          <p className="text-xs text-gray-500">Add, edit, or deactivate tourist destinations</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Destination
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {destinations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-4">
                    <img
                      src={d.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80'}
                      alt={d.name}
                      className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{d.name}</td>
                  <td className="py-3 px-4 text-gray-600">{d.state}</td>
                  <td className="py-3 px-4 text-gray-600">{d.category || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      d.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
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

      {/* Destination Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Destination' : 'Add New Destination'}
      >
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center">
            <Check className="w-4 h-4 mr-2" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Backwaters & Nature"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Image URL / Upload Image
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
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
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
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
              {isEditing ? 'Save Changes' : 'Create Destination'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDestinations;

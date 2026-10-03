import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { Sprout } from 'lucide-react';

const PlantForm = ({ initialData, onSubmit, loading, buttonText = 'Save Plant' }) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Living Room');
  const [wateringFrequency, setWateringFrequency] = useState(7);
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  const [sunlightRequirement, setSunlightRequirement] = useState('Bright Indirect');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSpecies(initialData.species || '');
      setDescription(initialData.description || '');
      setLocation(initialData.location || 'Living Room');
      setWateringFrequency(initialData.wateringFrequency || 7);
      if (initialData.lastWatered) {
        setLastWatered(new Date(initialData.lastWatered).toISOString().split('T')[0]);
      }
      setSunlightRequirement(initialData.sunlightRequirement || 'Bright Indirect');
      setHealthStatus(initialData.healthStatus || 'Healthy');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If user uploaded a file, build FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('wateringFrequency', wateringFrequency);
      formData.append('lastWatered', lastWatered);
      formData.append('sunlightRequirement', sunlightRequirement);
      formData.append('healthStatus', healthStatus);
      formData.append('image', imageFile);
      onSubmit(formData);
    } else {
      // Send regular object
      onSubmit({
        name,
        species,
        description,
        location,
        wateringFrequency: Number(wateringFrequency),
        lastWatered,
        sunlightRequirement,
        healthStatus,
        imageUrl,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Plant Nickname *</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Monty, Spike, Leafy"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Botanical Species *</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. Monstera Deliciosa, Echeveria Succulent, Snake Plant"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Location / Room</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Living Room, Balcony"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Water Every (Days) *</label>
          <input
            type="number"
            min="1"
            max="90"
            className="form-control"
            value={wateringFrequency}
            onChange={(e) => setWateringFrequency(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>Last Watered Date</label>
          <input
            type="date"
            className="form-control"
            value={lastWatered}
            onChange={(e) => setLastWatered(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sunlight Requirement</label>
          <select
            className="form-control"
            value={sunlightRequirement}
            onChange={(e) => setSunlightRequirement(e.target.value)}
          >
            <option value="Bright Indirect">Bright Indirect</option>
            <option value="Direct Sunlight">Direct Sunlight</option>
            <option value="Low Light">Low Light</option>
            <option value="Partial Shade">Partial Shade</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Plant Description & Care Notes</label>
        <textarea
          className="form-control"
          placeholder="Add care tips, pot size, fertilizer schedule, or soil notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <ImageUpload
        onFileSelect={(file) => setImageFile(file)}
        onUrlSelect={(url) => setImageUrl(url)}
        currentImageUrl={imageUrl}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', width: '100%' }}
        >
          <Sprout size={18} /> {loading ? 'Saving...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default PlantForm;

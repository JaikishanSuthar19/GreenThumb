import React, { useState } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onFileSelect, onUrlSelect, currentImageUrl }) => {
  const [tab, setTab] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [preview, setPreview] = useState(currentImageUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrlInput(value);
    setPreview(value);
    if (onUrlSelect) onUrlSelect(value);
  };

  const clearImage = () => {
    setPreview(null);
    setUrlInput('');
    if (onFileSelect) onFileSelect(null);
    if (onUrlSelect) onUrlSelect('');
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#064e3b', marginBottom: '8px' }}>
        Plant Photo (Firebase Storage / URL)
      </label>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={() => setTab('file')}
          className={`btn ${tab === 'file' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
        >
          <Upload size={14} /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`btn ${tab === 'url' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
        >
          <Link size={14} /> Image URL
        </button>
      </div>

      {tab === 'file' ? (
        <div
          style={{
            border: '2px dashed #a7f3d0',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center',
            background: '#f0fdf4',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
          <ImageIcon size={28} color="#059669" style={{ margin: '0 auto 6px auto' }} />
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
            Click or drag an image here to upload to Firebase
          </p>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>JPG, PNG, WEBP, GIF (Max 10MB)</span>
        </div>
      ) : (
        <input
          type="url"
          className="form-control"
          placeholder="https://images.unsplash.com/photo-..."
          value={urlInput}
          onChange={handleUrlChange}
        />
      )}

      {/* Image Preview */}
      {preview && (
        <div style={{ marginTop: '12px', position: 'relative', width: 'fit-content' }}>
          <img
            src={preview}
            alt="Upload preview"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '2px solid #34d399',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

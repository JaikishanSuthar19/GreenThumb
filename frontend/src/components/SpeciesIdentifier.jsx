import React, { useState } from 'react';
import { ScanLine, Sparkles, CheckCircle, Info, Droplets, Sun, AlertTriangle } from 'lucide-react';
import { identifyPlant } from '../services/api';
import ImageUpload from './ImageUpload';
import LoadingSpinner from './LoadingSpinner';

const SpeciesIdentifier = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleIdentify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        if (hint) formData.append('hint', hint);
        res = await identifyPlant(formData);
      } else {
        res = await identifyPlant({ imageUrl, hint });
      }

      if (res.success) {
        setResult(res.identification);
      }
    } catch (err) {
      setError(err.message || 'Failed to identify plant image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={{ background: '#ecfdf5', color: '#059669', padding: '10px', borderRadius: '12px' }}>
          <ScanLine size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#064e3b', fontWeight: 800 }}>
            AI Plant Species Identifier
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#059669' }}>
            Upload a clear photo of leaves or flower rosettes to identify scientific species & care guides!
          </p>
        </div>
      </div>

      <form onSubmit={handleIdentify}>
        <ImageUpload
          onFileSelect={(f) => setFile(f)}
          onUrlSelect={(u) => setImageUrl(u)}
          currentImageUrl={imageUrl}
        />

        <div className="form-group">
          <label>Optional Search Hint / Leaf Shape</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. succulent, fenestrated leaf, variegated, oval"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || (!file && !imageUrl)}
          style={{ width: '100%', padding: '0.75rem' }}
        >
          <Sparkles size={18} /> {loading ? 'Analyzing Plant Imagery...' : 'Identify Plant Species'}
        </button>
      </form>

      {loading && <LoadingSpinner message="Scanning leaf contours and foliage pattern..." />}

      {error && (
        <div style={{ marginTop: '1rem', color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4ea 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-green">Match Confidence: {(result.confidence * 100).toFixed(0)}%</span>
              <h3 style={{ margin: '6px 0 2px 0', fontSize: '1.3rem', color: '#064e3b' }}>
                {result.commonName}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#059669', fontStyle: 'italic', fontWeight: 600 }}>
                {result.scientificName} ({result.family})
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5, marginBottom: '1rem' }}>
            {result.description}
          </p>

          <h4 style={{ fontSize: '0.95rem', color: '#064e3b', marginBottom: '0.5rem', fontWeight: 700 }}>
            🌿 Optimal Care Recommendations:
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700 }}>
                <Sun size={14} /> Sunlight
              </div>
              <span style={{ color: '#4b5563' }}>{result.careGuide?.light}</span>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700 }}>
                <Droplets size={14} /> Watering
              </div>
              <span style={{ color: '#4b5563' }}>{result.careGuide?.watering}</span>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700 }}>
                <Info size={14} /> Humidity
              </div>
              <span style={{ color: '#4b5563' }}>{result.careGuide?.humidity}</span>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #d1fae5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: 700 }}>
                <AlertTriangle size={14} /> Pet Safety
              </div>
              <span style={{ color: '#4b5563' }}>{result.careGuide?.toxicity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesIdentifier;

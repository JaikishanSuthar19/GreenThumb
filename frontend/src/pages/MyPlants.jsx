import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlants, searchPlants, createPlant, updatePlant, deletePlant, createReminder } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PlantCard from '../components/PlantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import PlantForm from '../components/PlantForm';
import { Sprout, Search, Plus, Sparkles, Droplets, Calendar } from 'lucide-react';

const MyPlants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('search') || '';

  const [plants, setPlants] = useState([]);
  const [speciesGuide, setSpeciesGuide] = useState([]);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPlants = async () => {
    setLoading(true);
    setError(null);
    try {
      if (keyword.trim()) {
        const searchRes = await searchPlants(keyword.trim());
        if (searchRes.success) {
          setPlants(searchRes.data || []);
          setSpeciesGuide(searchRes.speciesGuide || []);
        }
      } else {
        const res = await getPlants();
        if (res.success) {
          setPlants(res.data || []);
          setSpeciesGuide([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching plants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, [keyword]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleCreatePlant = async (plantData) => {
    setActionLoading(true);
    try {
      await createPlant(plantData);
      setIsAddModalOpen(false);
      loadPlants();
    } catch (err) {
      alert(err.message || 'Failed to create plant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlant = async (plantData) => {
    if (!editingPlant) return;
    setActionLoading(true);
    try {
      await updatePlant(editingPlant._id, plantData);
      setEditingPlant(null);
      loadPlants();
    } catch (err) {
      alert(err.message || 'Failed to update plant');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlant = async (id) => {
    if (window.confirm('Are you sure you want to remove this plant and its care schedule?')) {
      try {
        await deletePlant(id);
        loadPlants();
      } catch (err) {
        alert(err.message || 'Failed to delete plant');
      }
    }
  };

  const handleQuickWater = async (plantId) => {
    try {
      const targetPlant = plants.find((p) => p._id === plantId);
      if (targetPlant) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (targetPlant.wateringFrequency || 7));
        await updatePlant(plantId, {
          lastWatered: new Date().toISOString(),
          nextWatering: nextDate.toISOString(),
          healthStatus: 'Thriving',
        });
        loadPlants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add species guide item to catalog (Case Study Flow)
  const handleCatalogSpecies = async (speciesItem) => {
    setActionLoading(true);
    try {
      const plantData = {
        name: speciesItem.name,
        species: speciesItem.species,
        description: speciesItem.description,
        location: speciesItem.location || 'Living Room',
        wateringFrequency: speciesItem.wateringFrequency || 14,
        sunlightRequirement: speciesItem.sunlightRequirement || 'Direct Sunlight',
        imageUrl: speciesItem.imageUrl,
      };
      await createPlant(plantData);
      alert(`Successfully added ${speciesItem.name} to your garden collection!`);
      setKeyword('');
      setSearchParams({});
      loadPlants();
    } catch (err) {
      alert(err.message || 'Failed to add species to collection');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAddPlant={() => setIsAddModalOpen(true)} />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: 800, margin: 0 }}>
                My Houseplants & Search
              </h1>
              <p style={{ color: '#059669', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                Search species, catalog succulents, and manage individual care routines
              </p>
            </div>

            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> Add Plant to Garden
            </button>
          </div>

          {/* Search Filter Box */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1rem 1.25rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={20} color="#059669" style={{ position: 'absolute', left: '14px' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search plants by name or keyword (e.g. succulent, monstera, aloe)..."
                value={keyword}
                onChange={handleSearchChange}
                style={{ paddingLeft: '44px', fontSize: '1rem', borderRadius: '12px' }}
              />
            </div>
          </div>

          <ErrorMessage message={error} />

          {loading ? (
            <LoadingSpinner message="Searching botanical database..." />
          ) : (
            <>
              {/* User Plants Results */}
              {plants.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 700, marginBottom: '1rem' }}>
                    {keyword ? `Matching Collection Plants (${plants.length})` : `My Houseplant Collection (${plants.length})`}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {plants.map((plant) => (
                      <PlantCard
                        key={plant._id}
                        plant={plant}
                        onWater={handleQuickWater}
                        onEdit={(p) => setEditingPlant(p)}
                        onDelete={handleDeletePlant}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Botanical Catalog Species Guide Matches (Case Study search?keyword=succulent flow) */}
              {speciesGuide.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Sparkles size={20} color="#d97706" />
                    <h3 style={{ fontSize: '1.25rem', color: '#064e3b', fontWeight: 700, margin: 0 }}>
                      Botanical Catalog Recommendations for "{keyword}"
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {speciesGuide.map((spec, i) => (
                      <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <img
                            src={spec.imageUrl}
                            alt={spec.name}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }}
                          />
                          <span className="badge badge-amber" style={{ marginBottom: '6px' }}>{spec.sunlightRequirement}</span>
                          <h4 style={{ margin: 0, color: '#064e3b', fontSize: '1.1rem' }}>{spec.name}</h4>
                          <p style={{ fontSize: '0.8rem', color: '#059669', fontStyle: 'italic', margin: '2px 0 6px 0' }}>{spec.species}</p>
                          <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.4 }}>{spec.description}</p>
                        </div>

                        <button
                          onClick={() => handleCatalogSpecies(spec)}
                          className="btn btn-secondary"
                          style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem' }}
                        >
                          <Plus size={16} /> Add {spec.name} to My Garden
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plants.length === 0 && speciesGuide.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Sprout size={48} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#064e3b', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    No matching plants found for "{keyword}"
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    Try searching for "succulent", "monstera", "aloe", or clear the search input to view your collection.
                  </p>
                  <button onClick={() => { setKeyword(''); setSearchParams({}); }} className="btn btn-secondary">
                    Clear Search Filter
                  </button>
                </div>
              )}
            </>
          )}

          {/* Add Plant Modal */}
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Plant to Collection">
            <PlantForm onSubmit={handleCreatePlant} loading={actionLoading} buttonText="Create Plant" />
          </Modal>

          {/* Edit Plant Modal */}
          <Modal isOpen={!!editingPlant} onClose={() => setEditingPlant(null)} title={`Edit ${editingPlant?.name || 'Plant'}`}>
            <PlantForm initialData={editingPlant} onSubmit={handleUpdatePlant} loading={actionLoading} buttonText="Save Changes" />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default MyPlants;

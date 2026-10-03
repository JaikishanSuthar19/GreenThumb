import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Calendar, Users, User, ScanLine, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/plants', label: 'My Plants', icon: Sprout },
    { path: '/reminders', label: 'Care Schedule', icon: Calendar },
    { path: '/community', label: 'Community Feed', icon: Users },
    { path: '/identify', label: 'AI Plant Identifier', icon: ScanLine, badge: 'AI' },
    { path: '/profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(16, 185, 129, 0.15)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 0.5rem 0.75rem 0.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Menu Navigation
        </p>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              background: isActive
                ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                : 'transparent',
              color: isActive ? '#ffffff' : '#374151',
              boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}

      <div
        style={{
          marginTop: 'auto',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          borderRadius: '14px',
          padding: '1rem',
          border: '1px solid #a7f3d0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={18} color="#059669" />
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#064e3b' }}>GreenThumb Tip</h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857', lineHeight: 1.4 }}>
          Water succulents thoroughly only when the top 2 inches of soil feel bone dry!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testimonialsApi } from '../lib/supabase'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const data = await testimonialsApi.getAll()
      setTestimonials(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (id, currentVisible) => {
    try {
      await testimonialsApi.update(id, { visible: !currentVisible })
      setTestimonials(prev =>
        prev.map(t => t.id === id ? { ...t, visible: !currentVisible } : t)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Testimonials</h1>
          <div className="page-subtitle">
            Manage chef testimonials ({testimonials.length} total, {testimonials.filter(t => t.visible).length} visible)
          </div>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">
          + Add Testimonial
        </Link>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No testimonials yet</p>
          <p style={{ color: 'var(--color-gray-text)', marginBottom: '24px' }}>Add your first chef testimonial to display on the homepage.</p>
          <Link to="/testimonials/new" className="btn btn-primary">+ Add Testimonial</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Chef</th>
                <th>Restaurant</th>
                <th>Quote</th>
                <th>Visible</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.id}>
                  <td style={{ width: '60px', textAlign: 'center', fontWeight: 600 }}>{t.sort_order}</td>
                  <td style={{ fontWeight: 500 }}>{t.chef_name}</td>
                  <td style={{ color: 'var(--color-gray-text)' }}>{t.restaurant}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>
                    "{t.quote}"
                  </td>
                  <td style={{ width: '80px' }}>
                    <button
                      onClick={() => toggleVisibility(t.id, t.visible)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: t.visible ? '#dcfce7' : '#f3f4f6',
                        color: t.visible ? '#166534' : '#6b7280'
                      }}
                    >
                      {t.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ width: '80px' }}>
                    <Link to={`/testimonials/${t.id}`} className="btn btn-small btn-secondary">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

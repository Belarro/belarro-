import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { testimonialsApi } from '../lib/supabase'

export default function TestimonialEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    chef_name: '',
    restaurant: '',
    quote: '',
    sort_order: 0,
    visible: true
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!isNew)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isNew) {
      loadTestimonial()
    }
  }, [id, isNew])

  const loadTestimonial = async () => {
    try {
      setLoadingData(true)
      const testimonial = await testimonialsApi.getById(id)
      if (testimonial) {
        setForm({
          chef_name: testimonial.chef_name || '',
          restaurant: testimonial.restaurant || '',
          quote: testimonial.quote || '',
          sort_order: testimonial.sort_order || 0,
          visible: testimonial.visible !== false
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'sort_order' ? parseInt(value, 10) || 0 : value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        chef_name: form.chef_name,
        restaurant: form.restaurant,
        quote: form.quote,
        sort_order: form.sort_order,
        visible: form.visible
      }

      if (isNew) {
        await testimonialsApi.create(data)
      } else {
        await testimonialsApi.update(id, data)
      }

      navigate('/testimonials')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this testimonial? This cannot be undone.')) {
      try {
        await testimonialsApi.delete(id)
        navigate('/testimonials')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loadingData) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading testimonial...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/testimonials" style={{ fontSize: '14px', color: 'var(--color-gray-text)', marginBottom: '4px', display: 'block', textDecoration: 'none' }}>&larr; Back to Testimonials</Link>
          <h1>{isNew ? 'Add Testimonial' : 'Edit Testimonial'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/testimonials')}>
            Cancel
          </button>
          <button type="submit" form="testimonial-form" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Testimonial'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ffebeb', color: '#ef476f', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px' }}>
          Error: {error}
        </div>
      )}

      <form id="testimonial-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginTop: 0 }}>Testimonial Content</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="quote">Quote</label>
              <textarea
                id="quote"
                name="quote"
                className="form-textarea"
                value={form.quote}
                onChange={handleChange}
                required
                rows={4}
                placeholder="What the chef said about Belarro..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="chef_name">Chef Name</label>
                <input
                  type="text"
                  id="chef_name"
                  name="chef_name"
                  className="form-input"
                  value={form.chef_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Marco Richter"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="restaurant">Restaurant</label>
                <input
                  type="text"
                  id="restaurant"
                  name="restaurant"
                  className="form-input"
                  value={form.restaurant}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Cafe Bauer, Berlin"
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginTop: 0 }}>Settings</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="sort_order">Display Order</label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                className="form-input"
                value={form.sort_order}
                onChange={handleChange}
                min="0"
              />
              <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '4px' }}>
                Lower numbers appear first. The first 3 visible testimonials are shown on the homepage.
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  name="visible"
                  checked={form.visible}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Visible on website
              </label>
              <div style={{ fontSize: '12px', color: 'var(--color-gray-text)', marginTop: '4px', marginLeft: '28px' }}>
                When unchecked, this testimonial will not appear on the public website.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

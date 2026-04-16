import { useState, useEffect, useRef } from 'react'
import { productsApi } from '../lib/supabase'

const SIZES = ['container', '225g', '450g']

export default function Prices() {
  const [products, setProducts]     = useState([])
  const [edited, setEdited]         = useState({})   // { productId: { prices, available_sizes } }
  const [saving, setSaving]         = useState(false)
  const [savedIds, setSavedIds]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [filter, setFilter]         = useState('')
  const saveTimerRef                = useRef({})

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const data = await productsApi.getAll()
      setProducts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Get working copy of a product (edited override or original)
  function getProduct(p) {
    return edited[p.id] ? { ...p, ...edited[p.id] } : p
  }

  function getPrices(p) {
    const wp = getProduct(p)
    return wp.prices || {}
  }

  function getSizes(p) {
    const wp = getProduct(p)
    const sizes = wp.available_sizes
    if (!sizes) return []
    // handle both jsonb array (JS array after parse) and native array
    return Array.isArray(sizes) ? sizes : []
  }

  function handlePriceChange(product, size, value) {
    const current = getProduct(product)
    const newPrices = { ...(current.prices || {}), [size]: value === '' ? '' : parseFloat(value) }
    setEdited(prev => ({
      ...prev,
      [product.id]: {
        ...(prev[product.id] || {}),
        prices: newPrices,
        available_sizes: current.available_sizes
      }
    }))
  }

  function addSize(product, size) {
    const current = getProduct(product)
    const newSizes = [...(current.available_sizes || []), size]
    const newPrices = { ...(current.prices || {}), [size]: '' }
    setEdited(prev => ({
      ...prev,
      [product.id]: {
        ...(prev[product.id] || {}),
        available_sizes: newSizes,
        prices: newPrices
      }
    }))
  }

  function removeSize(product, size) {
    const current = getProduct(product)
    const newSizes = (current.available_sizes || []).filter(s => s !== size)
    const newPrices = { ...(current.prices || {}) }
    delete newPrices[size]
    setEdited(prev => ({
      ...prev,
      [product.id]: {
        ...(prev[product.id] || {}),
        available_sizes: newSizes,
        prices: newPrices
      }
    }))
  }

  function hasChanges(p) {
    return !!edited[p.id]
  }

  async function saveProduct(p) {
    const changes = edited[p.id]
    if (!changes) return
    try {
      await productsApi.update(p.id, changes)
      setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, ...changes } : prod))
      setSavedIds(prev => [...prev, p.id])
      setTimeout(() => setSavedIds(prev => prev.filter(id => id !== p.id)), 2000)
      setEdited(prev => { const next = { ...prev }; delete next[p.id]; return next })
    } catch (e) {
      alert('Save failed: ' + e.message)
    }
  }

  async function saveAll() {
    const dirty = products.filter(p => edited[p.id])
    if (!dirty.length) return
    setSaving(true)
    try {
      await Promise.all(dirty.map(p => productsApi.update(p.id, edited[p.id])))
      setProducts(prev => prev.map(p => edited[p.id] ? { ...p, ...edited[p.id] } : p))
      setSavedIds(dirty.map(p => p.id))
      setTimeout(() => setSavedIds([]), 2000)
      setEdited({})
    } catch (e) {
      alert('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  function revert(p) {
    setEdited(prev => { const next = { ...prev }; delete next[p.id]; return next })
  }

  const dirtyCount = Object.keys(edited).length
  const filtered = products.filter(p => !filter || p.name.toLowerCase().includes(filter.toLowerCase()))

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Loading prices…</div>
  if (error)   return <div style={{ padding: 48, color: '#ef476f' }}>Error: {error}</div>

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Prices</h1>
          <p style={{ fontSize: 13, color: 'var(--color-gray-text)', margin: '4px 0 0' }}>
            Edit here → saves to Supabase → for-chefs page updates live
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {dirtyCount > 0 && (
            <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>
              {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}
            </span>
          )}
          <button
            className="btn btn-primary"
            onClick={saveAll}
            disabled={saving || dirtyCount === 0}
          >
            {saving ? 'Saving…' : `Save All${dirtyCount > 0 ? ` (${dirtyCount})` : ''}`}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search products…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, width: 240 }}
        />
      </div>

      {/* Flat table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '22%' }}>Product</th>
              {SIZES.map(s => (
                <th key={s} style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>
                  {s === 'container' ? 'Container' : s}
                </th>
              ))}
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const sizes     = getSizes(p)
              const prices    = getPrices(p)
              const dirty     = hasChanges(p)
              const justSaved = savedIds.includes(p.id)

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                    background: justSaved ? '#f0fdf4' : dirty ? '#fffbeb' : 'white',
                    transition: 'background 0.3s'
                  }}
                >
                  <td style={{ padding: '10px 16px', fontWeight: dirty ? 600 : 400, color: '#111827' }}>
                    {p.name}
                    {dirty && <span style={{ marginLeft: 6, fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>●</span>}
                    {justSaved && <span style={{ marginLeft: 6, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>✓</span>}
                  </td>

                  {SIZES.map(size => {
                    const hasSize = sizes.includes(size)
                    const val     = prices[size]
                    return (
                      <td key={size} style={{ padding: '6px 4px', textAlign: 'center' }}>
                        {hasSize ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <span style={{ fontSize: 11, color: '#6b7280' }}>€</span>
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={val === '' || val == null ? '' : val}
                              onChange={e => handlePriceChange(p, size, e.target.value)}
                              style={{
                                width: 48,
                                padding: '4px 4px',
                                border: '1px solid #d1d5db',
                                borderRadius: 4,
                                fontSize: 13,
                                fontWeight: 600,
                                textAlign: 'center',
                                background: dirty && edited[p.id]?.prices?.[size] !== undefined ? '#fef3c7' : 'white'
                              }}
                            />
                            <button
                              onClick={() => removeSize(p, size)}
                              title="Remove size"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 11, padding: '0 1px', lineHeight: 1 }}
                            >×</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addSize(p, size)}
                            title={`Add ${size}`}
                            style={{ background: 'none', border: '1px dashed #e5e7eb', borderRadius: 4, cursor: 'pointer', color: '#d1d5db', fontSize: 11, padding: '3px 6px', width: 44 }}
                          >+</button>
                        )}
                      </td>
                    )
                  })}

                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                    {dirty ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => revert(p)}
                          style={{ fontSize: 11, padding: '3px 8px', border: '1px solid #e5e7eb', borderRadius: 4, background: 'white', cursor: 'pointer', color: '#6b7280' }}
                        >✕</button>
                        <button
                          onClick={() => saveProduct(p)}
                          style={{ fontSize: 11, padding: '3px 8px', border: 'none', borderRadius: 4, background: '#15803d', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                        >Save</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: '#d1d5db' }}>—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom save bar — sticky when there are changes */}
      {dirtyCount > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 240, right: 0,
          background: '#1f2937', borderTop: '2px solid #f59e0b',
          padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 100
        }}>
          <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: 14 }}>
            {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setEdited({})}
              style={{ padding: '8px 20px', border: '1px solid #6b7280', borderRadius: 6, background: 'transparent', color: '#d1d5db', cursor: 'pointer', fontSize: 13 }}
            >
              Revert All
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              style={{ padding: '8px 24px', border: 'none', borderRadius: 6, background: '#22c55e', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            >
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

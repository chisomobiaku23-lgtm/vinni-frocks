'use client'

import { useEffect, useState } from 'react'
import '../globals.css'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load() {
    const session = await fetch('/api/admin').then(r => r.json())
    if (session.authenticated) { setAuthed(true); setProducts(await fetch('/api/products', { cache: 'no-store' }).then(r => r.json())) }
  }
  useEffect(() => { load() }, [])
  async function login(e) { e.preventDefault(); const r = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); if (r.ok) { setAuthed(true); setProducts(await fetch('/api/products', { cache: 'no-store' }).then(x => x.json())) } else setError('Incorrect password') }
  async function saveProduct(e) { e.preventDefault(); const formElement = e.currentTarget; const form = new FormData(formElement); const url = editing ? '/api/products' : '/api/products'; if (editing) form.append('id', editing.id); const r = await fetch(url, { method: editing ? 'PUT' : 'POST', body: form, headers: { 'x-admin-session': '1' } }); if (r.ok) { setProducts(await fetch('/api/products', { cache: 'no-store' }).then(x => x.json())); setFormOpen(false); setEditing(null); formElement.reset() } else setError('Could not save this product. Please try again.') }
  async function remove(id) { if (!window.confirm('Delete this product?')) return; const r = await fetch(`/api/products?id=${id}`, { method: 'DELETE', cache: 'no-store' }); if (r.ok) setProducts(await fetch('/api/products', { cache: 'no-store' }).then(x => x.json())); else setError('Could not delete this product.') }
  function startEdit(product) { setEditing(product); setFormOpen(true) }
  async function logout() { await fetch('/api/admin', { method: 'DELETE' }); setAuthed(false) }

  if (!authed) return <main className="admin-login-page"><div className="admin-login-card"><a className="logo" href="/">VINNI-FROCKS<span>®</span></a><p className="eyebrow">PRIVATE STORE ACCESS</p><h1>Admin portal</h1><p>Manage your VINNI-FROCKS products privately.</p><form onSubmit={login}><input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password"/><button className="button dark" type="submit">Enter portal <span>↗</span></button></form>{error && <small className="login-error">{error}</small>}<a href="/" className="back-link">← Back to store</a></div></main>

  return <main className="admin-page"><div className="admin-page-head"><div><a className="logo" href="/">VINNI-FROCKS<span>®</span></a><p className="eyebrow">PRIVATE ADMIN</p><h1>Store products</h1></div><div><button className="outline-button" onClick={() => { setEditing(null); setFormOpen(!formOpen) }}>{formOpen ? 'Close form' : '+ Add product'}</button><button className="text-button" onClick={logout}>Log out</button></div></div><p className="admin-note">The original items were demo placeholders and have been removed. Add your real inventory here.</p>{error && <small className="login-error admin-error">{error}</small>}{formOpen && <form className="add-product-form" onSubmit={saveProduct}><input name="name" required defaultValue={editing?.name || ''} placeholder="Product name"/><select name="category" defaultValue={editing?.category || 'Dresses'}><option>Dresses</option><option>Outerwear</option><option>Bottoms</option><option>Accessories</option></select><input name="price" required type="number" min="1" defaultValue={editing?.price || ''} placeholder="Price in NGN"/><input name="image" defaultValue={editing?.image || ''} placeholder="Image URL (optional)"/><label className="file-upload">Upload product picture from your device<input name="file" type="file" accept="image/*"/></label><button className="button dark" type="submit">{editing ? 'Save changes' : 'Publish product'} <span>↗</span></button></form>}<div className="admin-page-list">{products.length === 0 ? <div className="empty-admin">No products yet. Add your first real product above.</div> : products.map(p => <div className="admin-product" key={p.id}><img src={p.image} alt=""/><span><strong>{p.name}</strong><small>{p.category}</small></span><b>₦{p.price}</b><em>Active</em><button className="edit-product" onClick={() => startEdit(p)}>Edit</button><button className="delete-product" onClick={() => remove(p.id)}>Delete</button></div>)}</div></main>
}

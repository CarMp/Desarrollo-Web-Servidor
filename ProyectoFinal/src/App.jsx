import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [monedas, setMonedas] = useState([])
  const [form, setForm] = useState({ origen: '', destino: '', valor: '' })
  const [editId, setEditId] = useState(null)

  // Obtener todas las monedas
  const fetchMonedas = () => {
    fetch('http://localhost:3000/monedas')
      .then(res => res.json())
      .then(data => setMonedas(data))
  }

  useEffect(() => {
    fetchMonedas()
  }, [])

  // Crear o actualizar moneda
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId === null) {
      // Crear
      fetch('http://localhost:3000/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(() => {
          setForm({ origen: '', destino: '', valor: '' })
          fetchMonedas()
        })
    } else {
      // Actualizar
      fetch(`http://localhost:3000/actualizar/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(() => {
          setForm({ origen: '', destino: '', valor: '' })
          setEditId(null)
          fetchMonedas()
        })
    }
  }

  // Eliminar moneda
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/eliminar/${id}`, { method: 'DELETE' })
      .then(() => fetchMonedas())
  }

  // Editar moneda
  const handleEdit = (moneda) => {
    setForm({ origen: moneda.origen, destino: moneda.destino, valor: moneda.valor })
    setEditId(moneda.id)
  }

  return (
    <>
      <h1>Información de monedas</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Origen"
          value={form.origen}
          onChange={e => setForm({ ...form, origen: e.target.value })}
          required
        />
        <input
          placeholder="Destino"
          value={form.destino}
          onChange={e => setForm({ ...form, destino: e.target.value })}
          required
        />
        <input
          placeholder="Valor"
          type="number"
          value={form.valor}
          onChange={e => setForm({ ...form, valor: e.target.value })}
          required
        />
        <button type="submit">{editId === null ? 'Crear' : 'Actualizar'}</button>
        {editId !== null && <button type="button" onClick={() => { setEditId(null); setForm({ origen: '', destino: '', valor: '' }) }}>Cancelar</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {monedas.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.origen}</td>
              <td>{item.destino}</td>
              <td>{item.valor}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App

import { useState, useEffect } from 'react';
import { API_URL, getAuthHeader } from '../api';

interface Item {
  id: number;
  title: string;
  description: string;
  owner_id: number;
}

export default function Dashboard({ logout }: { logout: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch items when Dashboard loads
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items/`, {
      headers: getAuthHeader(),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      fetchItems(); // Refresh table
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Items Dashboard</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>Logout</button>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
        <h3>Add New Item</h3>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ padding: '8px', flex: 1 }}
          />
          <input 
            type="text" 
            placeholder="Description (optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ padding: '8px', flex: 2 }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Add</button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#343a40', color: 'white' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{item.id}</td>
              <td style={{ padding: '12px' }}>{item.title}</td>
              <td style={{ padding: '12px' }}>{item.description || '-'}</td>
            </tr>
          ))}
          {items.length === 0 && (
             <tr>
               <td colSpan={3} style={{ padding: '12px', textAlign: 'center' }}>No items found. Create one above!</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/positions';

function App() {
  const [positions, setPositions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setPositions(response.data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const polyline = positions.map(p => [p.lat, p.lon]);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ width: '60%', height: '600px' }}>
        <MapContainer center={[8.74, 69.15]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', borderRadius: '20px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={polyline} color="blue" />
          {positions.map((pos, i) => (
            <Marker key={i} position={[pos.lat, pos.lon]} eventHandlers={{ click: () => setSelected(pos) }}>
              <Popup>
                <div>
                  <strong>Fix Time:</strong> {pos.fixTime}<br />
                  <strong>Obs Time:</strong> {pos.obsTime}<br />
                  <strong>ΔTime:</strong> {Math.round((new Date(pos.fixTime) - new Date(pos.obsTime)) / 60000)} min
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div style={{ width: '35%' }}>
        {selected ? (
          <div>
            <h2>Selected Point</h2>
            <p><strong>Latitude:</strong> {selected.lat}</p>
            <p><strong>Longitude:</strong> {selected.lon}</p>
            <p><strong>Fix Time:</strong> {selected.fixTime}</p>
            <p><strong>Obs Time:</strong> {selected.obsTime}</p>
            <p><strong>ΔTime:</strong> {Math.round((new Date(selected.fixTime) - new Date(selected.obsTime)) / 60000)} min</p>
          </div>
        ) : (
          <p>Select a marker on the map to see details.</p>
        )}
      </div>
    </div>
  );
}

export default App;

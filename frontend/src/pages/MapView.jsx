import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView() {

  const [locations, setLocations] = useState([]);

  useEffect(() => {

    const fetchSOS = async () => {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sos/history`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setLocations(data);

    };

    fetchSOS();

  }, []);

  return (

    <div className="card">

      <h2>Live SOS Map</h2>

      <MapContainer
        center={[10.0, 76.3]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((sos) => (

          <Marker
            key={sos._id}
            position={[sos.latitude, sos.longitude]}
          >

            <Popup>

              SOS Alert <br/>

              {new Date(sos.time).toLocaleString()} <br/>

              <a href={sos.mapsLink} target="_blank">
                Open Location
              </a>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  );

}

export default MapView;
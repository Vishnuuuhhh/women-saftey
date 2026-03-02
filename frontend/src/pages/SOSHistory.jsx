import { useEffect, useState } from "react";

function SOSHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "${import.meta.env.VITE_API_URL}/api/sos/history",
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setHistory(data);

    };

    fetchHistory();

  }, []);

  return (

    <div className="card">

      <h2>SOS History</h2>

      {history.length === 0 &&
        <p>No SOS history</p>
      }

      {history.map((item) => (

        <div key={item._id} className="contact-item">

          <p>
            {new Date(item.time).toLocaleString()}
          </p>

          <p>Status: {item.status}</p>

          <a
            href={item.mapsLink}
            target="_blank"
          >
            View Location
          </a>

        </div>

      ))}

    </div>

  );

}

export default SOSHistory;

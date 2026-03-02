import { useNavigate } from "react-router-dom";
import SOSButton from "./components/SOSButton";
import Contacts from "./components/Contacts";

function Home() {

  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const handleLogout = () => {

    localStorage.clear();
    navigate("/login");

  };

  const goToHistory = () => {

    navigate("/history");

  };

  const goToLiveMap = () => {

    navigate("/map");

  };

  return (

    <div className="app-wrapper">

      <div className="app-container">

        {/* Header */}
        <div className="top-bar">

          <h1 className="welcome-text">
            Welcome, {name}
          </h1>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* SOS Button Card */}
        <div className="card">

          <SOSButton />

        </div>


        {/* Actions Card */}
        <div className="card">

          <button
            className="primary-button"
            onClick={goToHistory}
          >
            View SOS History
          </button>

          <button
            className="primary-button"
            onClick={goToLiveMap}
            style={{ marginTop: "10px" }}
          >
            View Live Map
          </button>

        </div>


        {/* Contacts Card */}
        <div className="card">

          <Contacts />

        </div>


      </div>

    </div>

  );

}

export default Home;

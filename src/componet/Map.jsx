import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import "../CSS/MapHolder.css";

import {
  searchLocationAPI,
  fetchHospitalsAPI,
  fetchBloodBanksAPI
} from "../Connection/locationSearch";

import location_logo from "../assets/round-location.png";
import loading_icon from "../assets/location.mp4";

/* ---------- Marker Icons ---------- */

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const bloodIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});


/* ---------- Map Pan Component ---------- */

const PanMap = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 13);
    }
  }, [target, map]);

  return null;
};


/* ---------- Main Component ---------- */

const Map = () => {

  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [targetLocation, setTargetLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const reSetState = () => {
    setSearchResults([]);
    setHospitals([]);
    setBloodBanks([]);
    setTargetLocation(location);
  };

  /* ---------- Get User Location ---------- */

  const handleGetLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const coords = { lat, lng };

        setLocation(coords);
        setTargetLocation(coords);

        // const hospitalsData = await fetchHospitalsAPI(lat, lng);
        // const bloodData = await fetchBloodBanksAPI(lat, lng);

        // setHospitals(hospitalsData);
        // setBloodBanks(bloodData);

      },

      () => alert("Unable to fetch location")

    );
  };



  useEffect(() => {
    handleGetLocation();
  }, []);



  /* ---------- Search ---------- */

  const handleSearch = async () => {

    console.log(!searchText.trim());

    if (!searchText.trim()) {
      reSetState();
      return;
    }

    setLoading(true);

    const results = await searchLocationAPI(searchText);

    if (results.length === 0) {
      setLoading(false);
      return;
    }

    const center = results[0];

    setSearchResults(results);
    setTargetLocation(center);

    const hospitalsData = await fetchHospitalsAPI(center.lat, center.lng);
    const bloodData = await fetchBloodBanksAPI(center.lat, center.lng);

    setHospitals(hospitalsData);
    setBloodBanks(bloodData);

    setLoading(false);
  };



  /* ---------- Loading Screen ---------- */

  if (!location) {
    return (
      <div className="loading">
        <video src={loading_icon} autoPlay loop muted playsInline />
        <p>Loading Map...</p>
      </div>
    );
  }



  /* ---------- Render ---------- */

  return (

    <div className="map-display">

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        className="leaflet-map"
      >

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <PanMap target={targetLocation} />

        <MarkerClusterGroup>

          <Marker position={[location.lat, location.lng]} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>


          {searchResults.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>{loc.displayName}</Popup>
            </Marker>
          ))}


          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              position={[hospital.lat, hospital.lng]}
              icon={hospitalIcon}
            >
              <Popup>🏥 {hospital.name}</Popup>
            </Marker>
          ))}


          {bloodBanks.map((bank, index) => (
            <Marker
              key={index}
              position={[bank.lat, bank.lng]}
              icon={bloodIcon}
            >
              <Popup>🩸 {bank.name}</Popup>
            </Marker>
          ))}

        </MarkerClusterGroup>

      </MapContainer>



      {/* Search */}

      <div className="map-controls">

        <input
          type="text"
          placeholder="Search city, hospital, area..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </button>

      </div>



      {/* Location Button */}

      <div className="location-btn">

        <button onClick={handleGetLocation}>
          <img src={location_logo} alt="Locate" />
        </button>

      </div>

    </div>
  );
};

export default Map;
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import arrow from "./images/icon-arrow.svg";
import ChangeView from "./Changeview";
import axios from "axios";

function App() {
  const [position, setPostion] = useState([12, 0.2]);
  const ip = useRef("");
  const [num, setNum] = useState("102.89.47.24");
  const [ipAddress, setIpAddress] = useState("102.89.47.24");
  const [location, setLocation] = useState(", ZZ");
  const [timezone, setTimezone] = useState("GMT");
  const [isp, setIsp] = useState("");

  const handleClick = () => {
    setNum(ip.current.value);
  };

  useEffect(() => {
    axios("https://api.ipify.org/").then((response) => {
      setNum(response.data);
    });
  }, []);

  useEffect(() => {
    async function getData() {
      await axios(
        `https://api.ipgeolocation.io/ipgeo?apiKey=91fa12e914df4bf9924a98d4c6c41014&ip=${num}`
      ).then((response) => {
        setIpAddress(num);
        setLocation(`${response.data.city}, ${response.data.country_name}`);
        setTimezone(`GMT+${response.data.time_zone.offset}`);
        setIsp(`${response.data.organization}`);
        setPostion([response.data.latitude, response.data.longitude]);
      });
    }

    getData();
  }, [num]);

  return (
    <div id="total">
      <div id="top">
        <h1>IP Address Tracker</h1>
        <div id="search">
          <input ref={ip} placeholder={num}></input>
          <button onClick={handleClick}>
            <img src={arrow} alt="send" />
          </button>
        </div>
      </div>

      <div id="details">
        <div className="single">
          <p>IP ADDRESS</p>
          <h2>{ipAddress}</h2>
        </div>
        <div className="single">
          <p>LOCATION</p>
          <h2>{location}</h2>
        </div>
        <div className="single">
          <p>TIMEZONE</p>
          <h2>{timezone}</h2>
        </div>
        <div className="single">
          <p>ISP</p>
          <h2>{isp}</h2>
        </div>
      </div>

      <MapContainer
        id="map"
        center={position}
        zoom={15}
        scrollWheelZoom={false}
      >
        <ChangeView center={position} />
        <TileLayer
          id="title"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker id="marker" position={position}>
          <Popup>Gradually understanding this Leaflet map thing.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;

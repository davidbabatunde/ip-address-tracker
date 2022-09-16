import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import arrow from "./images/icon-arrow.svg";
import ChangeView from "./Changeview";
import axios from "axios";

function App() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const ip = useRef(position);
  const [num, setNum] = useState("0.0.0.0");
  const [ipAddress, setIpAddress] = useState("0.0.0.0");
  const [location, setLocation] = useState(", ZZ");
  const [timezone, setTimezone] = useState("GMT");
  const [isp, setIsp] = useState("");

  const handleClick = () => {
    setPosition(ip.current.value.split(","));
  };

  useEffect(() => {
    axios("https://api.ipify.org/").then((response) => {
      setNum(response.data);
    });
  });

  useEffect(() => {
    getData();
  });

  async function getData() {
    await axios(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_2musotM1QpwgZRVcySUh6qZPv7Or2&ipAddress=${num}`
    ).then((response) => {
      setIpAddress(`${response.data.ip}`);
      setLocation(
        `${response.data.location.city}, ${response.data.location.country}`
      );
      setTimezone(`GMT${response.data.location.timezone}`);
      setIsp(`${response.data.isp}`);
    });
  }

  return (
    <div id="total">
      <h1>IP Address Tracker</h1>
      <div id="search">
        <input ref={ip} placeholder={position}></input>
        <button onClick={handleClick}>
          <img src={arrow} alt="send" />
        </button>
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
        zoom={13}
        scrollWheelZoom={false}
      >
        <ChangeView center={position} />
        <TileLayer
          id="title"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker id="marker" position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;

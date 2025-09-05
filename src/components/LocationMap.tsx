import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  lat: number;
  lon: number;
  name: string;
  address: string;
}

export default function LocationMap({
  lat,
  lon,
  name,
  address,
}: LocationMapProps) {
  if (typeof lat !== "number" || typeof lon !== "number") {
    return <div>There are no coordinations for the location.</div>;
  }

  const position: L.LatLngExpression = [lat, lon];

  return (
    <MapContainer
      className="z-0"
      center={position}
      zoom={35}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <b>{name}</b>
          <br />
          {address}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

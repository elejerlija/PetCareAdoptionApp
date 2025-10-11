import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerImg from '../assets/images/blue-marker.svg';

const svgIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#83bac9" d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>`,
  className: '', 
  iconSize: [60, 60],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function MapWeb() {
  return (
    <MapContainer
      center={[42.6629, 21.1655]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[42.66113710667629, 21.164697424961172]} icon={svgIcon}>
        <Popup>Pet Store Prishtina</Popup>
      </Marker>
      <Marker position={[42.4689406630234, 21.475182515134378]} icon={svgIcon}>
        <Popup>Pet Store Gjilan</Popup>
      </Marker>
    </MapContainer>
  );
}

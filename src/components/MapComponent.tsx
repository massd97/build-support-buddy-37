/**
 * MapComponent
 * 
 * This component handles the Google Maps integration, including the map display
 * and markers for site locations. It provides an interactive way to visualize
 * and manage site locations.
 * 
 * @param {Object} mapCenter - The center coordinates for the map
 * @param {number} zoom - The zoom level of the map
 * @param {Array} sites - Array of site objects containing location data
 * @param {function} onMapLoad - Callback function when map loads
 * @param {function} handleMarkerClick - Function to handle marker clicks
 */
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { toast } from "sonner";

interface Site {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  soilAmount: string;
  soilType: string;
}

interface MapComponentProps {
  mapCenter: { lat: number; lng: number };
  zoom: number;
  sites: Site[];
  onMapLoad: (map: google.maps.Map) => void;
  handleMarkerClick: (site: Site) => void;
}

const MapComponent = ({
  mapCenter,
  zoom,
  sites,
  onMapLoad,
  handleMarkerClick,
}: MapComponentProps) => {
  // Custom map styles to enhance visual appearance
  const mapStyles = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#e1e9ef" }],
    },
  ];

  return (
    <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden shadow-lg">
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={mapCenter}
          zoom={zoom}
          onLoad={onMapLoad}
          options={{
            styles: mapStyles,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {sites.map((site) => (
            <Marker
              key={site.id}
              position={{ lat: site.lat, lng: site.lng }}
              onClick={() => handleMarkerClick(site)}
              title={site.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
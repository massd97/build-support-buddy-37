import React,  { useState, useRef, useContext } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from "sonner";
import { Site } from '@/types/site';
import SiteInfoWindow from './SiteInfoWindow';
import { ApiKeyContext } from '../contexts/ApiKeyContext';

interface MapComponentProps {
  sites: Site[];
}

const MapComponent = ({ sites }: MapComponentProps) => {
  const apiKey = useContext(ApiKeyContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const center = { lat: 35.6762, lng: 139.6503 }; // Tokyo center
  const mapContainerStyle = {
    width: '100%',
    height: '800px'
  };

  const handleMapLoad = (map: google.maps.Map) => {
    console.log('Map loaded');
    mapRef.current = map;
    setMapLoaded(true);
  };

  const getMarkerIcon = (site: Site) => ({
    path: window.google?.maps.SymbolPath.CIRCLE,
    fillColor: site.siteType === "客土" ? "#ef4444" : "#3b82f6",
    fillOpacity: 1,
    strokeWeight: 5,
    strokeColor: {
      OHD: "#22c55e",
      Meldia: "#a855f7",
      HawkOne: "yellow",
    }[site.company],
    scale: 15,
  });

  const handleMarkerClick = (site: Site) => {
    console.log('Marker clicked:', site);
    // Convert latitude and longitude to numbers
    const position = {
      lat: typeof site.lat === 'string' ? parseFloat(site.lat) : site.lat,
      lng: typeof site.lng === 'string' ? parseFloat(site.lng) : site.lng
    };

    setSelectedSite({
      ...site,
      lat: position.lat,
      lng: position.lng
    });
    setSelectedMarkerId(site.id);
    toast.info(`${site.siteName} - ${site.siteType}`);
  };

  console.log('Selected site:', selectedSite);
  console.log('Selected marker ID:', selectedMarkerId);

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      onLoad={() => {
        console.log('Script loaded');
        setMapLoaded(true);
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={11}
        onLoad={handleMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {mapLoaded && sites.map((site) => (
          <Marker
            key={site.id}
            position={{ 
              lat: typeof site.lat === 'string' ? parseFloat(site.lat) : site.lat,
              lng: typeof site.lng === 'string' ? parseFloat(site.lng) : site.lng
            }}
            onClick={() => handleMarkerClick(site)}
            icon={getMarkerIcon(site)}
          />
        ))}

        {selectedMarkerId && selectedSite && (
          <InfoWindow
            position={{ 
              lat: typeof selectedSite.lat === 'string' ? parseFloat(selectedSite.lat) : selectedSite.lat,
              lng: typeof selectedSite.lng === 'string' ? parseFloat(selectedSite.lng) : selectedSite.lng
            }}
            onCloseClick={() => {
              setSelectedMarkerId(null);
              setSelectedSite(null);
            }}
          >
            <SiteInfoWindow site={selectedSite} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
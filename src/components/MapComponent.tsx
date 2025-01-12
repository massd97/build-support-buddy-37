import  { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from "sonner";
import { Site } from '@/types/site';
import SiteInfoWindow from './SiteInfoWindow';
import { useIsMobile } from '@/hooks/use-mobile';

interface MapComponentProps {
  sites: Site[];
}

const MapComponent = ({ sites }: MapComponentProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMobile = useIsMobile();
  
  const center = { lat: 35.6762, lng: 139.6503 }; // Tokyo center
  const mapContainerStyle = {
    width: '100%',
    height: isMobile ? '600px' : '800px'
  };

  const handleMapLoad = (map: google.maps.Map) => {
    console.log('Map loaded');
    mapRef.current = map;
    setMapLoaded(true);
    
    if (isMobile) {
      map.setZoom(13);
    } else {
      map.setZoom(11);
    }
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
    
    const position = {
      lat: typeof site.lat === 'string' ? parseFloat(site.lat) : site.lat,
      lng: typeof site.lng === 'string' ? parseFloat(site.lng) : site.lng
    };

    console.log('Setting selected site with position:', position);
    setSelectedSite({
      ...site,
      lat: position.lat,
      lng: position.lng
    });
    
    console.log('Setting selected marker ID:', site.ID);
    setSelectedMarkerId(site.ID);

    if (isMobile && mapRef.current) {
      console.log('Panning to position:', position);
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(15);
    }else{
      console.log('Panning to position:', position);
      mapRef.current?.panTo(position);
    }
    
    toast.info(`${site.siteName} - ${site.siteType}`);
  };

  console.log('Current selected site:', selectedSite);
  console.log('Current selected marker ID:', selectedMarkerId);

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
        zoom={isMobile ? 13 : 11}
        onLoad={handleMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative', // Changed from 'greedy' to 'cooperative'
        }}
      >
        {mapLoaded && sites.map((site) => (
          <Marker
            key={site.ID}
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
              console.log('InfoWindow closing');
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
/**
 * MapSearch Component
 * 
 * This component handles the map search functionality, including the search input
 * and search execution button. It's responsive and adapts to different screen sizes.
 * 
 * @param {string} mapSearch - Current search query
 * @param {function} setMapSearch - Function to update search query
 * @param {function} handleMapSearch - Function to execute the search
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MapSearchProps {
  mapSearch: string;
  setMapSearch: (search: string) => void;
  handleMapSearch: () => void;
}

const MapSearch = ({ mapSearch, setMapSearch, handleMapSearch }: MapSearchProps) => {
  console.log(mapSearch);
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center max-w-xl mx-auto">
      <Input
        type="text"
        placeholder="地図を検索 (住所、現場名、担当者名、土地の量、土質)"
        value={mapSearch}
        onChange={(e) => setMapSearch(e.target.value)}
        className="w-full sm:rounded-r-none"
        onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
      />
      <Button
        onClick={handleMapSearch}
        className="w-full sm:w-auto sm:rounded-l-none"
      >
        検索
      </Button>
    </div>
  );
};

export default MapSearch;
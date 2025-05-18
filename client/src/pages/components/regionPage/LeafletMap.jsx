import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { useEffect, useMemo, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";


// Fix for default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Custom marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom hook for responsive map behavior
function useMapResponsive() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

// Helper function to get region descriptions
function getRegionDescription(regionId) {
  const descriptions = {
    africa:
      "A continent with diverse cultures, landscapes ranging from deserts to rainforests, and rich wildlife.",
    americas:
      "Spans North and South America with varied climates, from Arctic tundra to tropical rainforests.",
    asia: "The largest continent, home to diverse cultures, ancient civilizations, and varied landscapes.",
    europe:
      "Known for its historical landmarks, diverse cultures, and influential art and architecture.",
    oceania:
      "A region of island nations and Australia, known for unique wildlife and stunning natural beauty.",
  };
  return descriptions[regionId] || "Explore this fascinating region in detail.";
}

// Component for region search dropdown
const RegionSearch = ({ regions, onRegionSelect, selectedRegion }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-10 w-64">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
        >
          <span className="font-medium">
            {selectedRegion ? selectedRegion.name : "Select a region"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-gray-700"
          >
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onRegionSelect(region);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedRegion && selectedRegion.id === region.id
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {region.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const RegionInfoPanel = ({ region, onClose, onRegionSelect, scrollToDetail }) => {
  if (!region) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs w-full"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {region.name}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {getRegionDescription(region.id)}
      </p>
      <button
        onClick={() => {
          onRegionSelect(region);
          scrollToDetail();
        }}
        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
      >
        Explore {region.name}
      </button>
    </motion.div>
  );
};

const ModernLeafletMap = ({
  regions,
  onRegionSelect,
  selectedRegion,
  scrollToDetail,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(!!selectedRegion);

  // More detailed sample GeoJSON data for regions
  const geoJsonData = useMemo(
    () => ({
      type: "FeatureCollection",
      features: regions.map((region) => ({
        type: "Feature",
        properties: {
          regionId: region.id,
          name: region.name,
        },
        geometry: getRegionGeometry(region.id),
      })),
    }),
    [regions]
  );

  useEffect(() => {
    if (selectedRegion) {
      setShowInfoPanel(true);
    }
  }, [selectedRegion]);

  function getRegionGeometry(regionId) {
    // More realistic simplified geometries
    const geometries = {
      africa: {
        type: "Polygon",
        coordinates: [
          [
            [-18, 38],
            [52, 38],
            [52, -35],
            [12, -35],
            [-18, 5],
            [-18, 38],
          ],
        ],
      },
      americas: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              // North America
              [-170, 72],
              [-52, 72],
              [-52, 14],
              [-116, 14],
              [-170, 60],
              [-170, 72],
            ],
          ],
          [
            [
              // South America
              [-82, 13],
              [-34, 13],
              [-34, -56],
              [-82, -56],
              [-82, 13],
            ],
          ],
        ],
      },
      asia: {
        type: "Polygon",
        coordinates: [
          [
            [26, 81],
            [180, 81],
            [180, -12],
            [95, -12],
            [26, 40],
            [26, 81],
          ],
        ],
      },
      europe: {
        type: "Polygon",
        coordinates: [
          [
            [-25, 71],
            [60, 71],
            [60, 34],
            [26, 34],
            [-10, 35],
            [-25, 45],
            [-25, 71],
          ],
        ],
      },
      oceania: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              // Australia
              [113, -10],
              [154, -10],
              [154, -39],
              [113, -39],
              [113, -10],
            ],
          ],
          [
            [
              // New Zealand
              [166, -34],
              [179, -34],
              [179, -48],
              [166, -48],
              [166, -34],
            ],
          ],
        ],
      },
    };
    return geometries[regionId] || null;
  }

  const regionStyle = useCallback((feature) => {
    const isSelected =
      selectedRegion && feature.properties.regionId === selectedRegion.id;
    const isHovered =
      hoveredRegion &&
      feature.properties.regionId === hoveredRegion.properties.regionId;

    return {
      fillColor: isSelected ? "#4f46e5" : isHovered ? "#818cf8" : "#e2e8f0",
      weight: isSelected ? 2 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? "#312e81" : isHovered ? "#4f46e5" : "#ffffff",
      fillOpacity: isSelected ? 0.7 : isHovered ? 0.6 : 0.5,
      dashArray: isSelected ? "" : isHovered ? "" : "3",
    };
  }, [selectedRegion, hoveredRegion]);

  const onEachFeature = useCallback((feature, layer) => {
    // Use Leaflet's native tooltip for better performance
    layer.bindTooltip(feature.properties.name, {
      permanent: false,
      direction: "top",
      className: "leaflet-tooltip-custom",
      offset: [0, -5]
    });

    const handleMouseOver = debounce((e) => {
      setHoveredRegion(feature);
      e.target.setStyle({
        weight: 3,
        color: "#4f46e5",
        fillOpacity: 0.7,
        dashArray: "",
      });
      e.target.bringToFront();

      // Update cursor to pointer
      const container = e.target._map.getContainer();
      container.style.cursor = "pointer";
    }, 50);

    const handleMouseOut = debounce((e) => {
      setHoveredRegion(null);
      e.target.setStyle(regionStyle(feature));

      // Reset cursor
      const container = e.target._map.getContainer();
      container.style.cursor = "";
    }, 50);

    const handleClick = () => {
      const region = regions.find(
        (r) => r.id === feature.properties.regionId
      );
      if (region) {
        onRegionSelect(region);
        setShowInfoPanel(true);
      }
    };

    layer.on({
      mouseover: handleMouseOver,
      mouseout: handleMouseOut,
      click: handleClick,
    });

    return () => {
      layer.off({
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleClick,
      });
    };
  }, [regions, onRegionSelect, regionStyle]);

  // Center map on selected region
  const MapEffect = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedRegion && mapReady) {
        const feature = geoJsonData.features.find(
          (f) => f.properties.regionId === selectedRegion.id
        );
        if (feature) {
          const bounds = L.geoJSON(feature).getBounds();
          map.flyToBounds(bounds, {
            padding: [50, 50],
            duration: 1.5,
            easeLinearity: 0.25,
          });
        }
      }
    }, [selectedRegion, map, mapReady]);

    useMapResponsive();
    return null;
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <div className="relative h-0 pb-[60%] sm:pb-[50%] md:pb-[45%] lg:pb-[40%]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Loading map...
                </p>
              </div>
            </div>
          )}

          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="absolute inset-0 z-0"
            whenCreated={() => {
              setIsLoading(false);
              setMapReady(true);
            }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeoJSON
              key={selectedRegion?.id || 'all-regions'}
              data={geoJsonData}
              style={regionStyle}
              onEachFeature={onEachFeature}
            />

            <ZoomControl position="bottomright" />
            <MapEffect />
          </MapContainer>
        </div>
      </motion.div>

      {/* Region search dropdown */}
      <RegionSearch
        regions={regions}
        onRegionSelect={onRegionSelect}
        selectedRegion={selectedRegion}
      />

      {/* Attribution strip */}
      <div className="absolute bottom-0 right-0 z-10 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 rounded-tl-md">
        © OpenStreetMap | CARTO
      </div>

      {/* Info panel for selected region */}
      {selectedRegion && showInfoPanel && (
        <RegionInfoPanel
          region={selectedRegion}
          onClose={() => setShowInfoPanel(false)}
          onRegionSelect={onRegionSelect}
          scrollToDetail={scrollToDetail}
        />
      )}

      {/* Reset view button */}
      {selectedRegion && (
        <button
          onClick={() => {
            onRegionSelect(null);
            setShowInfoPanel(false);
          }}
          className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 dark:text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
      )}
    </div>
  );
};

export default ModernLeafletMap;

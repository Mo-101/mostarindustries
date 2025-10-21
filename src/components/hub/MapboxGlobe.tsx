import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AINode } from '@/types/ai-hub';

interface MapboxGlobeProps {
  aiNodes: AINode[];
}

const MapboxGlobe: React.FC<MapboxGlobeProps> = ({ aiNodes }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with user's custom style
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2x4czNxbjU2MWM2eTJqc2gwNGIwaWhkMSJ9.jSwZdyaPa1dOHepNU5P71g';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/akanimo1/cld9kmj9k004201qotgjwx52l',
      projection: { name: 'globe' },
      zoom: 1.5,
      center: [30, 15],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      map.current.setFog({
        color: 'rgb(0, 10, 25)',
        'high-color': 'rgb(0, 10, 25)',
        'horizon-blend': 0.3,
        'space-color': 'rgb(0, 10, 25)',
        'star-intensity': 0.9
      });

      // Add markers for AI nodes
      aiNodes.forEach((node) => {
        if (!map.current) return;
        
        // Generate random coordinates based on location (simplified)
        const coords = getCoordinatesForLocation(node.location);
        
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'w-3 h-3 rounded-full animate-pulse';
        el.style.backgroundColor = node.status === 'Active' ? '#00ff80' : '#ff00ff';
        el.style.boxShadow = `0 0 10px ${node.status === 'Active' ? '#00ff80' : '#ff00ff'}`;

        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="color: #fff; background: rgba(0,0,0,0.9); padding: 8px; border-radius: 4px; border: 1px solid #00ff80;">
                  <strong style="color: #00ff80;">${node.name}</strong><br/>
                  <span style="font-size: 11px;">Status: ${node.status}</span><br/>
                  <span style="font-size: 11px;">Performance: ${node.performance}%</span>
                </div>
              `)
          )
          .addTo(map.current);
      });
    });

    // Rotation animation settings
    const secondsPerRevolution = 180;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Start the globe spinning
    spinGlobe();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [aiNodes]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20 rounded-lg" />
    </div>
  );
};

// Helper function to generate coordinates based on location name
function getCoordinatesForLocation(location: string): [number, number] {
  const locationMap: { [key: string]: [number, number] } = {
    'US-East': [-77, 39],
    'EU-West': [2, 48],
    'Asia-Pacific': [139, 35],
    'US-West': [-122, 37],
    'EU-Central': [13, 52],
    'South America': [-47, -23],
    'Africa': [18, -33],
    'Middle East': [51, 25],
    'Australia': [151, -33],
    'Canada': [-79, 43],
  };

  return locationMap[location] || [0, 0];
}

export default MapboxGlobe;

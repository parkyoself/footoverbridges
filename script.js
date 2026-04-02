// Initialize map (fixed center)
const map = L.map('map', {
  zoomControl: false
}).setView([17.46306, 78.38523], 12);

// Zoom controls top-right
L.control.zoom({
  position: 'topright'
}).addTo(map);

// Dark basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Load GeoJSON
fetch('walkways.geojson')
  .then(res => res.json())
  .then(data => {

    console.log("GeoJSON loaded:", data); // DEBUG

    // Update counter
    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    // Add GeoJSON layer
    const geoLayer = L.geoJSON(data, {

      // Force points to render as visible circles
      pointToLayer: function (feature, latlng) {
        console.log("Feature:", feature); // DEBUG

        return L.circleMarker(latlng, {
          radius: 8,
          color: "#22c55e",
          fillColor: "#22c55e",
          fillOpacity: 1
        });
      },

      // Popup
      onEachFeature: function (feature, layer) {
        const p = feature.properties;

        const name = p?.Name || "Unnamed";

        layer.bindPopup(`<strong>${name}</strong>`);
      }

    }).addTo(map);

    // DEBUG: check bounds
    console.log("Bounds:", geoLayer.getBounds());

  })
  .catch(err => console.error("GeoJSON load error:", err));

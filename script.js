// Initialize map
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

    // Counter
    const count = data.features?.length || 0;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    // Add GeoJSON
    L.geoJSON(data, {

      // Marker color based on lift
      pointToLayer: function (feature, latlng) {
        const p = feature.properties || {};

        const liftWorking = p.LiftEscalator_working === true;
        const color = liftWorking ? "#22c55e" : "#ef4444";

        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        });
      },

      // Popup
      onEachFeature: function (feature, layer) {
        const p = feature.properties || {};

        const name = p.Name || "Unnamed";
        const lift = p.LiftEscalator_working === true
          ? "Working"
          : "Not working";

        const lighting = p.Well_lit === true
          ? "Well lit"
          : "Poor lighting";

        const video =
          p.Video_link ||
          p["Video link"] ||
          null;

        const content = `
          <div>
            <strong>${name}</strong><br/>
            Lift/Escalator: ${lift}<br/>
            Lighting: ${lighting}<br/>
            ${video ? `<a href="${video}" target="_blank">Watch video</a>` : "No video"}
          </div>
        `;

        layer.bindPopup(content);
      }

    }).addTo(map);

  })
  .catch(err => console.error("GeoJSON load error:", err));

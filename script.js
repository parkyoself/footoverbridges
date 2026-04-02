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

    // Counter
    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    // Add GeoJSON layer
    L.geoJSON(data, {

      // Style markers based on lift working
      pointToLayer: function (feature, latlng) {
        const liftWorking = feature.properties?.LiftEscalator_working;

        const color = liftWorking ? "#22c55e" : "#ef4444";

        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        });
      },

      // Popup content
      onEachFeature: function (feature, layer) {
        const p = feature.properties;

        const name = p?.Name || "Unnamed";
        const lift = p?.LiftEscalator_working ? "Working" : "Not working";
        const lighting = p?.Well_lit ? "Well lit" : "Poor lighting";

        const busStop =
          p?.Nearest_Bus_Stop_Location ||
          p?.["Nearest Bus Stop Location"] ||
          "Not available";

        const video =
          p?.Video_link ||
          p?.["Video link"];

        const videoHTML = video
          ? `<a href="${video}" target="_blank">Watch video</a>`
          : "No video";

        const content = `
          <div>
            <strong>${name}</strong><br/>
            Lift/Escalator: ${lift}<br/>
            Lighting: ${lighting}<br/>
            Bus stop: ${busStop}<br/>
            ${videoHTML}
          </div>
        `;

        layer.bindPopup(content);
      }

    }).addTo(map);

  })
  .catch(err => console.error("GeoJSON load error:", err));

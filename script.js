// Initialize map with fixed center
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
fetch('data.geojson')
  .then(res => res.json())
  .then(data => {

    // Fix: convert "Location" → geometry if needed
    data.features.forEach(feature => {
      if (!feature.geometry && feature.properties?.Location) {
        const [lat, lng] = feature.properties.Location.split(',').map(Number);

        feature.geometry = {
          type: "Point",
          coordinates: [lng, lat]
        };
      }
    });

    // Counter
    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    // Add GeoJSON
    L.geoJSON(data, {

      pointToLayer: function (feature, latlng) {
        const p = feature.properties;

        const lift = p?.LiftEscalator_working;
        const lit = p?.Well_lit;

        let color = "#ef4444";
        if (lift && lit) color = "#22c55e";
        else if (lift || lit) color = "#f59e0b";

        return L.circleMarker(latlng, {
          radius: 7,
          color: color,
          fillColor: color,
          fillOpacity: 0.9
        });
      },

      onEachFeature: function (feature, layer) {
        const p = feature.properties;

        const name = p?.Name || "Unnamed";
        const lift = p?.LiftEscalator_working ? "Working" : "Not working";
        const lighting = p?.Well_lit ? "Well lit" : "Poor lighting";

        const video =
          p?.Video_link ||
          p?.["Video link"] ||
          null;

        const videoHTML = video
          ? `<a href="${video}" target="_blank">Watch video</a>`
          : "No video";

        const content = `
          <div>
            <strong>${name}</strong><br/>
            Lift/Escalator: ${lift}<br/>
            Lighting: ${lighting}<br/>
            ${videoHTML}
          </div>
        `;

        layer.bindPopup(content);
      }

    }).addTo(map);

  })
  .catch(err => console.error("GeoJSON load error:", err));

// Initialize map (no fixed center needed)
const map = L.map('map', {
  zoomControl: false
});

// Add zoom control to top-right
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

    // Counter
    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    // Create GeoJSON layer
    const geoLayer = L.geoJSON(data, {

      pointToLayer: function (feature, latlng) {
        const props = feature.properties;

        const liftWorking = props?.LiftEscalator_working;
        const wellLit = props?.Well_lit;

        let color = "#ef4444";

        if (liftWorking && wellLit) {
          color = "#22c55e";
        } else if (liftWorking || wellLit) {
          color = "#f59e0b";
        }

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

    // ✅ Auto-fit map to all features
    map.fitBounds(geoLayer.getBounds(), {
      padding: [40, 40] // space around edges
    });

  })
  .catch(err => console.error("GeoJSON load error:", err));

// Initialize map
const map = L.map('map', {
  zoomControl: false
}).setView([17.46306, 78.38523], 12);

// Zoom controls
L.control.zoom({ position: 'topright' }).addTo(map);

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

    L.geoJSON(data, {

      pointToLayer: function (feature, latlng) {
        const p = feature.properties || {};

        // 🔥 Handle your actual data format
        const liftRaw =
          p["Lift/Escalator working?"] ??
          p.LiftEscalator_working;

        // Normalize values ("Yes"/"No"/true/false)
        const liftWorking =
          liftRaw === true ||
          liftRaw === "Yes" ||
          liftRaw === "yes";

        const color = liftWorking ? "#22c55e" : "#ef4444";

        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        });
      },

      onEachFeature: function (feature, layer) {
        const p = feature.properties || {};

        const name = p.Name || "Unnamed";

        const liftRaw =
          p["Lift/Escalator working?"] ??
          p.LiftEscalator_working;

        const lift =
          (liftRaw === true || liftRaw === "Yes" || liftRaw === "yes")
            ? "Working"
            : "Not working";

        const lightingRaw =
          p["Well lit?"] ??
          p.Well_lit;

        const lighting =
          (lightingRaw === true || lightingRaw === "Yes" || lightingRaw === "yes")
            ? "Well lit"
            : "Poor lighting";

        const video =
          p["Video link"] ||
          p.Video_link ||
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

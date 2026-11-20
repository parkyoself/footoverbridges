// onclick handler for audit button
document.getElementById("auditButton").addEventListener("click", function () {
  // redirect to kobo audit page
  window.location.href = "https://ee.kobotoolbox.org/x/ZPidMuMH";
});

// Initialize map
const map = L.map('map', {
  zoomControl: false
}).setView([17.46306, 78.38523], 12);

// Zoom controls top-right
L.control.zoom({
  position: 'topright'
}).addTo(map);

// Dark basemap
L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_5d42_1_91ca7d6cad11aa2cc49d1c97', {
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

      // Marker styling
      pointToLayer: function (feature, latlng) {
        const p = feature.properties || {};

        // Read and normalize lift value
        let liftRaw = p["Lift/Escalator working?"];
        liftRaw = String(liftRaw).toLowerCase().trim();

        let color = "#f59e0b"; // amber (unknown)

        if (liftRaw === "yes") {
          color = "#22c55e"; // green
        } else if (liftRaw === "no") {
          color = "#ef4444"; // red
        }

        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 1
        });
      },

      // Popup content
      onEachFeature: function (feature, layer) {
        const p = feature.properties || {};

        const name = p.Name || "Unnamed";

        // Lift status
        let liftRaw = p["Lift/Escalator working?"];
        liftRaw = String(liftRaw).toLowerCase().trim();

        const lift =
          liftRaw === "yes"
            ? "Working"
            : liftRaw === "no"
            ? "Not working"
            : "Unknown";

        // Lighting
        let lightRaw = p["Well lit?"];
        lightRaw = String(lightRaw).toLowerCase().trim();

        const lighting =
          lightRaw === "yes"
            ? "Well lit"
            : lightRaw === "no"
            ? "Poor lighting"
            : "Unknown";

        // Video
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

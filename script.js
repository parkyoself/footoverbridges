// Initialize map
const map = L.map('map').setView([17.3850, 78.4867], 12);

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

    // Update counter
    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

    L.geoJSON(data, {

      // Marker styling
      pointToLayer: function (feature, latlng) {
        const props = feature.properties;

        const liftWorking = props?.LiftEscalator_working;
        const wellLit = props?.Well_lit;

        let color = "#ef4444"; // red

        if (liftWorking && wellLit) {
          color = "#22c55e"; // green
        } else if (liftWorking || wellLit) {
          color = "#f59e0b"; // amber
        }

        return L.circleMarker(latlng, {
          radius: 7,
          color: color,
          fillColor: color,
          fillOpacity: 0.9
        });
      },

      // Popup content
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

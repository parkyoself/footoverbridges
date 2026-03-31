// Initialize map centered on Hyderabad
const map = L.map('map').setView([17.3850, 78.4867], 12);

// Dark basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors & CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Green circle marker
L.circleMarker([17.3850, 78.4867], {
  radius: 6,
  color: "#22c55e",
  fillColor: "#22c55e",
  fillOpacity: 0.9
})
.addTo(map)
.bindPopup("Hyderabad")
.openPopup();

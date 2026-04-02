fetch('walkways.geojson')
  .then(res => res.json())
  .then(data => {

    const count = data.features.length;
    document.getElementById("counter").textContent =
      `${count} walkway${count !== 1 ? "s" : ""} mapped`;

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
      }
    }).addTo(map);

  });

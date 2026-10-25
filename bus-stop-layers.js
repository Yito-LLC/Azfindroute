import { schools, busStops } from "./bus-stops.js";

const stopSourceId = "bus-stops";
const stopLayerId = "bus-stop-circles";
const schoolSourceId = "schools";
const schoolCircleLayerId = "school-circles";
const schoolLabelLayerId = "school-labels";

const locatedStops = busStops.filter(stop => stop.lon !== null && stop.lat !== null);
const unlocatedStops = busStops.filter(stop => stop.lon === null || stop.lat === null);

const colorBySchool = schools.reduce((colors, school) => {
    colors[school.name] = school.color;
    return colors;
}, {});

// ["match", ["get", "school"], "Corona del Sol", "#0f766e", ..., fallback]
const schoolColorExpression = [
    "match",
    ["get", "school"],
    ...schools.flatMap(school => [school.name, school.color]),
    "#555555"
];

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

function stopFeatures(stops) {
    return {
        type: "FeatureCollection",
        features: stops.map(stop => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [stop.lon, stop.lat] },
            properties: {
                school: stop.school,
                name: stop.name,
                detail: stop.detail ?? "",
                program: stop.program ?? "",
                approximate: stop.approximate === true,
                source: stop.source ?? "",
                runs: JSON.stringify(stop.runs)
            }
        }))
    };
}

function schoolFeatures() {
    return {
        type: "FeatureCollection",
        features: schools.map(school => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [school.lon, school.lat] },
            properties: {
                school: school.name,
                name: school.name,
                address: school.address
            }
        }))
    };
}

function popupHtml(properties) {
    const runs = JSON.parse(properties.runs || "[]");

    const rows = runs.map(run => `
        <tr>
            <th scope="row">${escapeHtml(run.route ?? "—")}</th>
            <td>${escapeHtml(run.am ?? "—")}</td>
            <td>${escapeHtml(run.pm ?? "—")}</td>
        </tr>
    `).join("");

    return `
        <div class="stop-popup">
            <p class="stop-popup-school" style="color:${colorBySchool[properties.school] ?? "#555"}">
                ${escapeHtml(properties.school)}
            </p>
            <h2>${escapeHtml(properties.name)}</h2>
            ${properties.detail ? `<p class="stop-popup-detail">${escapeHtml(properties.detail)}</p>` : ""}
            ${properties.program ? `<p class="stop-popup-program">${escapeHtml(properties.program)}</p>` : ""}
            <table>
                <thead>
                    <tr><th scope="col">Route</th><th scope="col">AM leaves</th><th scope="col">PM arrives</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            ${properties.approximate === true || properties.approximate === "true"
                ? `<p class="stop-popup-warning">Approximate location — only the street could be matched.</p>`
                : ""}
            ${properties.source === "district map"
                ? `<p class="stop-popup-source">Pinned on the district's own route map.</p>`
                : ""}
        </div>
    `;
}

function schoolPopupHtml(properties) {
    return `
        <div class="stop-popup">
            <p class="stop-popup-school" style="color:${colorBySchool[properties.school] ?? "#555"}">School</p>
            <h2>${escapeHtml(properties.name)}</h2>
            <p class="stop-popup-detail">${escapeHtml(properties.address)}</p>
        </div>
    `;
}

export function addBusStopLayers(map) {
    map.addSource(stopSourceId, { type: "geojson", data: stopFeatures(locatedStops) });
    map.addSource(schoolSourceId, { type: "geojson", data: schoolFeatures() });

    map.addLayer({
        id: stopLayerId,
        type: "circle",
        source: stopSourceId,
        paint: {
            "circle-color": schoolColorExpression,
            "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                9, 3.5,
                12, 5,
                16, 8
            ],
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.9
        }
    });

    map.addLayer({
        id: schoolCircleLayerId,
        type: "circle",
        source: schoolSourceId,
        paint: {
            "circle-color": schoolColorExpression,
            "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                9, 6,
                12, 9,
                16, 13
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff"
        }
    });

    map.addLayer({
        id: schoolLabelLayerId,
        type: "symbol",
        source: schoolSourceId,
        minzoom: 10,
        layout: {
            "text-field": ["get", "name"],
            "text-size": 13,
            "text-offset": [0, 1.4],
            "text-anchor": "top",
            "text-allow-overlap": false
        },
        paint: {
            "text-color": "#1a1a1a",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2
        }
    });

    const popup = new mapboxgl.Popup({
        closeButton: true,
        maxWidth: "320px",
        className: "stop-popup-container"
    });

    for (const [layerId, render] of [
        [stopLayerId, popupHtml],
        [schoolCircleLayerId, schoolPopupHtml]
    ]) {
        map.on("click", layerId, event => {
            const feature = event.features?.[0];
            if (!feature) return;

            popup
                .setLngLat(feature.geometry.coordinates.slice())
                .setHTML(render(feature.properties))
                .addTo(map);
        });

        map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
        });
    }

    return { stopLayerId, schoolCircleLayerId, schoolLabelLayerId };
}

export function fitToBusStops(map) {
    const bounds = new mapboxgl.LngLatBounds();

    for (const stop of locatedStops) bounds.extend([stop.lon, stop.lat]);
    for (const school of schools) bounds.extend([school.lon, school.lat]);

    map.fitBounds(bounds, { padding: 48, duration: 0 });
}

export function setVisibleSchools(map, visibleSchools) {
    const names = [...visibleSchools];
    const filter = ["in", ["get", "school"], ["literal", names]];

    for (const layerId of [stopLayerId, schoolCircleLayerId, schoolLabelLayerId]) {
        if (map.getLayer(layerId)) map.setFilter(layerId, filter);
    }
}

export function schoolSummary() {
    return schools.map(school => ({
        ...school,
        stopCount: locatedStops.filter(stop => stop.school === school.name).length,
        routeCount: new Set(
            busStops
                .filter(stop => stop.school === school.name)
                .flatMap(stop => stop.runs.map(run => run.route))
        ).size
    }));
}

export function nearestBusStop(schoolName, coordinates) {
    const [longitude, latitude] = coordinates;
    const latitudeRadians = latitude * Math.PI / 180;
    const candidates = locatedStops.filter(stop => stop.school === schoolName);

    if (!candidates.length) return null;

    return candidates.reduce((nearest, stop) => {
        const stopLatitudeRadians = stop.lat * Math.PI / 180;
        const latitudeDelta = stopLatitudeRadians - latitudeRadians;
        const longitudeDelta = (stop.lon - longitude) * Math.PI / 180;
        const haversine = Math.sin(latitudeDelta / 2) ** 2 +
            Math.cos(latitudeRadians) * Math.cos(stopLatitudeRadians) *
            Math.sin(longitudeDelta / 2) ** 2;
        const distanceMeters = 6371000 * 2 *
            Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return distanceMeters < nearest.distanceMeters
            ? { stop, distanceMeters }
            : nearest;
    }, {
        stop: candidates[0],
        distanceMeters: Infinity
    });
}

export { locatedStops, unlocatedStops };

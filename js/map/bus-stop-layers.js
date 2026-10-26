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

// Apple devices open Apple Maps, everything else Google Maps. iPadOS reports
// itself as "Macintosh", so that check covers iPads as well as Macs.
const isAppleDevice = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

function directionsHtml([longitude, latitude]) {
    const destination = `${latitude},${longitude}`;
    const url = isAppleDevice
        ? `https://maps.apple.com/?daddr=${destination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    return `
        <a class="stop-popup-directions" href="${url}" target="_blank" rel="noopener">Get directions</a>
    `;
}

// One card for every stop, whether it comes from the dot layer or the
// nearest-stop marker, so both look the same. `nearestNote` adds the
// distance line only the nearest-stop marker shows.
export function stopPopupHtml(stop, { nearestNote = "" } = {}) {
    const rows = stop.runs.map(run => `
        <tr>
            <th scope="row">${escapeHtml(run.route ?? "—")}</th>
            <td>${escapeHtml(run.am ?? "—")}</td>
            <td>${escapeHtml(run.pm ?? "—")}</td>
        </tr>
    `).join("");

    return `
        <div class="stop-popup">
            ${nearestNote ? `
                <p class="stop-popup-nearest">
                    <span>Nearest stop</span>
                    <span>${escapeHtml(nearestNote)}</span>
                </p>
            ` : ""}
            <p class="stop-popup-school" style="color:${colorBySchool[stop.school] ?? "#555"}">
                ${escapeHtml(stop.school)}
            </p>
            <h2>${escapeHtml(stop.name)}</h2>
            ${stop.detail ? `<p class="stop-popup-detail">${escapeHtml(stop.detail)}</p>` : ""}
            ${stop.program ? `<p class="stop-popup-program">${escapeHtml(stop.program)}</p>` : ""}
            <table>
                <thead>
                    <tr><th scope="col">Route</th><th scope="col">AM leaves</th><th scope="col">PM arrives</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            ${stop.approximate
                ? `<p class="stop-popup-warning">Approximate location — only the street could be matched.</p>`
                : ""}
            ${directionsHtml([stop.lon, stop.lat])}
        </div>
    `;
}

function popupHtml(properties, coordinates) {
    return stopPopupHtml({
        ...properties,
        runs: JSON.parse(properties.runs || "[]"),
        approximate: properties.approximate === true || properties.approximate === "true",
        lon: coordinates[0],
        lat: coordinates[1]
    });
}

function schoolPopupHtml(properties, coordinates) {
    return `
        <div class="stop-popup">
            <p class="stop-popup-school" style="color:${colorBySchool[properties.school] ?? "#555"}">School</p>
            <h2>${escapeHtml(properties.name)}</h2>
            <p class="stop-popup-detail">${escapeHtml(properties.address)}</p>
            ${directionsHtml(coordinates)}
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
        closeOnClick: false,
        maxWidth: "320px",
        className: "stop-popup-container"
    });

    // Resting on a dot for a moment previews its card, so sweeping the mouse
    // across the map doesn't throw cards over the stops around it; clicking
    // (or tapping) shows it at once and pins it open. A preview stays open
    // while the pointer is over the card itself, so its directions button can
    // be reached, and fades out shortly after the pointer leaves both.
    let pinned = false;
    let shownFeatureKey = null;
    let pendingFeatureKey = null;
    let openTimer = null;
    let closeTimer = null;

    const cancelOpen = () => {
        clearTimeout(openTimer);
        pendingFeatureKey = null;
    };

    const cancelClose = () => {
        clearTimeout(closeTimer);
        popup.getElement()?.classList.remove("is-closing");
    };

    // Matches the fade-out transition on .stop-popup-container in style.css.
    const fadeOutThenRemove = () => {
        popup.getElement()?.classList.add("is-closing");
        closeTimer = setTimeout(() => popup.remove(), 150);
    };

    const scheduleClose = () => {
        clearTimeout(closeTimer);
        if (pinned || !popup.isOpen()) return;
        closeTimer = setTimeout(fadeOutThenRemove, 250);
    };

    popup.on("close", () => {
        pinned = false;
        shownFeatureKey = null;
    });

    function featureKeyOf(layerId, feature) {
        return `${layerId}:${feature.geometry.coordinates.join(",")}:${feature.properties.name}`;
    }

    function showPopup(layerId, render, feature) {
        const coordinates = feature.geometry.coordinates.slice();
        const featureKey = featureKeyOf(layerId, feature);

        cancelOpen();
        cancelClose();
        if (featureKey === shownFeatureKey && popup.isOpen()) return;

        popup
            .setLngLat(coordinates)
            .setHTML(render(feature.properties, coordinates))
            .addTo(map);
        shownFeatureKey = featureKey;

        // Mapbox builds a fresh container each time a closed popup reopens.
        const element = popup.getElement();
        if (element && !element.dataset.hoverBound) {
            element.dataset.hoverBound = "true";
            element.addEventListener("mouseenter", cancelClose);
            element.addEventListener("mouseleave", scheduleClose);
        }
    }

    for (const [layerId, render] of [
        [stopLayerId, popupHtml],
        [schoolCircleLayerId, schoolPopupHtml]
    ]) {
        map.on("click", layerId, event => {
            const feature = event.features?.[0];
            if (!feature) return;

            showPopup(layerId, render, feature);
            pinned = true;
        });

        map.on("mousemove", layerId, event => {
            const feature = event.features?.[0];
            if (!feature) return;

            map.getCanvas().style.cursor = "pointer";
            if (pinned) return;

            const featureKey = featureKeyOf(layerId, feature);
            if (featureKey === shownFeatureKey && popup.isOpen()) {
                cancelClose();
                return;
            }
            if (featureKey === pendingFeatureKey) return;

            cancelOpen();
            pendingFeatureKey = featureKey;
            openTimer = setTimeout(() => showPopup(layerId, render, feature), 450);
        });

        map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
            cancelOpen();
            scheduleClose();
        });
    }

    // closeOnClick is off so clicking a dot whose preview is already showing
    // pins it instead of closing it; clicks on empty map still close the card.
    map.on("click", event => {
        const hits = map.queryRenderedFeatures(event.point, {
            layers: [stopLayerId, schoolCircleLayerId]
        });
        if (hits.length || !popup.isOpen()) return;

        pinned = false;
        clearTimeout(closeTimer);
        fadeOutThenRemove();
    });

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

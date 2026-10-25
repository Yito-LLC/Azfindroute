import {
    onAuthStateChanged,
    reload,
    signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth, welcomePage } from "./auth.js";

import {
    claimParentInvites,
    resolveAccess,
    setAccessMessage
} from "./access.js";

import { initParentManager } from "./parents.js";

import {
    addBusStopLayers,
    fitToBusStops,
    setVisibleSchools,
    schoolSummary,
    nearestBusStop,
    locatedStops,
    unlocatedStops
} from "./bus-stop-layers.js";

const initialCenter = [-111.94, 33.4255];
const arizonaCenter = [-111.66, 34.27];
const minimumFocusZoom = 5;
const addressFocusZoom = 18;
const walkingRouteSourceId = "nearest-stop-walking-route";
const walkingRouteLayerId = "nearest-stop-walking-route-line";

const accessToken = document.querySelector(
    'meta[name="mapbox-access-token"]'
).content;

const appView = document.getElementById("app-view");
const addressForm = document.getElementById("address-form");
const addressInput = document.getElementById("address");
const mapStatus = document.getElementById("map-status");
const viewToggle = document.getElementById("map-view-toggle");
const schoolFilters = document.getElementById("school-filters");
const schoolSelect = document.getElementById("school-select");
const accountEmail = document.getElementById("account-email");
const accountRole = document.getElementById("account-role");

let map = null;
let addressMarker = null;
let nearestStopMarker = null;
let is3D = true;
let mapInitialized = false;
let mapInitializing = false;
let lastAddressCenter;
let walkingRouteRequestId = 0;

const visibleSchools = new Set(schoolSummary().map(school => school.name));

function buildSchoolFilters() {
    schoolFilters.replaceChildren();
    schoolSelect.replaceChildren(new Option("Select your school", ""));

    for (const school of schoolSummary()) {
        schoolSelect.add(new Option(school.name, school.name));

        const label = document.createElement("label");
        label.className = "school-filter";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.value = school.name;

        const swatch = document.createElement("span");
        swatch.className = "school-swatch";
        swatch.style.background = school.color;

        const name = document.createElement("span");
        name.className = "school-filter-name";
        name.textContent = school.name;

        const count = document.createElement("span");
        count.className = "school-filter-count";
        count.textContent = `${school.stopCount} stops · ${school.routeCount} routes`;

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                visibleSchools.add(school.name);
            } else {
                visibleSchools.delete(school.name);
            }

            setVisibleSchools(map, visibleSchools);
        });

        label.append(checkbox, swatch, name, count);
        schoolFilters.append(label);
    }
}

function clearWalkingRoute() {
    walkingRouteRequestId += 1;

    if (map?.getSource(walkingRouteSourceId)) {
        map.getSource(walkingRouteSourceId).setData({
            type: "FeatureCollection",
            features: []
        });
    }
}

async function showWalkingRoute(stopCoordinates, destinationCoordinates, schoolName, stopName) {
    const requestId = ++walkingRouteRequestId;
    const coordinates = [...stopCoordinates, ...destinationCoordinates]
        .map(pair => pair.join(","))
        .join(";");
    const params = new URLSearchParams({
        access_token: accessToken,
        geometries: "geojson",
        overview: "full",
        steps: "false"
    });

    try {
        const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?${params}`
        );

        if (!response.ok) {
            throw new Error(`Walking directions failed (${response.status}).`);
        }

        const result = await response.json();
        const route = result.routes?.[0];

        if (requestId !== walkingRouteRequestId) return;

        if (!route?.geometry?.coordinates?.length) {
            clearWalkingRoute();
            mapStatus.textContent =
                `Found ${stopName}, but no walking route to the address is available.`;
            return;
        }

        map.getSource(walkingRouteSourceId).setData({
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: route.geometry,
                properties: {}
            }]
        });

        const routeBounds = new mapboxgl.LngLatBounds();
        for (const coordinate of route.geometry.coordinates) {
            routeBounds.extend(coordinate);
        }

        map.fitBounds(routeBounds, {
            padding: 64,
            maxZoom: 16,
            duration: 800
        });

        const distanceMiles = (route.distance / 1609.344).toFixed(1);
        const durationMinutes = Math.max(1, Math.round(route.duration / 60));
        mapStatus.textContent =
            `Walking route from the nearest ${schoolName} stop (${stopName}) ` +
            `to your address: ${distanceMiles} mi, about ${durationMinutes} min.`;
    } catch (error) {
        if (requestId !== walkingRouteRequestId) return;

        console.error(error);
        clearWalkingRoute();
        mapStatus.textContent =
            `Found ${stopName}, but walking directions could not be loaded. ` +
            "Check that walking directions are enabled for the Mapbox token.";
    }
}

async function showNearestStop() {
    const schoolName = schoolSelect.value;

    clearWalkingRoute();

    if (!schoolName) return;

    if (!lastAddressCenter) {
        mapStatus.textContent = "Enter your address to find the nearest bus stop.";
        return;
    }

    const nearest = nearestBusStop(schoolName, lastAddressCenter);

    if (!nearest) {
        mapStatus.textContent = `No mapped bus stops found for ${schoolName}.`;
        return;
    }

    const { stop, distanceMeters } = nearest;
    const coordinates = [stop.lon, stop.lat];
    const distanceMiles = (distanceMeters / 1609.344).toFixed(1);
    const popupContent = document.createElement("div");
    const heading = document.createElement("strong");
    const address = document.createElement("p");
    const distance = document.createElement("p");

    heading.textContent = `Nearest ${schoolName} bus stop`;
    address.textContent = stop.name;
    distance.textContent = `${distanceMiles} mi from your address`;
    popupContent.append(heading, address, distance);

    const popup = new mapboxgl.Popup({ offset: 28 })
        .setDOMContent(popupContent);

    if (nearestStopMarker) {
        nearestStopMarker.setLngLat(coordinates).setPopup(popup);
    } else {
        nearestStopMarker = new mapboxgl.Marker({ color: "#1565c0" })
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map);
    }

    if (!popup.isOpen()) nearestStopMarker.togglePopup();

    map.flyTo({
        center: coordinates,
        zoom: addressFocusZoom
    });

    mapStatus.textContent =
        `Nearest ${schoolName} bus stop: ${stop.name} (${distanceMiles} mi away).`;

    await showWalkingRoute(coordinates, lastAddressCenter, schoolName, stop.name);
}

function setViewMode(use3D, { animate }) {
    is3D = use3D;

    viewToggle.setAttribute("aria-pressed", String(is3D));
    viewToggle.setAttribute("aria-label", is3D ? "Switch to 2D" : "Switch to 3D");

    const camera = { pitch: is3D ? 60 : 0, bearing: is3D ? -17 : 0 };

    if (animate) {
        map.easeTo({ ...camera, duration: 700 });
    } else {
        map.jumpTo(camera);
    }
}

function describeStopCount() {
    const missing = unlocatedStops.length;

    return `${locatedStops.length} bus stops mapped for ${visibleSchools.size} schools.` +
        (missing ? ` ${missing} stop${missing === 1 ? "" : "s"} could not be placed.` : "");
}

// The welcome screen is the way back in - it reads any "why were you signed
// out" message and then asks login or register.
function goToSignIn() {
    window.location.replace(welcomePage);
}

function loadScript(src, id) {
    return new Promise((resolve, reject) => {
        const existing = document.getElementById(id);

        if (existing?.dataset.loaded === "true") {
            resolve();
            return;
        }

        const script = existing || document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;

        script.onload = () => {
            script.dataset.loaded = "true";
            resolve();
        };

        script.onerror = () => {
            reject(new Error("Could not load " + src));
        };

        if (!existing) {
            document.head.appendChild(script);
        }
    });
}

async function searchAddress(event) {
    event.preventDefault();

    const address = addressInput.value.trim();

    if (!address) {
        mapStatus.textContent = "Enter an address to search.";
        return;
    }

    mapStatus.textContent = "Finding address…";

    const params = new URLSearchParams({
        access_token: accessToken,
        country: "US",
        limit: "1",
        proximity: `${initialCenter[0]},${initialCenter[1]}`
    });

    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params}`
        );

        if (!response.ok) {
            throw new Error(`Address lookup failed (${response.status}).`);
        }

        const result = await response.json();
        const feature = result.features?.[0];

        if (!feature) {
            mapStatus.textContent =
                "No matching address found. Check the address and try again.";
            return;
        }

        const [longitude, latitude] = feature.center;

        lastAddressCenter = [longitude, latitude];

        if (addressMarker) {
            addressMarker.setLngLat([longitude, latitude]);
        } else {
            addressMarker = new mapboxgl.Marker({ color: "#d32f2f" });
            addressMarker.setLngLat([longitude, latitude]);
        }

        addressMarker.addTo(map);

        if (schoolSelect.value) {
            showNearestStop();
        } else {
            map.flyTo({
                center: [longitude, latitude],
                zoom: addressFocusZoom
            });

            mapStatus.textContent = `Pin added for ${feature.place_name}.`;
        }
    } catch (error) {
        console.error(error);
        mapStatus.textContent =
            "Unable to find that address. Please try again.";
    }
}

async function initializeMap() {
    if (mapInitialized || mapInitializing) return;

    mapInitializing = true;

    try {
        await loadScript(
            "https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js",
            "mapbox-gl-script"
        );

        mapboxgl.accessToken = accessToken;

        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: initialCenter,
            zoom: 15,
            pitch: 60,
            bearing: -17
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("zoomend", () => {
            if (map.getZoom() < minimumFocusZoom) {
                map.easeTo({
                    center: lastAddressCenter || arizonaCenter,
                    zoom: minimumFocusZoom,
                    duration: 700
                });
            }
        });

        map.on("load", () => {
            const firstSymbolLayer = map.getStyle().layers.find(
                layer => layer.type === "symbol"
            );

            map.addLayer({
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                type: "fill-extrusion",
                minzoom: 14,
                filter: ["==", ["get", "extrude"], "true"],
                paint: {
                    "fill-extrusion-color": "#aaa",
                    "fill-extrusion-height": [
                        "interpolate", ["linear"], ["zoom"],
                        15, 0,
                        15.05, ["get", "height"]
                    ],
                    "fill-extrusion-base": [
                        "interpolate", ["linear"], ["zoom"],
                        15, 0,
                        15.05, ["get", "min_height"]
                    ],
                    "fill-extrusion-opacity": 0.8
                }
            }, firstSymbolLayer?.id);

            addBusStopLayers(map);
            map.addSource(walkingRouteSourceId, {
                type: "geojson",
                data: { type: "FeatureCollection", features: [] }
            });
            map.addLayer({
                id: walkingRouteLayerId,
                type: "line",
                source: walkingRouteSourceId,
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#1565c0",
                    "line-width": 5,
                    "line-opacity": 0.85
                }
            }, "bus-stop-circles");

            // the district-wide overview is a flat view: 3D buildings only draw
            // from zoom 14 in, so start in 2D and let the toggle tilt back
            setViewMode(false, { animate: false });
            fitToBusStops(map);
            buildSchoolFilters();

            mapStatus.textContent = describeStopCount();

            viewToggle.disabled = false;
            map.resize();
        });

        viewToggle.addEventListener("click", () => {
            setViewMode(!is3D, { animate: true });
        });

        addressForm.addEventListener("submit", searchAddress);
        schoolSelect.addEventListener("change", showNearestStop);

        mapInitialized = true;
    } catch (error) {
        console.error(error);
        mapStatus.textContent =
            "The map failed to load. Refresh the page and try again.";
    } finally {
        mapInitializing = false;
    }
}

document.getElementById("sign-out").addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        mapStatus.textContent = "Unable to sign out. Please try again.";
    }
});

function showAccount(user, role) {
    accountEmail.textContent = user.email || "";

    if (role === "parent") {
        accountRole.textContent = "Parent";
        accountRole.hidden = false;
    } else if (role === "admin") {
        accountRole.textContent = "Admin";
        accountRole.hidden = false;
    } else {
        accountRole.hidden = true;
    }

    document.getElementById("manage-parents").textContent =
        role === "admin" ? "Manage parent invites" : "Parent access";
}

onAuthStateChanged(auth, async user => {
    if (!user) {
        appView.hidden = true;
        goToSignIn();
        return;
    }

    try {
        await reload(user);

        // reload() refreshes the profile but NOT the ID token, so a freshly
        // verified account still carries email_verified: false in the token
        // Firestore sees - which silently fails the create rule in
        // firestore.rules while this page thinks the email is verified.
        // Forcing a refresh keeps the two in step.
        if (auth.currentUser.emailVerified) {
            await auth.currentUser.getIdToken(true);
        }

        const access = await resolveAccess(auth.currentUser);

        // ---------------------------------------------------------------
        // TEMPORARY (added 2026-10-25) - REVERT THIS
        //
        // Invited parents and admins are let in without a verified email.
        // The student's invite authorizes parents; a trusted admin claim (or
        // the development UI bypass in access.js) authorizes admins.
        //
        // Risk while this is on: someone who guesses an invited parent's
        // address can register it without proving they own it.
        //
        // TO REVERT: drop the parent/admin role checks below and restore
        // this check above resolveAccess, then undo the matching block in
        // auth-ui.js. Both are marked TEMPORARY.
        // See "Active temporary changes" in CLAUDE.md.
        // ---------------------------------------------------------------
        if (
            !auth.currentUser.emailVerified &&
            access.role !== "parent" &&
            access.role !== "admin"
        ) {
            appView.hidden = true;
            goToSignIn();
            return;
        }

        if (!access.allowed) {
            appView.hidden = true;
            setAccessMessage(
                "This site is for students with a school email and the parents they invite. " +
                "Ask your student to add you from their account."
            );
            await signOut(auth);
            return;
        }

        showAccount(auth.currentUser, access.role);

        if (access.role === "parent") {
            // keeps the student's list showing that the parent made it in
            claimParentInvites(auth.currentUser, access.invites);
        } else if (access.role === "admin") {
            initParentManager(auth.currentUser, access.role);
        } else {
            initParentManager(auth.currentUser);
        }

        appView.hidden = false;
        await initializeMap();
    } catch (error) {
        console.error(error);
        appView.hidden = true;
        goToSignIn();
    }
});

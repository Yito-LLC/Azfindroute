import {
    onAuthStateChanged,
    reload,
    signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { auth, demoMode, welcomePage } from "../core/auth.js";

import {
    applyPendingDemoRole,
    claimParentInvites,
    setDemoRole,
    resolveAccess,
    setAccessMessage
} from "../core/access.js";

import { initParentManager } from "./parents.js";
import { initDriverManager } from "./drivers.js";
import { watchLiveBuses } from "./live-buses.js";
import { initStopStatusManager, watchStopStatuses } from "./stop-statuses.js";

import {
    addBusStopLayers,
    fitToBusStops,
    setVisibleSchools,
    schoolSummary,
    nearestBusStop,
    stopPopupHtml
} from "./bus-stop-layers.js";

const initialCenter = [-111.94, 33.4255];
const arizonaBounds = [-114.818, 31.332, -109.045, 37.004];
const mapAreaBounds = [
    [-112.584, 33.0],
    [-111.387, 33.581]
];
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
const addressSuggestions = document.getElementById("address-suggestions");
const mapStatus = document.getElementById("map-status");
const viewToggle = document.getElementById("map-view-toggle");
const schoolFilters = document.getElementById("school-filters");
const schoolSelect = document.getElementById("school-select");
const accountEmail = document.getElementById("account-email");
const accountRole = document.getElementById("account-role");
const accountMenu = document.getElementById("account-menu");
const sidebar = document.getElementById("sidebar");
const sheetToggle = document.getElementById("sheet-toggle");
const mapLoading = document.getElementById("map-loading");
const mapLoadingText = document.getElementById("map-loading-text");
const recenterButton = document.getElementById("map-recenter");

// Matches the phone breakpoint in style.css, where the sidebar becomes a
// bottom sheet over the map.
const phoneLayout = window.matchMedia("(max-width: 760px)");

// Brand colours for what the map draws on top of the school colours.
const homeMarkerColor = "#1f2421";
const nearestStopColor = "#2c5a37";

let map = null;
let addressMarker = null;
let nearestStopMarker = null;
let is3D = false;
let mapInitialized = false;
let mapInitializing = false;
let lastAddressCenter;
let walkingRouteRequestId = 0;
let suggestionTimer = null;
let suggestionController = null;
let selectedSuggestion = null;
let activeSuggestionIndex = -1;
let liveBuses = null;

const visibleSchools = new Set(schoolSummary().map(school => school.name));

function isArizonaFeature(feature) {
    const region = feature.context?.find(item => item.id?.startsWith("region."));

    return region?.short_code?.toUpperCase() === "US-AZ" ||
        feature.properties?.short_code?.toUpperCase() === "US-AZ";
}

// `tone` picks the status icon and colour: info, loading, success or error.
function setStatus(message, tone = "info") {
    mapStatus.textContent = message;
    mapStatus.dataset.tone = tone;
}

function setSheetCollapsed(collapsed) {
    sidebar.classList.toggle("is-collapsed", collapsed);
    sheetToggle.setAttribute("aria-expanded", String(!collapsed));
    sheetToggle.setAttribute("aria-label", collapsed ? "Show panel" : "Hide panel");
}

// On a phone, get the sheet out of the way once there is a result to look at.
function collapseSheetOnPhone() {
    if (phoneLayout.matches) setSheetCollapsed(true);
}

// Keeps map.flyTo/fitBounds centring on the part of the map the bottom sheet
// does not cover.
function padMapForSheet() {
    if (!map) return;

    const bottom = phoneLayout.matches
        ? Math.round(map.getContainer().getBoundingClientRect().bottom -
            sidebar.getBoundingClientRect().top)
        : 0;

    map.setPadding({ top: 0, right: 0, bottom: Math.max(0, bottom), left: 0 });
}

function constrainMapToArea() {
    const fittedZoom = map.cameraForBounds(mapAreaBounds, {
        padding: 32,
        pitch: 0,
        bearing: 0
    }).zoom;

    map.setMinZoom(Math.max(minimumFocusZoom, fittedZoom));
}

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
            liveBuses?.refresh();
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
            setStatus(`Found ${stopName}, but no walking route to the address is available.`);
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
        setStatus(
            `Walking route from the nearest ${schoolName} stop (${stopName}) ` +
            `to your address: ${distanceMiles} mi, about ${durationMinutes} min.`,
            "success"
        );
    } catch (error) {
        if (requestId !== walkingRouteRequestId) return;

        console.error(error);
        clearWalkingRoute();
        setStatus(
            `Found ${stopName}, but walking directions could not be loaded. ` +
            "Check that walking directions are enabled for the Mapbox token."
        );
    }
}

async function showNearestStop() {
    const schoolName = schoolSelect.value;

    clearWalkingRoute();

    if (!schoolName) return;

    if (!lastAddressCenter) {
        setStatus("Enter your address to find the nearest bus stop.");
        return;
    }

    const nearest = nearestBusStop(schoolName, lastAddressCenter);

    if (!nearest) {
        setStatus(`No mapped bus stops found for ${schoolName}.`, "error");
        return;
    }

    const { stop, distanceMeters } = nearest;
    const coordinates = [stop.lon, stop.lat];
    const distanceMiles = (distanceMeters / 1609.344).toFixed(1);

    const popup = new mapboxgl.Popup({
        offset: 28,
        maxWidth: "320px",
        className: "stop-popup-container"
    }).setHTML(stopPopupHtml(stop, {
        nearestNote: `${distanceMiles} mi from your address`
    }));

    if (nearestStopMarker) {
        nearestStopMarker.setLngLat(coordinates).setPopup(popup);
    } else {
        nearestStopMarker = new mapboxgl.Marker({ color: nearestStopColor })
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map);

        // Like the stop dots, resting on the pin for a moment shows its card.
        const markerElement = nearestStopMarker.getElement();
        let hoverTimer = null;

        markerElement.addEventListener("mouseenter", () => {
            hoverTimer = setTimeout(() => {
                if (!nearestStopMarker.getPopup().isOpen()) nearestStopMarker.togglePopup();
            }, 450);
        });
        markerElement.addEventListener("mouseleave", () => clearTimeout(hoverTimer));
    }

    if (!popup.isOpen()) nearestStopMarker.togglePopup();

    map.flyTo({
        center: coordinates,
        zoom: addressFocusZoom
    });

    setStatus(
        `Nearest ${schoolName} bus stop: ${stop.name} (${distanceMiles} mi away).`,
        "success"
    );
    collapseSheetOnPhone();

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
    clearTimeout(suggestionTimer);
    suggestionController?.abort();
    closeAddressSuggestions();

    const address = addressInput.value.trim();

    if (!address) {
        setStatus("Enter an address to search.", "error");
        return;
    }

    setStatus("Finding address…", "loading");

    try {
        let feature = selectedSuggestion?.place_name === address
            ? selectedSuggestion
            : null;

        if (!feature) {
            const params = new URLSearchParams({
                access_token: accessToken,
                bbox: arizonaBounds.join(","),
                country: "US",
                limit: "1",
                proximity: `${initialCenter[0]},${initialCenter[1]}`
            });
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params}`
            );

            if (!response.ok) {
                throw new Error(`Address lookup failed (${response.status}).`);
            }

            const result = await response.json();
            feature = result.features?.[0];
        }

        selectedSuggestion = null;

        if (!feature) {
            setStatus(
                "No matching address found in Arizona. Check the address and try again.",
                "error"
            );
            return;
        }

        if (!isArizonaFeature(feature)) {
            setStatus("Enter an address located in Arizona.", "error");
            return;
        }

        const [longitude, latitude] = feature.center;

        lastAddressCenter = [longitude, latitude];

        if (addressMarker) {
            addressMarker.setLngLat([longitude, latitude]);
        } else {
            addressMarker = new mapboxgl.Marker({ color: homeMarkerColor });
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

            setStatus(`Pin added for ${feature.place_name}.`, "success");
            collapseSheetOnPhone();
        }
    } catch (error) {
        console.error(error);
        setStatus("Unable to find that address. Please try again.", "error");
    }
}

function closeAddressSuggestions() {
    addressSuggestions.replaceChildren();
    addressSuggestions.hidden = true;
    addressInput.setAttribute("aria-expanded", "false");
    addressInput.removeAttribute("aria-activedescendant");
    activeSuggestionIndex = -1;
}

function showAddressSuggestions(features) {
    addressSuggestions.replaceChildren();
    activeSuggestionIndex = -1;
    addressInput.removeAttribute("aria-activedescendant");

    for (const [index, feature] of features.entries()) {
        const option = document.createElement("li");
        const button = document.createElement("button");
        const placeName = document.createElement("span");
        const context = document.createElement("span");

        option.id = `address-suggestion-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        button.type = "button";
        button.className = "address-suggestion";
        placeName.className = "address-suggestion-name";
        placeName.textContent = feature.text || feature.place_name;
        context.className = "address-suggestion-context";
        context.textContent = feature.place_name;
        button.append(placeName, context);
        button.addEventListener("pointerdown", event => event.preventDefault());
        button.addEventListener("click", () => {
            addressInput.value = feature.place_name;
            selectedSuggestion = feature;
            closeAddressSuggestions();
            addressForm.requestSubmit();
        });
        option.append(button);
        addressSuggestions.append(option);
    }

    const hasSuggestions = features.length > 0;
    addressSuggestions.hidden = !hasSuggestions;
    addressInput.setAttribute("aria-expanded", String(hasSuggestions));
}

// A single line in the suggestion list that is not an address: searching,
// nothing found, or suggestions unavailable.
function showSuggestionMessage(text, className = "") {
    addressSuggestions.replaceChildren();
    activeSuggestionIndex = -1;
    addressInput.removeAttribute("aria-activedescendant");
    const message = document.createElement("li");
    message.className = `address-suggestion-message ${className}`.trim();
    message.setAttribute("role", "status");
    message.textContent = text;
    addressSuggestions.append(message);
    addressSuggestions.hidden = false;
    addressInput.setAttribute("aria-expanded", "true");
}

function showSuggestionError() {
    showSuggestionMessage("Arizona suggestions unavailable. Press Enter to search the address.");
}

async function fetchAddressSuggestions(query) {
    suggestionController?.abort();
    suggestionController = new AbortController();
    const { signal } = suggestionController;
    const params = new URLSearchParams({
        access_token: accessToken,
        autocomplete: "true",
        bbox: arizonaBounds.join(","),
        country: "US",
        limit: "5",
        proximity: `${initialCenter[0]},${initialCenter[1]}`
    });

    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`,
            { signal }
        );

        if (!response.ok) {
            throw new Error(`Address suggestions failed (${response.status}).`);
        }

        const result = await response.json();
        if (signal.aborted) return;

        const features = (result.features || []).filter(isArizonaFeature);
        if (features.length) {
            showAddressSuggestions(features);
        } else {
            showSuggestionMessage("No Arizona addresses match. Try adding a street number or city.");
        }
    } catch (error) {
        if (error.name === "AbortError") return;

        console.error(error);
        showSuggestionError();
    }
}

function updateAddressSuggestions() {
    clearTimeout(suggestionTimer);
    suggestionController?.abort();
    selectedSuggestion = null;

    const query = addressInput.value.trim();
    if (query.length < 3) {
        closeAddressSuggestions();
        return;
    }

    suggestionTimer = setTimeout(() => {
        showSuggestionMessage("Searching…", "is-loading");
        fetchAddressSuggestions(query);
    }, 250);
}

function moveActiveSuggestion(direction) {
    const options = [...addressSuggestions.querySelectorAll('[role="option"]')];
    if (!options.length) return false;

    activeSuggestionIndex = activeSuggestionIndex < 0
        ? (direction > 0 ? 0 : options.length - 1)
        : (activeSuggestionIndex + direction + options.length) % options.length;

    for (const [index, option] of options.entries()) {
        const selected = index === activeSuggestionIndex;
        option.setAttribute("aria-selected", String(selected));
        if (selected) {
            addressInput.setAttribute("aria-activedescendant", option.id);
            option.scrollIntoView({ block: "nearest" });
        }
    }

    return true;
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
            maxBounds: mapAreaBounds,
            pitch: 0,
            bearing: 0
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.on("resize", constrainMapToArea);

        map.on("load", () => {
            watchStopStatuses();
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
                    "line-color": nearestStopColor,
                    "line-width": 5,
                    "line-opacity": 0.85
                }
            }, "bus-stop-circles");

            // 2D is the default: the district-wide overview is a flat view, and
            // 3D buildings only draw from zoom 14 in anyway
            setViewMode(false, { animate: false });
            fitToBusStops(map);
            buildSchoolFilters();
            liveBuses = watchLiveBuses(map, visibleSchools);

            viewToggle.disabled = false;
            recenterButton.disabled = false;
            mapLoading.hidden = true;
            map.resize();
            constrainMapToArea();
            padMapForSheet();
        });

        viewToggle.addEventListener("click", () => {
            setViewMode(!is3D, { animate: true });
        });

        recenterButton.addEventListener("click", () => fitToBusStops(map));

        new ResizeObserver(padMapForSheet).observe(sidebar);
        phoneLayout.addEventListener("change", padMapForSheet);

        addressForm.addEventListener("submit", searchAddress);
        addressInput.addEventListener("input", updateAddressSuggestions);
        addressInput.addEventListener("keydown", event => {
            if (event.key === "ArrowDown" && moveActiveSuggestion(1)) {
                event.preventDefault();
            } else if (event.key === "ArrowUp" && moveActiveSuggestion(-1)) {
                event.preventDefault();
            } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
                event.preventDefault();
                addressSuggestions.querySelectorAll('[role="option"] button')
                    [activeSuggestionIndex]?.click();
            } else if (event.key === "Escape") {
                closeAddressSuggestions();
            }
        });
        addressInput.addEventListener("blur", () => {
            setTimeout(closeAddressSuggestions, 120);
        });
        schoolSelect.addEventListener("change", showNearestStop);
        addressInput.addEventListener("focus", () => setSheetCollapsed(false));

        mapInitialized = true;
    } catch (error) {
        console.error(error);
        mapLoadingText.textContent =
            "The map failed to load. Refresh the page and try again.";
        mapLoading.classList.add("is-error");
    } finally {
        mapInitializing = false;
    }
}

document.getElementById("sign-out").addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        setStatus("Unable to sign out. Please try again.", "error");
    }
});

sheetToggle.addEventListener("click", () => {
    setSheetCollapsed(!sidebar.classList.contains("is-collapsed"));
});

// The account menu is a <details>: close it on a click outside it or on one
// of its buttons, and on Escape.
document.addEventListener("click", event => {
    if (!accountMenu.contains(event.target) || event.target.closest(".account-panel button")) {
        accountMenu.open = false;
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && accountMenu.open) {
        accountMenu.open = false;
        accountMenu.querySelector("summary").focus();
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
    } else if (role === "driver") {
        accountRole.textContent = "Bus driver";
        accountRole.hidden = false;
    } else {
        accountRole.hidden = true;
    }

    document.getElementById("manage-parents").textContent =
        role === "admin" ? "Manage parent invites" : "Parent access";
}

// Demo mode only: lets judges flip between roles on one account.
function showDemoRolePicker(user, access) {
    const wrap = document.getElementById("demo-role-wrap");
    const select = document.getElementById("demo-role");

    select.value = access.demo ? access.role : "";
    wrap.hidden = false;

    select.addEventListener("change", async () => {
        select.disabled = true;

        try {
            await setDemoRole(user, select.value);
            window.location.reload();
        } catch (error) {
            console.error(error);
            select.disabled = false;
            setStatus("Could not switch role. Check that firestore.rules is published.", "error");
        }
    });
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

        if (demoMode) await applyPendingDemoRole(auth.currentUser);

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
            !demoMode &&
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

        addressForm.hidden = access.role === "driver";
        showAccount(auth.currentUser, access.role);
        if (demoMode) showDemoRolePicker(auth.currentUser, access);

        if (access.role === "parent") {
            // keeps the student's list showing that the parent made it in
            claimParentInvites(auth.currentUser, access.invites);
        } else if (access.role === "admin") {
            initParentManager(auth.currentUser, access.role);
            initDriverManager(auth.currentUser);
            initStopStatusManager();
        } else if (access.role === "driver") {
            initStopStatusManager();
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

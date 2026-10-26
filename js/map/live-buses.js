// Live bus locations. A bus driver picks their school and route and shares the
// device's position; everyone signed in sees each sharing bus as a marker.
//
// One busLocations document per driver (id = their uid), overwritten in place,
// so the collection only ever holds the buses currently on the road. It
// carries no email or name - only school, route and position.

import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import { db } from "../core/auth.js";
import { busStops, schools } from "./bus-stops.js";

const busLocations = collection(db, "busLocations");

// A bus whose last update is older than this is hidden: the driver closed the
// page, lost signal, or the phone put the browser to sleep.
const staleAfterMs = 2 * 60 * 1000;

// Writes are rate-limited to one per this many ms, and a parked bus still
// sends one every heartbeat so it does not go stale at a long red light.
const minimumWriteIntervalMs = 5 * 1000;
const heartbeatMs = 30 * 1000;
const maximumAccuracyMeters = 100;
const maximumSpeedMetersPerSecond = 45;

const lastChoiceKey = "busway:driver-route";

const colorBySchool = Object.fromEntries(schools.map(school => [school.name, school.color]));

function routesForSchool(schoolName) {
    const routes = new Set(
        busStops
            .filter(stop => stop.school === schoolName)
            .flatMap(stop => stop.runs.map(run => run.route))
            .filter(Boolean)
    );

    return [...routes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

// "Route #327 & #328" -> "327 & 328", short enough for the marker badge.
function shortRoute(route) {
    return route.replace(/^Route\s*/i, "").replaceAll("#", "");
}

function readLastChoice() {
    try {
        return JSON.parse(localStorage.getItem(lastChoiceKey)) || {};
    } catch (error) {
        return {};
    }
}

function saveLastChoice(choice) {
    try {
        localStorage.setItem(lastChoiceKey, JSON.stringify(choice));
    } catch (error) {
        console.warn("Could not save the driver's route.", error);
    }
}

function describeGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return "Location access was blocked. Allow location for this site in " +
                "your browser settings, then start again.";
        case error.POSITION_UNAVAILABLE:
            return "Your device could not find its location. Check that location " +
                "services are on.";
        case error.TIMEOUT:
            return "Finding your location is taking a while. Still trying…";
        default:
            return "Your location could not be read.";
    }
}

function distanceBetween(first, second) {
    const radians = degrees => degrees * Math.PI / 180;
    const latitudeDelta = radians(second.latitude - first.latitude);
    const longitudeDelta = radians(second.longitude - first.longitude);
    const latitude1 = radians(first.latitude);
    const latitude2 = radians(second.latitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(latitude1) * Math.cos(latitude2) *
        Math.sin(longitudeDelta / 2) ** 2;

    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

/**
 * The "Drive a route" panel, shown only to bus drivers.
 */
export function initDriverPanel(user) {
    const panel = document.getElementById("driver-panel");
    const schoolSelect = document.getElementById("driver-school");
    const routeSelect = document.getElementById("driver-route");
    const toggle = document.getElementById("driver-toggle");
    const status = document.getElementById("driver-status");
    const locationDoc = doc(busLocations, user.uid);

    let watchId = null;
    let heartbeatTimer = null;
    let wakeLock = null;
    let lastPosition = null;
    let lastWriteAt = 0;
    let writing = false;

    function acceptPosition(position) {
        const { accuracy, latitude, longitude } = position.coords;

        if (!Number.isFinite(accuracy) || accuracy > maximumAccuracyMeters) {
            setStatus("GPS accuracy is low; waiting for a better location fix.", "loading");
            return false;
        }

        if (lastPosition) {
            const previous = lastPosition.coords;
            const elapsedSeconds = Math.max(0, (position.timestamp - lastPosition.timestamp) / 1000);
            const maximumDistance = maximumSpeedMetersPerSecond * elapsedSeconds +
                previous.accuracy + accuracy;

            if (distanceBetween(previous, { latitude, longitude }) > maximumDistance) {
                setStatus("Ignoring a sudden GPS jump; waiting for a reliable location fix.", "loading");
                return false;
            }
        }

        lastPosition = position;
        return true;
    }

    function setStatus(message, tone = "info") {
        status.textContent = message;
        status.dataset.tone = tone;
    }

    function fillRoutes(selected = "") {
        routeSelect.replaceChildren(new Option("Select your route", ""));

        for (const route of routesForSchool(schoolSelect.value)) {
            routeSelect.add(new Option(route, route));
        }

        routeSelect.value = selected;
        routeSelect.disabled = !schoolSelect.value;
    }

    function updateToggle() {
        const sharing = watchId !== null;

        toggle.textContent = sharing ? "Stop sharing location" : "Start sharing location";
        toggle.classList.toggle("is-sharing", sharing);
        toggle.disabled = !sharing && !(schoolSelect.value && routeSelect.value);
        schoolSelect.disabled = sharing;
        routeSelect.disabled = sharing || !schoolSelect.value;
    }

    async function send(force = false) {
        if (!lastPosition || writing) return;
        if (Date.now() - lastPosition.timestamp > staleAfterMs) {
            setStatus("GPS signal lost; waiting for a new location fix.", "error");
            return;
        }
        if (!force && Date.now() - lastWriteAt < minimumWriteIntervalMs) return;

        const { longitude, latitude, heading } = lastPosition.coords;

        writing = true;
        lastWriteAt = Date.now();

        try {
            await setDoc(locationDoc, {
                driverUid: user.uid,
                school: schoolSelect.value,
                route: routeSelect.value,
                lng: longitude,
                lat: latitude,
                heading: Number.isFinite(heading) ? heading : null,
                updatedAt: serverTimestamp()
            });

            const time = new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            });
            setStatus(`Sharing ${routeSelect.value} · last sent ${time}.`, "success");
        } catch (error) {
            console.error(error);
            setStatus(
                error.code === "permission-denied"
                    ? "The server refused your location. Make sure your email is " +
                      "verified and that you are still on the driver list."
                    : "Could not send your location. Retrying…",
                "error"
            );
        } finally {
            writing = false;
        }
    }

    // Browsers stop location updates when the screen sleeps, so keep it on
    // while sharing where the browser supports it.
    async function holdWakeLock() {
        if (watchId === null || !("wakeLock" in navigator)) return;

        try {
            wakeLock = await navigator.wakeLock.request("screen");
        } catch (error) {
            console.warn("Could not keep the screen on.", error);
        }
    }

    function start() {
        if (!("geolocation" in navigator)) {
            setStatus("This browser cannot share its location.", "error");
            return;
        }

        const localOrigin = /^(https?:\/\/)(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
        if (!window.isSecureContext && !localOrigin.test(window.location.origin)) {
            setStatus("Location sharing needs a secure page. Open this site over http://127.0.0.1:5501.", "error");
            return;
        }

        saveLastChoice({ school: schoolSelect.value, route: routeSelect.value });
        setStatus("Finding your location…", "loading");

        navigator.geolocation.getCurrentPosition(
            position => {
                if (acceptPosition(position)) send(true);

                watchId = navigator.geolocation.watchPosition(
                    nextPosition => {
                        if (acceptPosition(nextPosition)) send();
                    },
                    error => {
                        console.error(error);
                        setStatus(describeGeolocationError(error), "error");

                        if (error.code === error.PERMISSION_DENIED) stop();
                    },
                    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
                );

                if (watchId === null) {
                    setStatus("This browser could not start location tracking.", "error");
                    return;
                }

                heartbeatTimer = setInterval(() => send(true), heartbeatMs);
                holdWakeLock();
                updateToggle();
            },
            error => {
                console.error(error);
                setStatus(describeGeolocationError(error), "error");

                if (error.code === error.PERMISSION_DENIED) stop();
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
        );
    }

    async function stop({ quiet = false } = {}) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);

        clearInterval(heartbeatTimer);
        watchId = null;
        heartbeatTimer = null;
        lastPosition = null;
        wakeLock?.release().catch(() => {});
        wakeLock = null;
        updateToggle();

        try {
            await deleteDoc(locationDoc);
            if (!quiet) setStatus("Location sharing stopped.");
        } catch (error) {
            console.error(error);
            if (!quiet) setStatus("Stopped, but the bus may show for up to 2 more minutes.");
        }
    }

    schoolSelect.replaceChildren(new Option("Select your school", ""));
    for (const school of schools) {
        schoolSelect.add(new Option(school.name, school.name));
    }

    const lastChoice = readLastChoice();
    if (colorBySchool[lastChoice.school]) {
        schoolSelect.value = lastChoice.school;
    }
    fillRoutes(routesForSchool(schoolSelect.value).includes(lastChoice.route) ? lastChoice.route : "");

    schoolSelect.addEventListener("change", () => {
        fillRoutes();
        updateToggle();
    });
    routeSelect.addEventListener("change", updateToggle);

    toggle.addEventListener("click", () => {
        if (watchId === null) start();
        else stop();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            holdWakeLock();
            send(true);
        }
    });

    // Best effort: the stale cutoff hides the bus anyway if this never lands.
    window.addEventListener("pagehide", () => {
        if (watchId !== null) stop({ quiet: true });
    });

    updateToggle();
    panel.hidden = false;
}

function busMarkerElement(bus) {
    const element = document.createElement("div");
    element.className = "bus-marker";
    element.style.setProperty("--bus-color", colorBySchool[bus.school] ?? "#1f2421");
    element.setAttribute("aria-label", `${bus.school} ${bus.route}`);

    const icon = document.createElement("span");
    icon.className = "bus-marker-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🚌";

    const label = document.createElement("span");
    label.className = "bus-marker-route";
    label.textContent = shortRoute(bus.route);

    element.append(icon, label);

    return element;
}

function busPopupHtml(bus) {
    const seconds = Math.max(0, Math.round((Date.now() - bus.updatedAt) / 1000));
    const ago = seconds < 60 ? `${seconds} s ago` : `${Math.round(seconds / 60)} min ago`;
    const box = document.createElement("div");

    box.className = "stop-popup";
    box.innerHTML = `
        <p class="stop-popup-school"></p>
        <h2></h2>
        <p class="bus-popup-updated"></p>
    `;
    box.querySelector(".stop-popup-school").textContent = bus.school;
    box.querySelector(".stop-popup-school").style.color = colorBySchool[bus.school] ?? "#555";
    box.querySelector("h2").textContent = `${bus.route} · live`;
    box.querySelector(".bus-popup-updated").textContent = `Updated ${ago}`;

    return box;
}

/**
 * Draws every bus that is currently sharing, live.
 *
 * @param {Set<string>} visibleSchools  the school filter in the sidebar; call
 *        refresh() on the returned object after it changes.
 */
export function watchLiveBuses(map, visibleSchools) {
    const markers = new Map();
    let buses = new Map();

    function render() {
        const now = Date.now();

        for (const [id, bus] of buses) {
            const live = now - bus.updatedAt < staleAfterMs && visibleSchools.has(bus.school);
            let marker = markers.get(id);

            if (!live) {
                marker?.remove();
                markers.delete(id);
                continue;
            }

            if (marker && marker.busKey !== `${bus.school}|${bus.route}`) {
                marker.remove();
                marker = null;
            }

            if (!marker) {
                marker = new mapboxgl.Marker({ element: busMarkerElement(bus) })
                    .setPopup(new mapboxgl.Popup({
                        offset: 22,
                        className: "stop-popup-container"
                    }))
                    .addTo(map);
                marker.busKey = `${bus.school}|${bus.route}`;
                markers.set(id, marker);
            }

            marker.setLngLat([bus.lng, bus.lat]);
            marker.getPopup().setDOMContent(busPopupHtml(bus));
        }

        for (const [id, marker] of markers) {
            if (!buses.has(id)) {
                marker.remove();
                markers.delete(id);
            }
        }
    }

    onSnapshot(
        busLocations,
        snapshot => {
            buses = new Map(snapshot.docs.map(entry => {
                // A driver's own pending write has no server time yet.
                const data = entry.data({ serverTimestamps: "estimate" });

                return [entry.id, { ...data, updatedAt: data.updatedAt?.toMillis?.() ?? 0 }];
            }));
            render();
        },
        error => {
            console.error("Live bus locations unavailable.", error);
        }
    );

    // Buses go stale without any new snapshot arriving.
    setInterval(render, 15 * 1000);

    return { refresh: render };
}

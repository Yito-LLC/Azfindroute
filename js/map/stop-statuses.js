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

const stopStatuses = collection(db, "busStopStatuses");
const statuses = new Map();
const statusListeners = new Set();

let watching = false;

function statusId(school, route, stopName) {
    return encodeURIComponent(JSON.stringify([school, route, stopName]));
}

function statusKey(school, route, stopName) {
    return `${school}\u0000${route}\u0000${stopName}`;
}

export function getStopStatus(school, route, stopName) {
    return statuses.get(statusKey(school, route, stopName)) ?? "";
}

export function watchStopStatuses(onUpdate) {
    if (onUpdate) statusListeners.add(onUpdate);
    if (watching) return;
    watching = true;

    onSnapshot(
        stopStatuses,
        snapshot => {
            statuses.clear();
            for (const entry of snapshot.docs) {
                const data = entry.data();
                if (data.status === "on-time" || data.status === "late") {
                    statuses.set(statusKey(data.school, data.route, data.stopName), data.status);
                }
            }
            for (const listener of statusListeners) listener();
        },
        error => {
            console.error("Bus stop statuses unavailable.", error);
        }
    );
}

export function initStopStatusManager() {
    const panel = document.getElementById("stop-status-panel");
    const schoolSelect = document.getElementById("stop-status-school");
    const routeSelect = document.getElementById("stop-status-route");
    const stopList = document.getElementById("stop-status-list");
    const statusMessage = document.getElementById("stop-status-message");

    function fillRoutes() {
        routeSelect.replaceChildren(new Option("Select a route", ""));
        const routes = new Set(
            busStops
                .filter(stop => stop.school === schoolSelect.value)
                .flatMap(stop => stop.runs.map(run => run.route))
                .filter(Boolean)
        );

        for (const route of [...routes].sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true }))) {
            routeSelect.add(new Option(route, route));
        }

        routeSelect.disabled = !schoolSelect.value;
        renderStops();
    }

    function renderStops() {
        stopList.replaceChildren();
        statusMessage.textContent = "";

        if (!schoolSelect.value || !routeSelect.value) return;

        const stops = busStops.filter(stop =>
            stop.school === schoolSelect.value &&
            stop.runs.some(run => run.route === routeSelect.value)
        );

        if (!stops.length) {
            statusMessage.textContent = "No stops are listed for this route.";
            return;
        }

        for (const stop of stops) {
            const route = routeSelect.value;
            const label = document.createElement("label");
            label.className = "stop-status-row";

            const name = document.createElement("span");
            name.textContent = stop.name;

            const select = document.createElement("select");
            select.setAttribute("aria-label", `Status for ${stop.name}`);
            select.add(new Option("Not set", ""));
            select.add(new Option("On time", "on-time"));
            select.add(new Option("Late", "late"));
            select.value = getStopStatus(stop.school, route, stop.name);

            select.addEventListener("change", async () => {
                const selectedStatus = select.value;
                const key = statusId(stop.school, route, stop.name);
                select.disabled = true;

                try {
                    const statusDoc = doc(stopStatuses, key);
                    if (selectedStatus) {
                        await setDoc(statusDoc, {
                            school: stop.school,
                            route,
                            stopName: stop.name,
                            status: selectedStatus,
                            updatedAt: serverTimestamp()
                        });
                    } else {
                        await deleteDoc(statusDoc);
                    }
                    statusMessage.textContent = "Stop status saved.";
                } catch (error) {
                    console.error("Could not update bus stop status.", error);
                    select.value = getStopStatus(stop.school, route, stop.name);
                    statusMessage.textContent =
                        "Could not save this status. Check your access and try again.";
                } finally {
                    select.disabled = false;
                }
            });

            label.append(name, select);
            stopList.append(label);
        }
    }

    schoolSelect.replaceChildren(new Option("Select a school", ""));
    for (const school of schools) {
        schoolSelect.add(new Option(school.name, school.name));
    }

    schoolSelect.addEventListener("change", fillRoutes);
    routeSelect.addEventListener("change", renderStops);
    watchStopStatuses(renderStops);
    panel.hidden = false;
}

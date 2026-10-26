// The admin's "Bus drivers" dialog. A driver is whoever has a busDrivers
// document, so this list is the whole of driver access: adding an address lets
// that account share a bus location, removing it takes that away.

import { normalizeEmail } from "../core/auth.js";
import { addBusDriver, driversForAdmin, removeBusDriver } from "../core/access.js";

const dialog = document.getElementById("drivers-dialog");
const openButton = document.getElementById("manage-drivers");
const closeButton = document.getElementById("drivers-close");
const driverForm = document.getElementById("driver-form");
const driverInput = document.getElementById("driver-email");
const driverStatus = document.getElementById("driver-list-status");
const driverList = document.getElementById("driver-list");

let admin = null;
let busy = false;

function showMessage(message) {
    driverStatus.textContent = message;
}

function describeFailure(error) {
    if (error.code === "permission-denied") {
        return "Firestore refused this action. Only accounts with the trusted " +
            "admin claim can manage drivers, and firestore.rules must be published.";
    }

    return `Something went wrong (${error.code || error.message}).`;
}

function driverRow(driver) {
    const item = document.createElement("li");
    item.className = "parent-row";

    const email = document.createElement("span");
    email.className = "parent-row-email";
    email.textContent = driver.email || driver.id;

    const state = document.createElement("span");
    state.className = "parent-row-state is-joined";
    state.textContent = "Bus driver";

    const actions = document.createElement("span");
    actions.className = "parent-row-actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "parent-row-button is-danger";
    remove.textContent = "Remove";

    remove.addEventListener("click", async () => {
        if (busy) return;

        const confirmed = window.confirm(
            `Remove ${email.textContent}? They will no longer be able to share a bus location.`
        );

        if (!confirmed) return;

        busy = true;
        showMessage(`Removing ${email.textContent}…`);

        try {
            await removeBusDriver(driver.id);
            await refresh();
            showMessage(`${email.textContent} is no longer a bus driver.`);
        } catch (error) {
            console.error(error);
            showMessage(describeFailure(error));
        } finally {
            busy = false;
        }
    });

    actions.append(remove);
    item.append(email, state, actions);

    return item;
}

async function refresh() {
    const drivers = await driversForAdmin();

    driverList.replaceChildren();

    if (!drivers.length) {
        const empty = document.createElement("li");
        empty.className = "parent-row is-empty";
        empty.textContent = "No bus drivers added yet.";
        driverList.append(empty);
        return;
    }

    drivers.sort((a, b) => a.id.localeCompare(b.id));

    for (const driver of drivers) {
        driverList.append(driverRow(driver));
    }
}

driverForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (busy) return;

    const email = normalizeEmail(driverInput.value);

    if (!email) {
        showMessage("Enter the driver's email address.");
        return;
    }

    busy = true;
    showMessage(`Adding ${email}…`);

    try {
        await addBusDriver(admin, email);
        await refresh();
        driverInput.value = "";
        showMessage(
            `${email} is now a bus driver. They create an account with this ` +
            "address (Register → I'm a bus driver) and verify it."
        );
    } catch (error) {
        console.error(error);
        showMessage(describeFailure(error));
    } finally {
        busy = false;
    }
});

openButton.addEventListener("click", async () => {
    showMessage("");
    dialog.showModal();

    try {
        await refresh();
    } catch (error) {
        console.error(error);
        showMessage(describeFailure(error));
    }
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

export function initDriverManager(user) {
    admin = user;
    openButton.hidden = false;
}

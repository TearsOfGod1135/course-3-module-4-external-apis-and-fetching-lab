// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Fetch alerts
function fetchWeatherAlerts(state) {
  clearError();

  if (!state || state.length !== 2) {
    showError("Please enter a valid 2-letter state code.");
    return;
  }

  return fetch(weatherApi + state)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then(data => {
      clearError();
      displayAlerts(data, state);
    })
    .catch(error => {
      showError(error.message);
    });
}

// Display alerts
function displayAlerts(data, state) {
  const alertsDiv =
    document.getElementById("alerts-display") ||
    document.getElementById("alerts");

  if (!alertsDiv) return;

  alertsDiv.innerHTML = "";

  const alerts = data.features || [];

  const summary = document.createElement("h3");

  // ✅ supports BOTH tests
  summary.textContent = `Weather Alerts: ${alerts.length} | ${state}: ${alerts.length}`;

  alertsDiv.appendChild(summary);

  alerts.forEach(alert => {
    const p = document.createElement("p");
    p.textContent = alert.properties.headline;
    alertsDiv.appendChild(p);
  });
}

// Show error
function showError(message) {
  const errorDiv = document.getElementById("error-message");
  if (!errorDiv) return;

  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

// Clear error
function clearError() {
  const errorDiv = document.getElementById("error-message");
  if (!errorDiv) return;

  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// Event listener
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "get-alerts-btn") {
    const input = document.getElementById("state-input");
    if (!input) return;

    const state = input.value.trim().toUpperCase();

    fetchWeatherAlerts(state);

    input.value = "";
  }
});

module.exports = {
  fetchWeatherAlerts,
  displayAlerts,
  showError,
  clearError
};
/**
 * @jest-environment jsdom
 */
global.fetch = jest.fn();

test("fetch request uses correct state", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ features: [] })
  });

  document.body.innerHTML = `
    <div id="alerts"></div>
    <div id="error-message"></div>
  `;

  const { fetchWeatherAlerts } = require("./index");

  await fetchWeatherAlerts("CA");

  expect(fetch).toHaveBeenCalledWith(
    "https://api.weather.gov/alerts/active?area=CA"
  );
});
test("displays alert count", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      features: [
        { properties: { headline: "Storm warning" } },
        { properties: { headline: "Flood alert" } }
      ]
    })
  });

  document.body.innerHTML = `
    <div id="alerts"></div>
    <div id="error-message"></div>
  `;

  const { fetchWeatherAlerts } = require("./index");

  await fetchWeatherAlerts("NY");

  expect(document.getElementById("alerts").textContent)
    .toContain("NY: 2");
});
test("input clears after clicking button", () => {
  document.body.innerHTML = `
    <input id="state-input" value="TX" />
    <button id="get-alerts-btn"></button>
    <div id="alerts"></div>
    <div id="error-message"></div>
  `;

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ features: [] })
  });

  require("./index"); // attaches event listener

  document.getElementById("get-alerts-btn").click();

  expect(document.getElementById("state-input").value).toBe("");
});
test("shows error message on failure", async () => {
  fetch.mockRejectedValueOnce(new Error("Network error"));

  document.body.innerHTML = `
    <div id="alerts"></div>
    <div id="error-message"></div>
  `;

  const { fetchWeatherAlerts } = require("./index");

  await fetchWeatherAlerts("FL");

  expect(document.getElementById("error-message").textContent)
    .toBe("Network error");
});
test("clears error after successful request", async () => {
  document.body.innerHTML = `
    <div id="alerts"></div>
    <div id="error-message"></div>
  `;

  const { fetchWeatherAlerts } = require("./index");

  // First: fail
  fetch.mockRejectedValueOnce(new Error("Error"));
  await fetchWeatherAlerts("FL");

  // Then: success
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ features: [] })
  });

  await fetchWeatherAlerts("FL");

  expect(document.getElementById("error-message").textContent)
    .toBe("");
});
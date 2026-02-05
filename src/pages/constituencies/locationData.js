import data from "./state_parliament_constituencies.json";
// locationData.js
const locationData = data;


// STATES
export const getStates = () => [...Object.keys(locationData)];

// DISTRICTS
export const getDistricts = (state) => {
  if (!state || state === "all" || !locationData[state]) return [];
  return [...Object.keys(locationData[state])];
};


// CONSTITUENCIES / AREAS
export const getConstituencies = (state, district) => {
  if (!state || state === "all" || !locationData[state]) return [];

  if (!district) return [];

  // ALL districts → all constituencies of state
  if (district === "all") {
    return Object.values(locationData[state]).flat();
  }

  // Single district
  return locationData[state]?.[district] ?? [];
};

// (optional alias if you still want getAreas)
export const getAreas = getConstituencies;

export default locationData;

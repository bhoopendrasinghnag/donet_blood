
// // Search location (Nominatim)
// export const searchLocationAPI = async (query) => {

//   const res = await fetch(
//     `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
//   );

//   const data = await res.json();

//   return data.map((item) => ({
//     lat: parseFloat(item.lat),
//     lng: parseFloat(item.lon),
//     displayName: item.display_name
//   }));
// };


// // Reverse geocode (Lat → Address)
// export const reverseLocationAPI = async (lat, lng) => {

//   const res = await fetch(
//     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//   );

//   const data = await res.json();

//   return data.display_name;
// };


// // Fetch nearby hospitals (Overpass API)
// export const fetchHospitalsAPI = async (lat, lng) => {

//   const query = `
//   [out:json];
//   (
//     node["amenity"="hospital"](around:5000,${lat},${lng});
//     node["amenity"="clinic"](around:5000,${lat},${lng});
//   );
//   out;
//   `;

//   const res = await fetch(
//     "https://overpass-api.de/api/interpreter",
//     {
//       method: "POST",
//       body: query
//     }
//   );

//   const data = await res.json();

//   return data.elements.map((item) => ({
//     lat: item.lat,
//     lng: item.lon,
//     name: item.tags?.name || "Hospital"
//   }));
// };


// // Fetch nearby blood banks
// export const fetchBloodBanksAPI = async (lat, lng) => {

//   const query = `
//   [out:json];
//   (
//     node["healthcare"="blood_bank"](around:5000,${lat},${lng});
//   );
//   out;
//   `;

//   const res = await fetch(
//     "https://overpass-api.de/api/interpreter",
//     {
//       method: "POST",
//       body: query
//     }
//   );

//   const data = await res.json();

//   return data.elements.map((item) => ({
//     lat: item.lat,
//     lng: item.lon,
//     name: item.tags?.name || "Blood Bank"
//   }));
// };


// ===========================
// SEARCH LOCATION (Nominatim)
// ===========================

export const searchLocationAPI = async (query) => {

  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`;

  const res = await fetch(url);
  const data = await res.json();
console.log("data", data);

  return data.map((item) => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name
  }));
};


// ===========================
// FETCH NEARBY HOSPITALS
// ===========================

export const fetchHospitalsAPI = async (lat, lng) => {

  const query = `
  [out:json];
  (
    node["amenity"="hospital"](around:20000,${lat},${lng});
  );
  out;
  `;

  const res = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query
    }
  );

  const data = await res.json();

  return data.elements.map((item) => ({
    lat: item.lat,
    lng: item.lon,
    name: item.tags?.name || "Hospital"
  }));
};


// ===========================
// FETCH BLOOD BANKS
// ===========================

export const fetchBloodBanksAPI = async (lat, lng) => {

  const query = `
  [out:json];
  (
    node["healthcare"="blood_bank"](around:20000,${lat},${lng});
  );
  out;
  `;

  const res = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query
    }
  );

  const data = await res.json();

  return data.elements.map((item) => ({
    lat: item.lat,
    lng: item.lon,
    name: item.tags?.name || "Blood Bank"
  }));
};
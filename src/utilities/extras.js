export const ammenities = {
  bed: 100,
  pillow: 50,
  comforter: 50,
};

export const tourFeee = {
  day: 50,
  overnight: 100,
};

export function generateRandomDigits() {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function isLocalStorageTruthy() {
  const value = localStorage.getItem("user");
  return !!value; // Convert to boolean: true if truthy, false otherwise
}

export const formatDataWithId = (data) => {
  return data
    ? Object.entries(data).map(([uid, item]) => ({ ...item, id: uid }))
    : [];
};

export function countAndSumAddAmenities(bookings) {
  let totalBeds = 0;
  let totalComforters = 0;
  let totalPillows = 0;

  bookings.forEach((booking) => {
    const addAmenities = booking.addAmenities || {};
    totalBeds += parseInt(addAmenities.beds || 0, 10);
    totalComforters += parseInt(addAmenities.comforter || 0, 10);
    totalPillows += parseInt(addAmenities.pillow || 0, 10);
  });

  return {
    totalBeds: totalBeds,
    totalComforters: totalComforters,
    totalPillows: totalPillows,
  };
}

export function countByProperty(arr, property) {
  const countMap = {};

  arr.forEach((item) => {
    const key = item[property];
    if (key in countMap) {
      countMap[key] += 1;
    } else {
      countMap[key] = 1;
    }
  });

  return countMap;
}

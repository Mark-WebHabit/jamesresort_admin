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

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

module.exports = {
  calculateDistanceKm
};

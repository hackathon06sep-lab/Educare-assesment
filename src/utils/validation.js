const MAX_NAME_LENGTH = 255;
const MAX_ADDRESS_LENGTH = 500;

function normalizeRequiredString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function parseCoordinate(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function validateLatitude(value, fieldName = 'latitude') {
  const parsed = parseCoordinate(value);

  if (parsed === null) {
    return `${fieldName} must be a valid number`;
  }

  if (parsed < -90 || parsed > 90) {
    return `${fieldName} must be between -90 and 90`;
  }

  return null;
}

function validateLongitude(value, fieldName = 'longitude') {
  const parsed = parseCoordinate(value);

  if (parsed === null) {
    return `${fieldName} must be a valid number`;
  }

  if (parsed < -180 || parsed > 180) {
    return `${fieldName} must be between -180 and 180`;
  }

  return null;
}

function validateCoordinates(source = {}) {
  const errors = {};
  const latitudeError = validateLatitude(source.latitude);
  const longitudeError = validateLongitude(source.longitude);

  if (latitudeError) {
    errors.latitude = latitudeError;
  }

  if (longitudeError) {
    errors.longitude = longitudeError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      latitude: parseCoordinate(source.latitude),
      longitude: parseCoordinate(source.longitude)
    }
  };
}

function validateSchoolPayload(payload = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const errors = {};
  const name = normalizeRequiredString(source.name);
  const address = normalizeRequiredString(source.address);
  const coordinates = validateCoordinates(source);

  if (!name) {
    errors.name = 'name is required and must be a non-empty string';
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `name must not exceed ${MAX_NAME_LENGTH} characters`;
  }

  if (!address) {
    errors.address = 'address is required and must be a non-empty string';
  } else if (address.length > MAX_ADDRESS_LENGTH) {
    errors.address = `address must not exceed ${MAX_ADDRESS_LENGTH} characters`;
  }

  Object.assign(errors, coordinates.errors);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      name,
      address,
      latitude: coordinates.value.latitude,
      longitude: coordinates.value.longitude
    }
  };
}

module.exports = {
  parseCoordinate,
  validateCoordinates,
  validateSchoolPayload
};

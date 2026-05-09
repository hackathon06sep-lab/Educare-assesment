const assert = require('node:assert/strict');
const test = require('node:test');

const { validateCoordinates, validateSchoolPayload } = require('../src/utils/validation');

test('validateSchoolPayload accepts valid school payload', () => {
  const result = validateSchoolPayload({
    name: 'Delhi Public School',
    address: 'Mathura Road, New Delhi',
    latitude: 28.594,
    longitude: 77.25
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.value.name, 'Delhi Public School');
});

test('validateSchoolPayload trims strings and parses numeric coordinate strings', () => {
  const result = validateSchoolPayload({
    name: '  City School  ',
    address: '  Sector 12  ',
    latitude: '28.6',
    longitude: '77.2'
  });

  assert.equal(result.isValid, true);
  assert.equal(result.value.name, 'City School');
  assert.equal(result.value.address, 'Sector 12');
  assert.equal(result.value.latitude, 28.6);
  assert.equal(result.value.longitude, 77.2);
});

test('validateSchoolPayload rejects missing strings and invalid coordinates', () => {
  const result = validateSchoolPayload({
    name: '',
    address: '   ',
    latitude: 91,
    longitude: 'west'
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.name, /required/);
  assert.match(result.errors.address, /required/);
  assert.match(result.errors.latitude, /between -90 and 90/);
  assert.match(result.errors.longitude, /valid number/);
});

test('validateSchoolPayload rejects null payload without throwing', () => {
  const result = validateSchoolPayload(null);

  assert.equal(result.isValid, false);
  assert.match(result.errors.name, /required/);
  assert.match(result.errors.address, /required/);
  assert.match(result.errors.latitude, /valid number/);
  assert.match(result.errors.longitude, /valid number/);
});

test('validateCoordinates accepts GET query values as strings', () => {
  const result = validateCoordinates({
    latitude: '12.9716',
    longitude: '77.5946'
  });

  assert.equal(result.isValid, true);
  assert.equal(result.value.latitude, 12.9716);
  assert.equal(result.value.longitude, 77.5946);
});

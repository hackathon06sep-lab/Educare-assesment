const assert = require('node:assert/strict');
const test = require('node:test');

const { calculateDistanceKm } = require('../src/utils/distance');

test('calculateDistanceKm returns zero for identical coordinates', () => {
  assert.equal(calculateDistanceKm(28.6139, 77.209, 28.6139, 77.209), 0);
});

test('calculateDistanceKm returns expected distance between Delhi and Mumbai', () => {
  const distance = calculateDistanceKm(28.6139, 77.209, 19.076, 72.8777);

  assert.ok(distance > 1100);
  assert.ok(distance < 1200);
});

const pool = require('../config/db');
const { calculateDistanceKm } = require('../utils/distance');
const { validateSchoolPayload, validateCoordinates } = require('../utils/validation');

async function addSchool(req, res, next) {
  try {
    const validation = validateSchoolPayload(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { name, address, latitude, longitude } = validation.value;

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function listSchools(req, res, next) {
  try {
    const validation = validateCoordinates(req.query);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { latitude, longitude } = validation.value;
    const [schools] = await pool.execute(
      'SELECT id, name, address, latitude, longitude FROM schools'
    );

    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distanceKm: Number(
          calculateDistanceKm(latitude, longitude, school.latitude, school.longitude).toFixed(3)
        )
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: sortedSchools
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addSchool,
  listSchools
};

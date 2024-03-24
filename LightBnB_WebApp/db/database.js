const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");


// set connection to database
const pool = new Pool({
  user: "jackmacurbeautiful",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // set query for login / email
  return pool.query('SELECT * FROM users WHERE email = $1', [email])
    .then(res => {
      //if more than 0 rows return
      if (res.rows.length > 0) {
        // send first row
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(err => {
      console.error('Query EMAIL error', err.stack);
      return null;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // set query for id - login / stay logged in
  return pool
    .query('SELECT * FROM users WHERE id = $1;', [id])
    .then(res => {
      //if more than 0 rows return
      if (res.rows.length > 0) {
        // send first row
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.error('Query ID error', err.stack);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  // send insert query for CREATING new users
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
    .then(res => {
      // send first row
      return res.rows[0];
    })
    .catch((err) => {
      console.error('Query error', err.stack);
      return null;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
    SELECT reservations.*, properties.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    LEFT JOIN property_reviews ON reservations.id = property_reviews.reservation_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;

  return pool
    .query(queryString, [guest_id, limit])
    .then(res => {
      return res.rows;
    })
    .catch((err) => {
      console.error('Query error', err.stack);
      return null;
    });
};


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // empty array, stores added requests for seach bar
  const queryParams = [];
  // base request query for gathering results from search
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;


  // owner_id lookup
  if (options.owner_id) {
    console.log("Owner ID: ", options.owner_id);
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  // city lookup
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  // minimun and maximum price seach for seach page
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // converted from cents
    queryParams.push(options.maximum_price_per_night * 100); // converted from cents
    // if query seach is clear
    if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $1 AND cost_per_night <= $2 `;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
    }
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // converted from cents
    queryString += `WHERE cost_per_night >= $${queryParams.length} `;
  } else if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // converted from cents
    queryString += `WHERE cost_per_night <= $${queryParams.length} `;
  }

  // minimum rating search query
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    // if this is the only seach query request
    if (queryParams.length === 1) {
      queryString += `WHERE average_rating >= $1 `;
    } else {
      //if this is NOT the only seach query request
      queryString += `AND average_rating >= $${queryParams.length} `;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// query to add properties to database
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  const queryString = `
    INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
    //send search query
  return pool.query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((err) => {
      console.error("Error executing query:", err.stack);
      return null;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

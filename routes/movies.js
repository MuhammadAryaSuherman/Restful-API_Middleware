var express = require('express');
var router = express.Router();
var auth = require('../middleware/authMiddleware.js');
var pool = require('../Database/connect.js');

router.get('/', auth, function (req, res) {
  const limit = 10;
  const offset = req.query.page ? req.query.page * limit : 0;
  pool.query(
    'SELECT * FROM movies LIMIT $1 OFFSET $2',
    [limit, offset],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.json(results.rows);
    }
  );
});

router.get('/:id', auth, async function (req, res) {
  var id = req.params.id;
  var movie = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
  res.json(movie.rows[0]);
});

router.post('/', auth, function (req, res) {
  pool.query(
    'INSERT INTO movies ("title", "genres", "year") VALUES ($1, $2, $3) RETURNING id;',
    [req.body.title, req.body.genres, req.body.year],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).json({
        id: results.rows[0].id,
        status: 'success',
      });
    }
  );
});

router.delete('/:id', auth, function (req, res) {
  pool.query(
    'DELETE FROM movies WHERE id = $1',
    [req.params.id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).json({
        status: 'success',
      });
    }
  );
});

router.put('/:id', auth, function (req, res) {
  pool.query(
    'UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4',
    [req.body.title, req.body.genres, req.body.year, req.params.id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).json({
        status: 'success',
      });
    }
  );
});

module.exports = router;

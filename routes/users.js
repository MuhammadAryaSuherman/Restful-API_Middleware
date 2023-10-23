var express = require('express');
var router = express.Router();
var auth = require('../middleware/authMiddleware.js');
var pool = require('../Database/connect.js');
var { signToken } = require('../middleware/auth.js');

router.get('/', auth, function (req, res) {
  const limit = 10;
  const offset = req.query.page ? req.query.page * limit : 0;
  pool.query(
    'SELECT * FROM users LIMIT $1 OFFSET $2',
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


router.get('/:id', function (req, res) {
  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [req.params.id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  );
});


router.post('/login', (req, res) => {
  pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [req.body.email, req.body.password],
    (error, results) => {
      if (error) {
        throw error;
      } else if (results.rows.length > 0) {
        const user = results.rows[0];
        if (user) {
          const token = signToken(user);
          res.json({
            message: 'Login successful!',
            token: token,
          });
        } else {
          res.status(401).json({ message: 'Login failed! Invalid email or password.' });
        }
      } else {
        res.status(401).json({ message: 'Login failed! Invalid email or password.' });
      }
    }
  );
});

router.post('/register', (req, res) => {
  pool.query(
    'INSERT INTO users (email, gender, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.body.email, req.body.gender, req.body.password, req.body.role],
    (error, results) => {
      if (error) {
        res.status(400).json({ message: 'Registration failed! ' + error.message });
      } else {
        const token = signToken(results.rows[0]);
        res.json({
          message: 'Registration successful!',
          token: token,
        });
      }
    }
  );
});


router.delete('/:id', function (req, res) {
  pool.query(
    'DELETE FROM users WHERE id = $1',
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


router.put('/:id', function (req, res) {
  pool.query(
    'UPDATE users SET email = $1, gender = $2, password = $3, role = $4 WHERE id = $5',
    [req.body.email, req.body.gender, req.body.password, req.body.role, req.params.id],
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

const bcrypt = require("bcrypt");

const db = require("../config/db");

const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    // 1. Destructure 'role' out of the incoming request body
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Missing required fields: name, email, and password are required.",
      });
    }

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 2. Set a default fallback role so it defaults to 'customer' if empty
    const userRole = role || "customer";

    // 3. Changed 'customer' to ? and added userRole to the parameters array
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, userRole],
    );

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      `SELECT id, name, email, password_hash, role

FROM users

WHERE email = ?`,

      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(
      password,

      user.password_hash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      id: user.id,

      role: user.role,
    });

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,

  login,
};

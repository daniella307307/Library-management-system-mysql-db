const pool = require('../config/databaseConfig');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/emailVerification");
require("dotenv").config();
const generateVerificationToken = require("../utils/jwtUtils");

const register = async (request, response) => {
  const { email, password, firstname, lastname, confirmPassword, isVerified = false } = request.body;
  const user = { email, firstname, lastname, password};
  try {
    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (email, firstname, lastname, password, is_verified) VALUES (?, ?, ?, ?, ?)",
        [email, firstname, lastname, hashedPassword, isVerified]
      );
      const token = generateVerificationToken(user);
      console.log(token);
      const sendEmail = await sendVerificationEmail(user, token);
      console.log("Send email", sendEmail);
      if (!sendEmail) {
        return response.status(500).json({ message: "Failed to send verification email" });
        }
        res.status(200).json({ message: "Verification email sent!" });
      return response.status(201).json({ message: "User registered", token });
       
    } else {
      return response.status(400).json({ message: "Passwords do not match" });
    }
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "User not found in the database" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET , { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        return res.status(200).json({ message: "Logged in successfully" ,token});
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
      const user = rows[0];
      if (!user) {
        return res.status(400).json({ message: "User not found in the database" });
      }else{
        const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
        if (result.affectedRows > 0) {
          return res.status(200).json({ message: "User deleted successfully" });
        } else {
          return res.status(400).json({ message: "Failed to delete user" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, firstname, lastname, password } = req.body;
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
      const user = rows[0];
      if (!user) {
        return res.status(400).json({ message: "User not found in the database" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
          "UPDATE users SET email=?, firstname=?, lastname=?, password=? WHERE id=?",
          [email, firstname, lastname, hashedPassword, id]
        );
        if (result.affectedRows > 0) {
          return res.status(200).json({ message: "User updated successfully" });
        } else {
          return res.status(400).json({ message: "Failed to update user" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
const findByEmail = async (req,res) => {
  const {email} = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE email= ?", [email]);
  return rows.length > 0 ? res.status(200).json({message:"User found", user: rows[0]}) : res.status(404).json({message:"User not found"});
};

const verifyEmail = async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        const email = decoded.email;
        const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.is_verified) {
            return res.status(400).json({ message: "Email already verified" });
        }
        const result = await sendVerificationEmail(user, token);
        if (!result) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }else{
            await pool.query("UPDATE users SET is_verified = ? WHERE email = ?", [true, email]);
            const [updateUser] = await pool.query("UPDATE users SET is_verified = ? WHERE email = ?", [true, email]);
            if (updateUser.affectedRows > 0) {
                return res.status(200).json({ message: "Email verified successfully" });
            } else {
                return res.status(400).json({ message: "Failed to verify email" });
            }
        }
        
    } catch (err) {
        res.status(400).send("Invalid or expired token.");
    }
};
const getAllUsers= async(req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: "User not found in the database" });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const addManyUsers = async(req,res)=>{
    const users = req.body;
    console.log(users);
    try {
        const values = users.map(user => [user.email, user.firstname, user.lastname, user.password]);
        const [result] = await pool.query(
            "INSERT INTO users (email, firstname, lastname, password) VALUES ?",
            [values]
        );
        return res.status(201).json({ message: "Users added successfully", userId: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
  register,
  login,
  findByEmail,
  verifyEmail,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
  addManyUsers
};

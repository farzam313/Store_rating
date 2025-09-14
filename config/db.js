const { Sequelize } = require("sequelize");
require("dotenv").config();
const mysql = require("mysql2/promise");

let sequelize;

const createDatabaseIfNotExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // Create DB if it does not exist
    const [results] = await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );

    if (results.warningStatus === 0) {
      console.log(`✅ Database "${process.env.DB_NAME}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${process.env.DB_NAME}" already exists.`);
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Error creating database:", error);
  }
};

const connectDB = async () => {
  try {
    // First ensure DB exists
    await createDatabaseIfNotExists();

    // Then connect with Sequelize
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // or console.log to see queries
      }
    );

    await sequelize.authenticate();
    console.log("🚀 MySQL connection has been established successfully.");
    // Sync all defined models (create tables automatically if they don’t exist)
    await sequelize.sync({ alter: true });
    console.log("📦 All models were synchronized (tables created/updated).");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };

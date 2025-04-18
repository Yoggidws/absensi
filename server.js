const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const { errorHandler } = require("./src/middlewares/errorMiddleware")
const { testConnection } = require("./src/config/db")

// Load environment variables
dotenv.config()

// Initialize Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Test database connection
testConnection()

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"))
app.use("/api/attendance", require("./src/routes/attendanceRoutes"))

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

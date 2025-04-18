const nodemailer = require("nodemailer")

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 */
exports.sendWelcomeEmail = async (user) => {
  // Skip in test environment
  if (process.env.NODE_ENV === "test") return

  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Welcome to Attendance System",
      html: `
        <h1>Welcome to Attendance System</h1>
        <p>Hello ${user.name},</p>
        <p>Your account has been created successfully.</p>
        <p>You can now log in to the system using your email and password.</p>
        <p>Thank you for joining us!</p>
      `,
    })
  } catch (error) {
    console.error("Email sending failed:", error)
  }
}

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetUrl - Password reset URL
 */
exports.sendPasswordResetEmail = async (user, resetUrl) => {
  // Skip in test environment
  if (process.env.NODE_ENV === "test") return

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: "Password Reset",
    html: `
      <h1>Password Reset</h1>
      <p>Hello ${user.name},</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  })
}

/**
 * Send attendance confirmation email
 * @param {Object} user - User object
 * @param {Object} attendance - Attendance record
 */
exports.sendAttendanceConfirmationEmail = async (user, attendance) => {
  // Skip in test environment
  if (process.env.NODE_ENV === "test") return

  try {
    const transporter = createTransporter()

    const timestamp = new Date(attendance.timestamp).toLocaleString()
    const type = attendance.type === "check-in" ? "Check-in" : "Check-out"

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: `Attendance ${type} Confirmation`,
      html: `
        <h1>Attendance ${type} Confirmation</h1>
        <p>Hello ${user.name},</p>
        <p>Your ${type.toLowerCase()} has been recorded successfully.</p>
        <p><strong>Time:</strong> ${timestamp}</p>
        <p><strong>Status:</strong> ${attendance.status}</p>
        ${attendance.notes ? `<p><strong>Notes:</strong> ${attendance.notes}</p>` : ""}
        <p>Thank you!</p>
      `,
    })
  } catch (error) {
    console.error("Email sending failed:", error)
  }
}

/**
 * Send location alert email to admins
 * @param {Array} adminEmails - Array of admin email addresses
 * @param {Object} user - User object
 * @param {Object} attendanceData - Attendance data
 */
exports.sendLocationAlertEmail = async (adminEmails, user, attendanceData) => {
  // Skip in test environment
  if (process.env.NODE_ENV === "test") return

  try {
    const transporter = createTransporter()

    const timestamp = new Date(attendanceData.timestamp).toLocaleString()
    const type = attendanceData.type === "check-in" ? "Check-in" : "Check-out"

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: adminEmails.join(","),
      subject: `Suspicious Location Alert - ${user.name}`,
      html: `
        <h1>Suspicious Location Alert</h1>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Action:</strong> ${type}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
        <p><strong>Location:</strong> Latitude: ${attendanceData.location.latitude}, Longitude: ${attendanceData.location.longitude}</p>
        <p><strong>IP Address:</strong> ${attendanceData.ipAddress}</p>
        <p><strong>Device Info:</strong> ${attendanceData.deviceInfo || "Not provided"}</p>
        <p>This location is outside the allowed radius for attendance.</p>
      `,
    })
  } catch (error) {
    console.error("Email sending failed:", error)
  }
}

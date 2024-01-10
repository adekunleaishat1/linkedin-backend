const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    receiveremail: {
        type: String,  // Assuming you have a User model and each notification has a receiver
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
})

const notificationmodel = mongoose.model("notification_collection", notificationSchema)
module.exports = notificationmodel
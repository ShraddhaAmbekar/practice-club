const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AuthUser = require("./models/AuthUser");

 const MONGO_URI = process.env.MONGO_URI
const users = [
  {
    name: "Main Management",
    username: "admin",
    password: "Admin@123",
    role: "admin",
  },

  {
    name: "Data Entry User 1",
    username: "entry01",
    password: "Entry@101",
    role: "data_entry",
  },

  {
    name: "Data Entry User 2",
    username: "entry02",
    password: "Entry@102",
    role: "data_entry",
  },

  {
    name: "Data Entry User 3",
    username: "entry03",
    password: "Entry@103",
    role: "data_entry",
  },

  {
    name: "Data Entry User 4",
    username: "entry04",
    password: "Entry@104",
    role: "data_entry",
  },

  {
    name: "Data Entry User 5",
    username: "entry05",
    password: "Entry@105",
    role: "data_entry",
  },

  {
    name: "Club Anchor",
    username: "anchor",
    password: "Anchor@123",
    role: "anchor",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    await AuthUser.deleteMany({});

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        10
      );

      await AuthUser.create({
        name: user.name,
        username: user.username,
        password: hashedPassword,
        role: user.role,
      });
    }

    console.log("All users created successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedUsers();
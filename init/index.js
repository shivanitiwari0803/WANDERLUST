const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Category options
const categories = [
  "Beaches",
  "Camping",
  "Mountains",
  "Desert",
  "Safari",
  "Forest",
  "Iconic Cities",
  "Villages",
  "Cities"
];



main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // Add owner and random category to each listing
  initData.data = initData.data.map((obj) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return {
      ...obj,
      owner: "6874e459259b3375eebaa259",
      category: randomCategory
    };
  });

  await Listing.insertMany(initData.data);
  console.log("Data was initialized with random categories ✅");
};

initDB();

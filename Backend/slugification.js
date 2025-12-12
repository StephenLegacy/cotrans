// slugification.js
import mongoose from "mongoose";
import Job from "./src/models/Job.js";
import slugify from "slugify";
import dotenv from "dotenv"

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  const jobs = await Job.find({});
  for (const job of jobs) {
    job.slug = slugify(job.title, { lower: true, strict: true });
    await job.save();
    console.log(`Updated slug for: ${job.title}`);
  }

  console.log("All slugs updated successfully");
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

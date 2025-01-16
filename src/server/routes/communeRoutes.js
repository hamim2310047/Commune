import express from "express";

import multer from "multer";
import { body } from "express-validator";

import {
  createCommune,
  getUserCommunes,
  getUserCommunesByCommuneId,
  updateCommune,
  getAllCommunes,
  deleteCommune,
  getCommuneUserStatus,
  getJoinedCommunes,
  joinCommune,
  getCommuneReviews,
  setCommuneReview,
  //posts
  createCommunePostBlog,
  getCommunePosts,
  deleteCommunePost,
  updateCommunePost,
  //lists
  createCommunePostListing,
  getCommuneListings,
  getCommuneListing,
  getCommuneSmallInfo,
  //events
  createCommuneEvent,
  getCommuneEvents,
  getCommuneEvent,
  deleteCommuneEvent,
  updateCommuneEvent,
  collaborationPost,
  getCommunePost,
  // getCommunesByCommuneId,
} from "../controllers/communeController.js";

import { validateToken } from "../middleware/auth.js";

import path from "path";

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/commune_images/"); // Folder where the file will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, req.user.id + "-" + Date.now() + ext); // Custom file naming
  },
});

// Multer middleware for single file upload
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, png, jpg, gif)"));
    }
  },
}).single("commune_image");

router.post(
  "/create",
  validateToken,
  upload,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  createCommune
);

// Configure Multer storage
const storageEvent = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/commune_images/events/"); // Folder where the file will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, req.user.id + "-" + Date.now() + ext); // Custom file naming
  },
});

// Multer middleware for single file upload
export const uploadEvent = multer({
  storage: storageEvent,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, png, jpg, gif)"));
    }
  },
}).single("eventImage");

// Example route for fetching user's communes
router.get("/all", getAllCommunes);
router.post("/collaboration/post", validateToken, collaborationPost);
// router.get("/communes/c/:communeid", getCommunesByCommuneId);
router.get("/joined/:userId", validateToken, getJoinedCommunes);
router.get("/communes/:communeid", getUserCommunesByCommuneId);
router.get("/communes/info/:communeid", getCommuneSmallInfo);
//post
router.get("/post/:postid", getCommunePost);
router.put("/post/:postid", validateToken, updateCommunePost);
router.delete("/post/:postid", deleteCommunePost);
//event
router.get("/event/:eventid", getCommuneEvent);
router.put("/event/:eventid", validateToken, uploadEvent, updateCommuneEvent);
router.delete("/event/:eventid", deleteCommuneEvent);
//list
router.get("/list/:listid", getCommuneListing);

router.get("/:commune_id/reviews", getCommuneReviews);
router.get("/:communeid/posts", getCommunePosts);
router.get("/:communeid/events", getCommuneEvents);
//list
router.get("/:communeid/lists", getCommuneListings);

router.get("/:username", getUserCommunes);
// Route to add a review to a commune
router.post("/:communeid/reviews", validateToken, setCommuneReview);
// POST route to create a new post (listing)
router.post("/:communeid/listings", validateToken, createCommunePostListing);

router.post("/create/:communeId/post", validateToken, createCommunePostBlog);

router.post(
  "/create/:communeid/event",
  validateToken,
  uploadEvent,
  createCommuneEvent
);
router.post("/membership/:communeId/join", validateToken, joinCommune);
router.delete("/delete/:communeid", validateToken, deleteCommune);

// Route: GET /api/commune/:communeId/:userId
router.get(
  "/membership/:communeId/:userId",
  validateToken,
  getCommuneUserStatus
);

router.put(
  "/:communeid",
  validateToken,
  upload,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  updateCommune
);

export default router;

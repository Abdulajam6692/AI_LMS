const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lms",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Student Login
app.post("/student/login", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res
      .status(400)
      .json({ success: false, error: "Missing name or email" });

  const query = "SELECT id FROM users WHERE name = ? AND email = ?";
  db.query(query, [name, email], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "Failed to authenticate" });
    if (results.length === 0)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });

    const studentId = results[0].id;
    res.json({ success: true, studentId });
  });
});

// Admin Login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Username and password required." });

  const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    if (results.length > 0)
      return res.json({ success: true, message: "Login successful." });
    else
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password." });
  });
});

// Add Course
app.post("/admin/add-course", (req, res) => {
  const { courseName, description } = req.body;
  const query = "INSERT INTO courses (name, description) VALUES (?, ?)";
  db.query(query, [courseName, description], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error adding course." });
    res.json({ success: true, message: "Course added successfully." });
  });
});

// Remove Course
app.delete("/admin/remove-course/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM courses WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error removing course." });
    res.json({ success: true, message: "Course removed successfully." });
  });
});

/*// Add Content
app.post("/admin/add-content", (req, res) => {
  const { courseId, title, videoUrl, downloadableMaterial } = req.body;
  const query =
    "INSERT INTO lessons (course_id, title, video_url, downloadable_material) VALUES (?, ?, ?, ?)";
  db.query(query, [courseId, title, videoUrl, downloadableMaterial], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error adding content." });
    res.json({ success: true, message: "Content added successfully." });
  });
});
*/

// Route to handle adding new content (already implemented)
app.post("/admin/add-content", (req, res) => {
  const { courseId, title, downloadableMaterial } = req.body;
  
  const query =
    "INSERT INTO lessons (course_id, title, downloadable_material) VALUES (?, ?, ?)";
    
  db.query(query, [courseId, title, downloadableMaterial], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error adding content." });
    res.json({ success: true, message: "Content added successfully." });
  });
});

// Route to fetch transcription from Flask and serve it
app.get("/download/", async (req, res) => {
  try {
    // Make a request to your Flask server to get the transcription text
    const response = await axios.get("http://localhost:5001/download/");
    
    // If Flask responds with transcription, send it as downloadable text file
    if (response.data.transcription) {
      const transcription = response.data.transcription;

      // Set headers to download the transcription as a file
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename=transcription.txt");

      // Send the transcription text as the response
      res.send(transcription);
    } else {
      res.status(404).json({ error: "No transcription found." });
    }
  } catch (error) {
    console.error("Error fetching transcription from Flask:", error);
    res.status(500).json({ error: "Failed to fetch transcription." });
  }
});


// Remove Content (Check table name!)
app.delete("/admin/remove-content/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM lessons WHERE id = ?"; // Fixed: was 'course_content'
  db.query(query, [id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error removing content." });
    res.json({ success: true, message: "Content removed successfully." });
  });
});

// Fetch All Courses
app.get("/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Error fetching courses." });
    res.json(results);
  });
});

// Fetch Available Courses (not enrolled)
app.get("/student/:id/available-courses", (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT * FROM courses 
    WHERE id NOT IN (SELECT course_id FROM enrollments WHERE user_id = ?)
  `;
  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Enroll Student
app.post("/student/:id/enroll", (req, res) => {
  const studentId = req.params.id;
  const { courseId } = req.body;
  if (!courseId)
    return res.status(400).json({ error: "Course ID is required" });

  const query = "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";
  db.query(query, [studentId, courseId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ success: true, message: "Enrolled successfully!" });
  });
});
// Doubt Solver Route
app.post("/api/ask-doubt", async (req, res) => {
  const { description } = req.body;
  if (!description || description.trim() === "") {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const flaskResponse = await axios.post("http://localhost:5001/solve", {
      description: description,
    });

    const { answer } = flaskResponse.data;
    return res.json({ solution: answer }); // ✅ Unified response key
  } catch (error) {
    console.error("Error communicating with Flask backend:", error.message);
    return res.status(500).json({ error: "Failed to process the doubt" });
  }
});

// Fetch Lessons for Enrolled Courses
app.get("/student/:id/enrolled-lessons", (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT lessons.* FROM lessons 
    INNER JOIN enrollments ON lessons.course_id = enrollments.course_id 
    WHERE enrollments.user_id = ?
  `;
  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Enrolled Courses List
app.get("/student/:id/enrolled-courses", (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT courses.* FROM courses
    INNER JOIN enrollments ON courses.id = enrollments.course_id
    WHERE enrollments.user_id = ?;
  `;
  db.query(query, [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Lessons with Completion Status
app.get("/student/:id/lessons/:courseId", (req, res) => {
  const studentId = req.params.id;
  const courseId = req.params.courseId;
  const query = `
    SELECT l.*, IFNULL(p.completed, 0) AS isCompleted 
    FROM lessons l
    LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
    WHERE l.course_id = ? AND l.course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = ?
    );
  `;
  db.query(query, [studentId, courseId, studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Update Lesson Progress
app.post("/student/:studentId/lesson/:lessonId/:action", (req, res) => {
  const { studentId, lessonId, action } = req.params;
  const checkQuery =
    "SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?";

  db.query(checkQuery, [studentId, lessonId], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).json({ error: "Database error" });

    let query, params;
    if (checkResults.length > 0) {
      query =
        "UPDATE progress SET completed = ? WHERE user_id = ? AND lesson_id = ?";
      params = [action === "complete" ? 1 : 0, studentId, lessonId];
    } else {
      query =
        "INSERT INTO progress (user_id, lesson_id, completed) VALUES (?, ?, ?)";
      params = [studentId, lessonId, action === "complete" ? 1 : 0];
    }

    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, message: `Lesson marked as ${action}` });
    });
  });
});

// Course Progress Overview
app.get("/student/:id/course-progress", (req, res) => {
  const studentId = req.params.id;
  const query = `
    SELECT 
      c.id AS course_id, 
      COUNT(l.id) AS totalLessons,
      SUM(CASE WHEN p.completed = 1 THEN 1 ELSE 0 END) AS completedLessons
    FROM 
      courses c
      JOIN lessons l ON c.id = l.course_id
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
    WHERE 
      c.id IN (SELECT course_id FROM enrollments WHERE user_id = ?)
    GROUP BY 
      c.id
  `;
  db.query(query, [studentId, studentId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const progress = {};
    results.forEach((row) => {
      progress[row.course_id] = {
        totalLessons: row.totalLessons,
        completedLessons: row.completedLessons,
      };
    });

    res.json(progress);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

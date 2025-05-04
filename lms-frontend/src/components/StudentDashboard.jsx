/*
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState({});

  // Doubt related states
  const [doubtText, setDoubtText] = useState("");
  const [doubtResponse, setDoubtResponse] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/student/${studentId}/available-courses`)
      .then((response) => setAvailableCourses(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`http://localhost:5000/student/${studentId}/enrolled-courses`)
      .then((response) => setEnrolledCourses(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`http://localhost:5000/student/${studentId}/course-progress`)
      .then((response) => setProgress(response.data))
      .catch((error) => console.error(error));
  }, [studentId]);

  const enrollCourse = (courseId) => {
    axios
      .post(`http://localhost:5000/student/${studentId}/enroll`, { courseId })
      .then((response) => {
        setMessage(response.data.message);
        setAvailableCourses((prev) =>
          prev.filter((course) => course.id !== courseId)
        );
        setEnrolledCourses((prev) => [
          ...prev,
          availableCourses.find((course) => course.id === courseId),
        ]);
      })
      .catch((error) => console.error(error));
  };

  const fetchLessons = (courseId) => {
    axios
      .get(`http://localhost:5000/student/${studentId}/lessons/${courseId}`)
      .then((response) => {
        setLessons(response.data);
        setSelectedCourseId(courseId);
      })
      .catch((error) => console.error(error));
  };

  const toggleLessonCompletion = (lessonId, isCompleted) => {
    const action = isCompleted ? "incomplete" : "complete";
    axios
      .post(
        `http://localhost:5000/student/${studentId}/lesson/${lessonId}/${action}`
      )
      .then((response) => {
        setMessage(response.data.message);
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, isCompleted: !isCompleted }
              : lesson
          )
        );

        setProgress((prevProgress) => {
          const courseId = selectedCourseId;
          const courseProgress = prevProgress[courseId];
          if (courseProgress) {
            return {
              ...prevProgress,
              [courseId]: {
                ...courseProgress,
                completedLessons: isCompleted
                  ? courseProgress.completedLessons - 1
                  : courseProgress.completedLessons + 1,
              },
            };
          }
          return prevProgress;
        });
      })
      .catch((error) => console.error(error));
  };

  const calculateProgress = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    const totalLessons = courseProgress.totalLessons;
    const completedLessons = courseProgress.completedLessons;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  // 📍 This was missing and causing error
  const handleTextChange = (e) => {
    setDoubtText(e.target.value);
  };

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) {
      setMessage("Please type your doubt.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/ask-doubt", {
        description: doubtText,
      });

      setDoubtResponse(response.data.solution);
      setDoubtText("");
    } catch (error) {
      console.error(error);
      setDoubtResponse(
        "Oops! Something went wrong while resolving your doubt."
      );
    }
  };

  return (
    <div className="student-dashboard">
      <h1 className="dashboard-title">Student Dashboard</h1>
      {message && <p className="message">{message}</p>}

    
      <h2 className="section-title">Available Courses</h2>
      {availableCourses.length > 0 ? (
        availableCourses.map((course) => (
          <div key={course.id} className="course-item">
            <h3 className="course-name">{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <button
              onClick={() => enrollCourse(course.id)}
              className="enroll-button"
            >
              Enroll
            </button>
          </div>
        ))
      ) : (
        <p>No courses available for enrollment.</p>
      )}

     
      <h2 className="section-title">Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        enrolledCourses.map((course) => (
          <div key={course.id} className="course-item">
            <button
              onClick={() => fetchLessons(course.id)}
              className={`enrolled-course-button ${
                selectedCourseId === course.id ? "active" : ""
              }`}
            >
              {course.name}
            </button>
            <div>
              <progress
                value={calculateProgress(course.id)}
                max={100}
                className="progress-bar"
              />
              <span className="progress-text">
                {calculateProgress(course.id).toFixed(2)}% Complete
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No courses enrolled yet.</p>
      )}

     
      <h2 className="section-title">Lessons for Selected Course</h2>
      {lessons.length > 0 ? (
        lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-item">
            <h3 className="lesson-title">{lesson.title}</h3>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${
                  lesson.video_url.split("v=")[1]
                }`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              ></iframe>
            </div>
            <a
              href={lesson.downloadable_material}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              Download Material
            </a>
            <button
              onClick={() =>
                toggleLessonCompletion(lesson.id, lesson.isCompleted)
              }
              className={`toggle-completion-button ${
                lesson.isCompleted ? "incomplete" : "complete"
              }`}
            >
              {lesson.isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        ))
      ) : selectedCourseId ? (
        <p>No lessons available for this course.</p>
      ) : (
        <p>Select a course to view lessons.</p>
      )}

      <button onClick={() => navigate("/quiz")} className="quiz-button">
        Take Quiz
      </button>

      <h2 className="section-title">Ask a Doubt</h2>
      <form
        onSubmit={handleDoubtSubmit}
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Type your doubt below:</label>
        <textarea
          placeholder="Type your doubt here..."
          value={doubtText}
          onChange={handleTextChange}
          style={{ padding: "10px", resize: "vertical", minHeight: "80px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Doubt
        </button>
      </form>

      {doubtResponse && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
          }}
        >
          <h3>AI's Answer:</h3>
          <p>{doubtResponse}</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
*/
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState({});

  // Doubt related states
  const [doubtText, setDoubtText] = useState("");
  const [doubtResponse, setDoubtResponse] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/student/${studentId}/available-courses`)
      .then((response) => setAvailableCourses(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`http://localhost:5000/student/${studentId}/enrolled-courses`)
      .then((response) => setEnrolledCourses(response.data))
      .catch((error) => console.error(error));

    axios
      .get(`http://localhost:5000/student/${studentId}/course-progress`)
      .then((response) => setProgress(response.data))
      .catch((error) => console.error(error));
  }, [studentId]);

  const enrollCourse = (courseId) => {
    axios
      .post(`http://localhost:5000/student/${studentId}/enroll`, { courseId })
      .then((response) => {
        setMessage(response.data.message);
        setAvailableCourses((prev) =>
          prev.filter((course) => course.id !== courseId)
        );
        setEnrolledCourses((prev) => [
          ...prev,
          availableCourses.find((course) => course.id === courseId),
        ]);
      })
      .catch((error) => console.error(error));
  };

  const fetchLessons = (courseId) => {
    axios
      .get(`http://localhost:5000/student/${studentId}/lessons/${courseId}`)
      .then((response) => {
        setLessons(response.data);
        setSelectedCourseId(courseId);
      })
      .catch((error) => console.error(error));
  };

  const toggleLessonCompletion = (lessonId, isCompleted) => {
    const action = isCompleted ? "incomplete" : "complete";
    axios
      .post(
        `http://localhost:5000/student/${studentId}/lesson/${lessonId}/${action}`
      )
      .then((response) => {
        setMessage(response.data.message);
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, isCompleted: !isCompleted }
              : lesson
          )
        );

        setProgress((prevProgress) => {
          const courseId = selectedCourseId;
          const courseProgress = prevProgress[courseId];
          if (courseProgress) {
            return {
              ...prevProgress,
              [courseId]: {
                ...courseProgress,
                completedLessons: isCompleted
                  ? courseProgress.completedLessons - 1
                  : courseProgress.completedLessons + 1,
              },
            };
          }
          return prevProgress;
        });
      })
      .catch((error) => console.error(error));
  };

  const calculateProgress = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    const totalLessons = courseProgress.totalLessons;
    const completedLessons = courseProgress.completedLessons;
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const handleTextChange = (e) => {
    setDoubtText(e.target.value);
  };

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) {
      setMessage("Please type your doubt.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/ask-doubt", {
        description: doubtText,
      });

      setDoubtResponse(response.data.solution);
      setDoubtText("");
    } catch (error) {
      console.error(error);
      setDoubtResponse(
        "Oops! Something went wrong while resolving your doubt."
      );
    }
  };

  return (
    <div className="student-dashboard">
      <h1 className="dashboard-title">Student Dashboard</h1>
      {message && <p className="message">{message}</p>}

      <h2 className="section-title">Available Courses</h2>
      {availableCourses.length > 0 ? (
        availableCourses.map((course) => (
          <div key={course.id} className="course-item">
            <h3 className="course-name">{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <button
              onClick={() => enrollCourse(course.id)}
              className="enroll-button"
            >
              Enroll
            </button>
          </div>
        ))
      ) : (
        <p>No courses available for enrollment.</p>
      )}

      <h2 className="section-title">Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        enrolledCourses.map((course) => (
          <div key={course.id} className="course-item">
            <button
              onClick={() => fetchLessons(course.id)}
              className={`enrolled-course-button ${
                selectedCourseId === course.id ? "active" : ""
              }`}
            >
              {course.name}
            </button>
            <div>
              <progress
                value={calculateProgress(course.id)}
                max={100}
                className="progress-bar"
              />
              <span className="progress-text">
                {calculateProgress(course.id).toFixed(2)}% Complete
              </span>
            </div>
          </div>
        ))
      ) : (
        <p>No courses enrolled yet.</p>
      )}

      <h2 className="section-title">Lessons for Selected Course</h2>
      {lessons.length > 0 ? (
        lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-item">
            <h3 className="lesson-title">{lesson.title}</h3>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${
                  lesson.video_url.split("v=")[1]
                }`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              ></iframe>
            </div>
            <a
              href={`http://localhost:5000/download/${lesson.downloadable_material}`} // Correct file path
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
              download // Add this to make sure it triggers a download
            >
              Download Material
            </a>
            <button
              onClick={() =>
                toggleLessonCompletion(lesson.id, lesson.isCompleted)
              }
              className={`toggle-completion-button ${
                lesson.isCompleted ? "incomplete" : "complete"
              }`}
            >
              {lesson.isCompleted ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        ))
      ) : selectedCourseId ? (
        <p>No lessons available for this course.</p>
      ) : (
        <p>Select a course to view lessons.</p>
      )}

      <button onClick={() => navigate("/quiz")} className="quiz-button">
        Take Quiz
      </button>

      <h2 className="section-title">Ask a Doubt</h2>
      <form
        onSubmit={handleDoubtSubmit}
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Type your doubt below:</label>
        <textarea
          placeholder="Type your doubt here..."
          value={doubtText}
          onChange={handleTextChange}
          style={{ padding: "10px", resize: "vertical", minHeight: "80px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#1976d2",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Doubt
        </button>
      </form>

      {doubtResponse && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f1f1f1",
            borderRadius: "8px",
          }}
        >
          <h3>AI's Answer:</h3>
          <p>{doubtResponse}</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

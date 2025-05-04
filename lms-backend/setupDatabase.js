const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});


connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");

  //! Step 1: Create the Database
  connection.query("CREATE DATABASE IF NOT EXISTS lms", (err) => {
    if (err) throw err;
    console.log('Database "lms" created or already exists.');


    connection.query("USE lms", (err) => {
      if (err) throw err;

      //! Step 2: Create Tables
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );
      `;
      const createCoursesTable = `
        CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL
        );
      `;
      const createLessonsTable = `
        CREATE TABLE IF NOT EXISTS lessons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          course_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          video_url TEXT NOT NULL,
          downloadable_material TEXT NOT NULL,
          FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        );
      `;
      const createEnrollmentsTable = `
        CREATE TABLE IF NOT EXISTS enrollments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          course_id INT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        );
      `;
      const createProgressTable = `
        CREATE TABLE IF NOT EXISTS progress (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          lesson_id INT NOT NULL,
          completed BOOLEAN DEFAULT false,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
        );
      `;
      const createAdminTable = `
        CREATE TABLE IF NOT EXISTS admin (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `;

      connection.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log('Table "users" created or already exists.');

        connection.query(createCoursesTable, (err) => {
          if (err) throw err;
          console.log('Table "courses" created or already exists.');

          connection.query(createLessonsTable, (err) => {
            if (err) throw err;
            console.log('Table "lessons" created or already exists.');

            connection.query(createEnrollmentsTable, (err) => {
              if (err) throw err;
              console.log('Table "enrollments" created or already exists.');

              connection.query(createProgressTable, (err) => {
                if (err) throw err;
                console.log('Table "progress" created or already exists.');

                connection.query(createAdminTable, (err) => {
                  if (err) throw err;
                  console.log('Table "admin" created or already exists.');

                  //! Step 3: Insert Sample Data
                  const insertUsers = `
                    INSERT INTO users (name, email) VALUES 
                    ('Alice', 'alice@example.com'),
                    ('Bob', 'bob@example.com'),
                    ('Aditya', 'adityakhatawkar2@gmail.com'),
                    ('Test', 'test@gmail.com');
                  `;
                  connection.query(insertUsers, (err) => {
                    if (err) throw err;
                    console.log("Sample users inserted.");

                    const insertCourses = `
                      INSERT INTO courses (name, description) VALUES 
                      ('React Basics', 'Learn the fundamentals of React.'),
                      ('Node.js Fundamentals', 'Master backend development with Node.js.');
                    `;
                    connection.query(insertCourses, (err) => {
                      if (err) throw err;
                      console.log("Sample courses inserted.");

                      const insertLessons = `
                        INSERT INTO lessons (course_id, title, video_url, downloadable_material) VALUES 
                        (1, 'Introduction to React', 'https://www.youtube.com/watch?v=s2skans2dP4', 'https://docs.google.com/document/d/1FV1ICj9eEC1WamE5dfblqEkrIEiNVz57/edit?usp=sharing&ouid=101271889774786993377&rtpof=true&sd=true'),
                        (1, 'State and Props', 'https://www.youtube.com/watch?v=uvEAvxWvwOs', 'https://docs.google.com/document/d/1FV1ICj9eEC1WamE5dfblqEkrIEiNVz57/edit?usp=sharing&ouid=101271889774786993377&rtpof=true&sd=true'),
                        (2, 'Getting Started with Node.js', 'https://www.youtube.com/watch?v=ENrzD9HAZK4', 'https://docs.google.com/document/d/1FV1ICj9eEC1WamE5dfblqEkrIEiNVz57/edit?usp=sharing&ouid=101271889774786993377&rtpof=true&sd=true');
                      `;
                      connection.query(insertLessons, (err) => {
                        if (err) throw err;
                        console.log("Sample lessons inserted.");

                        const insertEnrollments = `
                          INSERT INTO enrollments (user_id, course_id) VALUES 
                          (1, 1),
                          (2, 2),
                          (3, 2),
                          (4, 1);
                        `;
                        connection.query(insertEnrollments, (err) => {
                          if (err) throw err;
                          console.log("Sample enrollments inserted.");

                          const insertProgress = `
                            INSERT INTO progress (user_id, lesson_id, completed) VALUES 
                            (1, 1, true),
                            (1, 2, false),
                            (2, 3, true);
                          `;
                          connection.query(insertProgress, (err) => {
                            if (err) throw err;
                            console.log("Sample progress inserted.");

                            const insertAdmins = `
                              INSERT INTO admin (username, password) VALUES 
                              ('admin', 'admin123'),
                              ('superadmin', 'superadmin456');
                            `;
                            connection.query(insertAdmins, (err) => {
                              if (err) throw err;
                              console.log("Sample admin data inserted.");

                              connection.end(() => {
                                console.log("Database setup complete.");
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

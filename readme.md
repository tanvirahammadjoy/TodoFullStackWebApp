# Todo App with User Authentication

Overview
This project is a full-stack Todo application built with Node.js, Express, MongoDB, and a frontend built with vanilla JavaScript, HTML, and CSS. It features user authentication with JWT (JSON Web Tokens), allowing users to register, log in, and manage their own todos. The app ensures secure access to the data by validating tokens.

Features
User Authentication (Registration, Login, and Logout)
JWT-based authentication with token expiration
CRUD operations for Todos (Create, Read, Update, Delete)
Filter todos by category, priority, due date, and completion status
Display task counts (total, completed, and uncompleted tasks)

Responsive frontend
Project Structure
|root-file
|-- client
|   |-- index.html
|   |-- login.html
|   |-- register.html
|   |-- styles.css
|   |-- script.js
|
|-- server
|   |--routes
|   |   |--auth.js
|   |   |--index.js
|   |   |--todos.js
|   |
|   |--models
|   |   |--User.js
|   |   |--Token.js
|   |   |--Todo.js
|   |
|   |--.env
|   |--server.js
|   |--package.json

Getting Started
Prerequisites
Node.js installed
MongoDB Atlas or local MongoDB instance
Installation
Clone the repository:

<!-- git clone https://github.com/your-username/todo-app.git -->
cd todo-app
Install dependencies:

npm install
Set up environment variables:
Create a .env file in the root directory and add the following:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
Start the server:

npm start
Access the application:
<!-- Open your browser and go to http://localhost:3000 -->

Endpoints
Authentication Routes
Register: POST /api/register

Body: { "username": "example", "password": "password123" }
Response: 201 Created
Login: POST /api/login

Body: { "username": "example", "password": "password123" }
Response: { "token": "your_jwt_token" }
Verify Token: GET /api/verify-token

Header: Authorization: Bearer your_jwt_token
Response: 200 OK
Logout: POST /api/logout

Header: Authorization: Bearer your_jwt_token
Response: 200 OK
Todo Routes
Get All Todos: GET /api/todos

Header: Authorization: Bearer your_jwt_token
Response: 200 OK with list of todos
Create Todo: POST /api/todos

Header: Authorization: Bearer your_jwt_token
Body: { "text": "New todo", "category": "Work", "tags": ["urgent"], "dueDate": "2024-07-20T12:00:00Z", "priority": "High" }
Response: 201 Created with the created todo
Update Todo: PUT /api/todos/:id

Header: Authorization: Bearer your_jwt_token
Body: { "text": "Updated todo", "category": "Personal", "tags": ["important"], "dueDate": "2024-07-21T12:00:00Z", "priority": "Medium" }
Response: 200 OK with the updated todo
Delete Todo: DELETE /api/todos/:id

Header: Authorization: Bearer your_jwt_token
Response: 200 OK with message "Todo deleted"
What We Covered and Learned
Backend Development:

Setting up an Express server.
Creating RESTful APIs.
Connecting to MongoDB using Mongoose.
Implementing JWT-based authentication.
Creating middleware to verify tokens.
Frontend Development:

Creating a responsive UI with HTML, CSS, and vanilla JavaScript.
Making HTTP requests using the Fetch API.
Dynamically updating the DOM based on user interactions.
Filtering and sorting todos.
Security:

Hashing passwords with bcrypt.
Implementing token-based authentication.
Protecting routes with middleware.
Future Enhancements
User Management:
Implementing user profile management (e.g., updating username or password).
Notifications:
Adding reminders for due dates.
UI/UX Improvements:
Enhancing the design and adding more responsive features.
Implementing drag-and-drop functionality for todo items.
Additional Features:
Adding sub-tasks or checklists within a todo.
Implementing tags and advanced search functionality.
Adding a calendar view for due dates.
Conclusion
This project serves as a robust example of a full-stack application with secure user authentication and CRUD functionalities. It provides a solid foundation for further enhancements and learning opportunities.

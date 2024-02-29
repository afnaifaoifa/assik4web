Project Description:
. Assik-3 is a Node.js web application enhanced and modified for Assignment 4. It is built with Express.js and MongoDB, providing extended functionalities including user authentication, authorization, REST API integration, and responsive design elements with EJS.

Installation and Setup:
. 1. Clone the repository to your local machine: git clone <repository_url>
. 2. Navigate to the project directory: cd activity-tracker
. 3. Install dependencies using npm: npm install
. 4. Start the application: node app.js
. 5. Access the application in your web browser at http://localhost:3000

Technologies Used:
. - Node.js
. - bcrypt
. - Express.js
. - MongoDB
. - EJS (Embedded JavaScript) for templating
. - Express-session for session management
. - Body-parser for parsing request bodies

Project Structure:
. - app.js: Main application file containing server configuration and startup logic.
. - controllers/: Directory containing controllers for handling different routes and logic.
. - models/: Directory containing MongoDB schema definitions.
. - views/: Directory containing EJS view templates for rendering HTML pages.
. - public/: Directory for static files such as CSS stylesheets and client-side JavaScript.

Usage:
. 1. Upon opening the application, users are redirected to the login page.
. 2. Users can sign up for a new account or log in with existing credentials.
. 3. Once logged in, users can view their activity information on the main page.
. 4. Users can also access exercise-related information and manage their profile.
. 5. Administrators have access to additional functionalities such as user management and item administration.

Authentication and Authorization:
. - User Registration: Users can sign up by providing a username and password.
. - User Login: Existing users can log in securely with their credentials.
. - Authentication Middleware: Routes requiring authentication are protected using middleware.
. - Authorization: Administrators have access to specific routes for user and item management.

REST API Functionality:
. - CRUD Operations: Users can add, edit, and delete items related to activity and exercise.

Deployment:
. The project is deployed and accessible at https://assik4web.onrender.com

Password Information
. Admin username: Shakhzod
Admin password: 1234


database of api key:

muscle (optional) - muscle group targeted by the exercise. Possible values are:
. exercise
abdominals
abductors
adductors
biceps
calves
chest
forearms
glutes
hamstrings
lats
lower_back
middle_back
neck
quadriceps
traps
triceps

This app is built with ReactJS to help users track their daily meals and monitor calorie intake. This application includes user authentication, weekly calorie consumption graphs, and a meal management system.

#### hosted at - [Health Tracker](https://healthtracker-j0jj.onrender.com)

## Features
#### User Authentication:

User Authentication:

1. Users can register and log in securely.
..* Authentication is implemented using JWT (JSON Web Tokens).
2. Meal Tracking:
..* Users can add, view, and delete their daily meals.
..* Each meal contains details like name, calories, and serving size.
3. Weekly Calorie Graph:
..* Displays a bar chart of daily calorie consumption over the last 7 days.
4. Responsive UI:
..* Optimized for both desktop and mobile screens.
..* Clear separation of user profile, meal details per date per type, and graph visualization.
5. Private Routes:
..* Sensitive routes like /home and /user are protected and accessible only to authenticated users.

## Installation and Setup
#### Prerequisites
##### Ensure you have the following installed:

Node.js (v16 or higher)
Git

Steps:
#### Clone the Repository:
`git clone https://github.com/SindhuSri-02/healthifyMe-clone-frontend.git`

##### Install Dependencies:
`npm install`

###### Start the Application:

`npm start`

Access the Application: Open your browser and navigate to http://localhost:3000. 

## Screenshots
#### Login Page
![login-page](https://github.com/user-attachments/assets/53f60433-e642-4876-9872-e9ef50ba198c)

#### Home Page
![home page](https://github.com/user-attachments/assets/df1053a3-837e-4b9c-a366-8e55bc20d589)

#### User Page
![user page](https://github.com/user-attachments/assets/7d982d2a-7b41-435b-bb05-ab7eaea68c4c)

## Project Structure
```
Framework: react.js
Authentication: JWT
```
```
Directory structure:
/
├── src/
     |---- pages/           # React Pages (User, Home, Dates, Graph)
     |---- stylesForPages   # CSS styles for react pages
     |---- App.js           # Start of the react app
├── public/            # static files
```
##### API Endpoints

Authentication:
| Endpoint   | Description                    |
|:----------:| ------------------------------:|
| /register  | Register a new user            |
| /login	   | Login and get a token          |
| /home      | Accessed by logged in user     |
| /user      | Shows logged in user's details |

## Technologies Used
Node.js
React.js
JWT Authentication

## Future Enhancements
Add the ability to edit meals.
Add a feature to track macronutrients (protein, carbs, fat).
Add exercise done, so that calories spent is noted
Recommend amount of the calories to be taken based on weight and goal of user, recommened diet too

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

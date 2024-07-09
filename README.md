# LEAP documentation:
## Introduction

The Land Engagement Adjudication Platform is a web applicatin developed by C1Cs Michaela Kovalsky, Kieran McCauley, Aaron Eakins, Luke Kuklis (Class of 2025) for the United State Air Force Academy's Multi-Domain Laboratory. Development and testing took place in June 2024 at the Air Force Research Laboratory's Gaming Research Integration for Learning Laboratory.

## Quick Start
Locate and open STARTUP.bat in the project's root directory. This will start the local applicaton and the database simultaneously. The local applicaton will automatically launch in the computer's default browser but can also be found at the browser URL "http://localhost:3000/". The database must be previously configured locally for this to work. Additonally, an IP Adress URL will populate in the terminal where the application was launched. This URL can be inserted to web browsers on other computers on the same network to access the application.

## Manual Start
Step One. Open a terminal and navigate to the backend folder from the root of the project folder. Run "node server.js". The database will now be running. The database must be previously configured locally for this to work.

Step Two. Open a new terminal tab or separate blank terminal. Run "npm start". Do not close this terminal. This will start the local applicaton. The local applicaton will automatically launch in the computer's default browser but can also be found at the browser URL "http://localhost:3000/". Additonally, IP Adress URL will populate in the terminal where the application was launched. This URL can be inserted to web browsers on other computers on the same network to access the application.

## Tools
Frontend: React App
UI Components: Mantine
Backend: NodeJS, Axios
Database: PostgreSQL
Resources: GRILL team, tool documentation, ChatGPT


# React App Default Information:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

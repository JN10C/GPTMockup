In order to use the mockup app you will need to have node.js and npm installed on your machine.
Please use the following link to set it up: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

To launch the mockup site follow the steps below:
1. Clone the repositoty to your local machine
2. Using Visual Code Studio (or other IDE) open the FrontendApp and the ServerApp in two separate windows
3. In the ServerApp folder create a file called ".env"
4. In the .env file add your OpenAI API key like so:
   "OPENAI_API_KEY=example_API_key" (no "" needed in the file)
5. While in the ServerApp window and type "npm start" in the terminal (you should get a "Server is running on port 5000" nessage)
6. Go to FrontendApp folder (don't close the server window, use new one for the frontend) and type "npm start" in the terminal
7. The app will get opened in your default browser automatically 
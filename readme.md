# Slither.io Clone
This project is a clone of the Slither.io game.

The project includes 3 sub-project, the server, the client and the bot (AI).

# Control
Use the mouse to control your snake. The snake will move to the position of the mouse. Press and hold the mouse will get the snake accelerated.

Everytime a snake *eats* a bait, it gets longer, but no more than 500 dots, due to performance-related issues (currently this project is still on testing).

Aceleration will reduce the snake's length and create a bait on the position of the snake.

Players have an option to name their snake.

# Installation
Currently the project is only tested on Windows.

In order to run the server, you must have Node.js installed on your machine, with the verion of at least 6.10.0.

Bot and Client are written and built on Qt, using MinGW compiler, but you can use MSVC as well.

# Run
To run the server, open the Command Prompt, navigate to the `Server` folder, then type `node app.js` to run the server. Remember the IP address and the port of the machine running the server.

In order to add a bot, you can simply run the `SnakeBot.exe` under the `SnakeBot` folder, bot app must be run on the same machine of the server.

In order to run the client, open the `Client` folder, open the `config.txt` file, change `CONFIG_SERVER_IP` and `CONFIG_SERVER_PORT` to the IP and port of the server, then simply run the `game.exe` under the `Client` folder.

# License 
This is a completely free software for any Steinsvik personel.
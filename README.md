# Conway's Game of Life

This is a simple implementation of Conway's Game of Life using Node.js and Express. The game is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It consists of a grid of cells that can be either alive or dead, and the state of each cell changes based on its neighbors.
The game is played on a two-dimensional grid, where each cell can be in one of two states: alive (1) or dead (0). The state of the grid evolves over discrete time steps according to a set of rules based on the states of neighboring cells.
The rules are as follows:

1. Any live cell with fewer than two live neighbors dies as if caused by under-population.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by over-population.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
5. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- PM2 (`npm install -g pm2`)

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the server with Node.js directly**

   ```bash
   npm start
   ```

   This will start the server on port 3000 (or the port specified in the PORT environment variable).

3. **Start the server with PM2**

   ```bash
   # Using npm script
   npm run pm2
   
   # OR using the ecosystem file for more configuration options
   pm2 start ecosystem.config.js
   ```

4. **PM2 Commands**

   ```bash
   # Check status
   pm2 status
   
   # View logs
   pm2 logs game-of-life
   
   # Restart the app
   pm2 restart game-of-life
   
   # Stop the app
   pm2 stop game-of-life
   
   # Delete the app from PM2
   pm2 delete game-of-life
   ```

5. **Make PM2 start on system boot**

   ```bash
   pm2 startup
   # Follow the instructions provided
   
   # Save the current PM2 configuration
   pm2 save
   ```

## Accessing the Game

Once the server is running, visit [http://localhost:3000](http://localhost:3000) in your web browser to play Conway's Game of Life.

## File Structure

- `index.html` - Main HTML file containing the game interface
- `app.js` - Game logic and interface code
- `server.js` - Express server to serve the application
- `package.json` - Node.js dependencies and scripts
- `ecosystem.config.js` - PM2 configuration

## Customization

To modify the port, edit the PORT environment variable in the ecosystem.config.js file or set it before starting the server:

```bash
PORT=3088 npm start
# or
PORT=3088 pm2 start server.js --name game-of-life
```

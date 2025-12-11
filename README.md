# Zoom
Zoom-Main Clone — Project Overview

The Zoom-Main Clone is a full-stack real-time video conferencing application that replicates the core functionalities and user experience of Zoom.
The project is built using Node.js, Express, Socket.IO, WebRTC, HTML, CSS, and JavaScript, with a focus on creating a seamless, responsive, and interactive video calling platform.

Project Structure

The project is structured into multiple components and pages responsible for handling video streams, chat functionality, room creation, and real-time communication.

Below is a breakdown of the major components:

Landing Page
Home Page (index.html)

The homepage allows users to:

Create or join a meeting room

Enter a room ID

Start real-time communication

This page forms the entry point of the application.

Room Page
room.html

This is the primary meeting interface.
It integrates:

Video streams (local + remote)

Chat sidebar

Mute/unmute and camera toggle

Leave meeting button

The layout is clean and responsive to ensure a smooth user experience across devices.

Core Components
1. WebRTC Integration

Handles:

Accessing camera and microphone

Creating peer-to-peer video/audio connections

Streaming media between participants

Used across the Room Page for real-time communication.

2. Socket.IO Signaling

Responsible for:

Creating and joining rooms

Exchanging ICE candidates

Sending offers and answers

Managing multiple participants

Ensures that all users in a room remain synchronized.

3. Chat System

Located inside the room interface.
Features include:

Real-time messaging via Socket.IO

Auto-scrolling message window

Username tags

Integrated into the meeting layout

4. Controls (JS Components)

Includes:

Microphone on/off

Camera on/off

Leave room

Switching views/layouts (optional)

Assets

Images, icons, and styling files used throughout the interface include:

SVG icons for mic, camera, end call

CSS files for layout & responsiveness

JS files managing WebRTC, sockets, and UI interactions

Server (Backend)
server.js

Handles:

Room creation

Socket connections

Messaging

User join/leave events

Routing for static files

This server plays the backbone role for signaling and communication.

Routing

/ → Home Page (index.html)

/room/:roomId → Video conferencing room

/js/* → Client-side scripts

/css/* → Styling assets

Installation & Usage
Prerequisites

Node.js

npm

Steps to Run
# Clone the repository
git clone https://github.com/buradapramodh/Zoom-main

# Navigate to the project directory
cd Zoom-main

# Install dependencies
npm install

# Start the development server
npm start


Now open:

http://localhost:3000


You can create a room or join one using a room ID.

Project Deployment

The project can be deployed on:

Render

Railway

Heroku

Vercel (with Node server support)

Any VPS supporting Node.js

Future Enhancements

Screen sharing

Chat file sharing

Participant grid layout

Meeting recording

Authentication for secure meetings

Admin controls (mute participants, remove users)

License

This project is licensed under the MIT License.

Acknowledgements

This project is inspired by the Zoom video conferencing platform, recreated for learning, educational, and demonstrational purposes.

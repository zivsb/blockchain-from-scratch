<h1 align="center">ziv-project: Blockchain from Scratch - A Learning Project</h1>

[![Thumbnail](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://drive.google.com/file/d/1OEcoET3Z2C5j3HeK5EYa11FuSXuo3b2t/view?usp=sharing)

## Overview
In this project I utillized Node.js to construct a copy of Bitcoin's backend. After completing the back end I used React to make a front end for interacting with each node/wallet on the network.

The goal of this project for me was to finally fully understand what Blockchain technology is and to introduce myself to potential topics in CS that I want to pursue down the line such as computer networking, cybersecurity, and cryptography.

## The Design Process
Considering that I came into this project as a beginner to most of the theoritical skills, my progress for the first few weeks primarily consisted of research. To translate my research and abstract knowledge into code I approached the back end development through a test-driven approach. For every possible edge case or security feature that I read or heard about I would implement tests that would enforce such security features and after fully feeling confident with my tests, I would then implement the code for the back end.

## Flaws in my approach
#### Redis Servers:
One of the goals in this project that I mentioned above was to learn and introduce myself to computer networking. Unfortunately, as I got to that part of the project, I was slightly overwhelmed by all I had to learn and understand and I prioritized progress over comprehension and over used available abstractions for a peer-to-peer approach. To setup each node on the network, I configured redis servers to communicate with eachother through a Pub/Sub communication method but through this approach, my network ended up not being truly decentrallized as all the servers had to communicate over a channel hosted on one central node. Later on, when it came time to deploy the app, Redis often caused errors with heroku causing the upload to fail or the app to immediately crash.
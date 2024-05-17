# Chat App
Chat app version 2.0 rewrite

> [!IMPORTANT]  
> When editing make sure all code is formatted using [prettier](https://prettier.io/) using this [formatting](https://github.com/What-Question-Mark/chat/blob/main/.prettierrc.yml)

> [!NOTE]  
> Most features that are in v1.9 are documented [here](https://jack-weller.gitbook.io/chat/)

Basically a clone of discord

![exmaple](./assets/example.png)

## Setup

The chat client is easy to setup

1. Goto [firebase console](https://console.firebase.google.com/u/0/)
2. Create a firebase project (Disable analytics)
3. Build > Firestore Database > Click "Create Database" > Enter Region > Click "Test Mode"
4. Build > Authentication > Click "Get Started" > Click "Email/Password" > Enable first choice
5. Click icon next to "Project Overview" > Project Settings > Scroll down to "Your Apps" > Click web icon "</>" > Enter name > Click "Register App"
6. Copy the contents of "firebaseConfig"
7. Goto "example.env" and rename to ".env"
8. Enter the contents of "firebaseConfig" into the corresponding fields
9. In terminal type `npm i`
10. Then run `npm start`
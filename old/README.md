![GitHub package.json version](https://img.shields.io/github/package-json/v/jackwellerreal/chat?style=for-the-badge)
![GitHub licence](https://img.shields.io/github/license/jackwellerreal/chat?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/jackwellerreal/chat?style=for-the-badge)

# Chat v2
A simple discord clone made using nodejs and electron

![exmaple](./assets/example.png)

## Todo

- [x] Store user info in firebase
- [x] Admin commands
- [x] Ban users
- [x] AI

## Setup

### Install
Run `npm i` to install all the dependencies.

### Config File
Create a file called "config.json" in the root directory, an example is located in "example.config.json".

### Firebase Setup
Run `npm run initialize-firebase` to setup firebase, this will give you a wizard to setup firebase with the correct settings.

### Create User
Run `npm run create-user` to create a user, this will give you a wizard to create a user.

### Create Server
Run `npm run create-server` to create a server, this will give you a wizard to create a server.

## Usage

### Start
Run `npm start` to start the application for development.

### Build
Run `npm build` to build the application for production.

## License

```
MIT License

Copyright (c) 2024 Jack Weller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
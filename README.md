# Simple JWT Authentication

Implementation of token-based authentication with [JWT](https://jwt.io/).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Software you need to install:-
- Visual Studio Code at [Visual Studio Code](https://code.visualstudio.com/)
 - or you can choose any Code Editor to your liking
- Node.js at [Node.org](https://nodejs.org/en/download/)

```
// Visual Studio Code Installation
Go to Visual Studio Code link above and choose download according to your machine type (choose the **stable** version):-
- Window, go for Windows Installer
- MacOS, go for MacOS Installer
- Linux, go for Linux Installer

// Node.js Installation
Go to Node.org link above and choose your machine type (Please choose the **LTS download version** instead of the Current version):-
- Window, go for Windows Installer
- MacOS, go for MacOS Installer
```

### Installing

Please follow the step below to get the system running

1. After download or git repo the Project file. Place your Project folder anywhere in your system (doesn't matter where actually)
2. Open your Code Editor (Visual Studio Code or any other code editor)
3. Go to your Terminal in Visual Studio Code or open CMD - Command Prompt, manuver to where your Project folder located and do the following installation:- (make sure you already inside your Project folder. Eg: C:\parentFolder\ProjectFolder) in order to get the final version running properly

- Install all dependencies required (as stated in package.json)

```
in your Terminal or CMD, it's gonna look like this:-
C:\simpleJWTAuth\final\>npm install
```

- Once installation finishes with no errors. Then start the project:-

```
C:\simpleJWTAuth\final\>npm start
```

## Important Notes

1. This project contain 2 main folders:-
 - starter (contain starter codes and files needed)
 - final (contain a complete working web app - finished code)
2. This project aims to teach you how to implement token-based authentication with JWT.
3. This project will not cover the part of designing and implementing or coding of the UI.

## Step By Step Guides

- [ ] simple setup
 - [ ] create model or data scheme
 - [ ] create new user
  - [ ] check if req being send from form, throw error if NO
  - [ ] check if email already exit, throw error if YES
  - [ ] hash password with bcrypt
  - [ ] save new user into db
 - [ ] login as new user
  - [ ] check user email existance, throw error if ALREADY EXIST
  - [ ] check user password match, throw error if password NOT MATCH
  - [ ] generate access token (with expiration time)
  - [ ] generate refresh token (without expiration time)
  - [ ] save access token and refresh token in db
   - [ ] if successful, then go to homepage
    - [ ] create home GET route with token verifiication
     - [ ] create token verification function
   - [ ] if unsuccessful, then throw error
- [ ] complete setup
 - [ ] create login page
  - [ ] create login GET route
  - [ ] alter home GET route to render home page
  - [ ] create home page
   - [ ] store access token in localStorage
   - [ ] setup logout button
    - [ ] create POST route for logout button
     - [ ] verify access token
      - [ ] if successful (when access token still VALID), then use userID to confirm logout
      - [ ] if unsuccessful (when access token is NOT VALID), then use access token to confirm logout
  - [ ] handle token access denied
   - [ ] if NO data in localStorage, then back to login page
   - [ ] if HAVE data in localStorage, then
    - [ ] check if status=1, then back to home page
    - [ ] check if status=0, then redirect to invalid token route
     - [ ] create invalid token route
      - [ ] create and render invalid token page
       - [ ] create button to allow user to:-
        - [ ] continue (stay logged in)
         - [ ] add event listener to:-
          - [ ] invalidated current user's token (status=0)
          - [ ] check status, if equals to 1
           - [ ] redirect back user to home page
          - [ ] check status, if equals to 0
           - [ ] give new access token
            - [ ] refresh token
             - [ ] if successful, then update new access token and status in localStorage
              - [ ] create refresh token POST route
               - [ ] check access token availability
               - [ ] update status of access token in db
               - [ ] verify refresh token
                - [ ] if successful, then
                 - [ ] generate new aacess token
                 - update and save new access token in db
                 - return back to fetch call made from invalid token page with new access token
                - [ ] if unsuccessful, then return unsuccessful message
             - [ ] if unsuccessful, then empty localStorage and redirect back to login page
        - [ ] logout (to logout)
         - [ ] add event listener to:-
          - [ ] fetch call to logout POST route
- [ ] secure setup
 - [ ] add fetch call to check valid token in invalid token page
  - when user hit 'continue' button
   - [ ] if blacklisted, then empty localStorage and redirect user to login page
   - [ ] if not blacklisted, then do refresh tokan fetch call
  - when user hit 'logout' button
   - [ ] if blacklisted, then empty localStorage and redirect user to login page
   - [ ] if not blacklisted, then do logout fetch call

## Deployment

No additional support on how to deploy on live system for this project.

## Built With

* Vanilla JavaScript (*No Front-end Framework Use*) 

## Authors

* [Lalapolalaa Newb](https://lalapolalaanewb.com)

## Acknowledgments

These are some of the online sources which I learnt from. You may do so as well.

* [Jonas Schmedtmann](https://www.youtube.com/channel/UCNsU-y15AwmU2Q8QTQJG1jw)
* [Academind](https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w)
* [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog)
* [Traversy Media](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
* [DevEd](https://www.youtube.com/channel/UClb90NQQcskPUGDIXsQEz5Q)
* [Web Dev Simplifies](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)
* [DesignCourse](https://www.youtube.com/channel/UCVyRiMvfUNMA1UPlDPzG5Ow)
* [Coding Addict](https://www.youtube.com/channel/UCMZFwxv5l-XtKi693qMJptA)
* [The Net Ninja](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)


Read Me!

Dependencies: React, NextJS, ExpressJS, MaterialUI

Usage:

Step 1: Start the ExpressJS server
$ cd backend
$ npm start

Step 2: Start the NextJS server
$ cd frontend
$ npm run dev

Step 3: Follow the link in the console output to the webpage (http://localhost:3001)

## API Reference

#### Create User Account

```http
  POST /auth/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Display name. |
| `password` | `string` | **Required**. Plaintext password. |
| `fname` | `string` | **Required**. Real first name. |
| `lname` | `string` | **Required**. Real last name. |
| `email` | `string` | **Required**. Email address. |

#### Sign Into User Account

```http
  POST /auth/login/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username of account. |
| `password`      | `string` | **Required**. Plaintext password. |

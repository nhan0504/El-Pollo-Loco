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

## API Documentation

Unless otherwise specified, routes return status `200` on success, or `500` if an internal error is encountered.

#### Create User Account (Authentication)

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

Returns status `409` if a user with the same username or email already exists.

#### Sign Into User Account (Authentication)

```http
  POST /auth/login/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username of account. |
| `password`      | `string` | **Required**. Plaintext password. |

Returns status `401` if the password is invaild, or if the user does not exist. Client is provided with a cookie (`name=poll_cookie`) upon successful login.

#### Log Out of User Account (Authentication)

```http
  POST /auth/logout/
```
Returns status `401` if client is not logged in upon request.

#### Check if Signed In (Authentication)

```http
  GET /auth/is_authenticated
```
Returns status `401` if client is not logged in upon request.

#### Get Profile Information (Authentication)

```http
  GET /auth/profile/
```
Returns status `401` if client is not logged in upon request. Otherwise returns the following object.

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username of account. |
| `user_id`      | `string` | **Required**. User ID of account. |
| `email`      | `string` | **Required**. Email of account. |


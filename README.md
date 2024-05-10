## Usage

1. Start the ExpressJS server with `$ cd backend && npm i && npm start`.
2. Open a new terminal and start the NextJS server with `$ cd ../frontend && npm i && npm run dev`.
3. Follow the link in the console output to access the webpage.


## API Documentation

Unless otherwise specified, routes return status `200` on success, or `500` if an internal error is encountered. Routes flagged with "(Authenticated)" will return status `401` if the client's browser does not provide a valid authentication cookie (`name=poll_cookie`).

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

Returns status `409` if a user with the same username or email already exists.

#### Sign Into User Account

```http
  POST /auth/login/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username of account. |
| `password`      | `string` | **Required**. Plaintext password. |

Returns status `401` if the password is invaild, or if the user does not exist. Client is provided with a cookie (`name=poll_cookie`) upon successful login.

#### Log Out of User Account (Authenticated)

```http
  POST /auth/logout/
```
Returns status `401` if client is not logged in upon request.

#### Check If Signed In 

```http
  GET /auth/is_authenticated
```
Returns status `401` if client is not logged in upon request.

#### Get Profile Information (Authenticated)

```http
  GET /auth/profile/
```
Returns status `401` if client is not logged in upon request. Otherwise returns the following object.

```
{
  username: string,
  email: string,
  user_id: string
}
```

#### Get Followers List Of User

```http
  GET /users/:user_id/followers/
```
Returns the following object upon successful request.

```
{
  followers: string[],
  total_followers: number
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `string` | **Required**. ID of account. |

#### Get Following List Of User

```http
  GET /users/:user_id/following/
```
Returns the following object upon successful request.

```
{
  following: string[],
  total_followers: number
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `string` | **Required**. ID of account. |

#### Follow A User (Authenticated)

```http
  GET /users/:user_id/follow/
```
Returns status `404` if the client is already following the specified user. Updates client profile to follow the user specified by `:user_id`. 

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `string` | **Required**. ID of account to follow. |

#### Unfollow A User (Authenticated)

```http
  GET /users/:user_id/unfollow/
```
Returns status `404` if the client is not following the specified user prior to the request.
Updates client profile to unfollow the user specified by `:user_id`. 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `string` | **Required**. ID of account to unfollow. |


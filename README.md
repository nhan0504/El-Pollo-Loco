## Usage

1. Start the ExpressJS server with `$ cd backend && npm i && npm start`.
2. Open a new terminal and start the NextJS server with `$ cd ../frontend && npm i && npm run dev`.
3. Follow the link in the console output to access the webpage.


## API Documentation

Unless otherwise specified, routes return status `200` or `201` on success, and `500` if an internal error is encountered. Routes flagged with "(Authenticated)" will return status `401` if the client's browser does not provide a valid authentication cookie (`name=poll_cookie`).

### Authentication

Code located in `backend/routes/auth.js`.

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

Returns status `401` if the password is invaild, or if the user does not exist. Client is provided with a cookie expiring 24 hours after issuing (`name=poll_cookie`).

#### Log Out of User Account (Authenticated)

```http
  POST /auth/logout/
```
Deauthenticates cookie provided by client browser.

#### Check If Signed In 

```http
  GET /auth/is_authenticated
```
Returns status `401` if client is not logged in upon request.

#### Get Profile Information (Authenticated)

```http
  GET /auth/profile/
```
Returns status `401` if client is not logged in upon request. Returns the following object.

```
{
  username: string,
  email: string,
  user_id: int
}
```
### User Following

Code located in `backend/routes/users.js`.

#### Get Followers List Of User

```http
  GET /users/:user_id/followers/
```
Returns the following object.

```
{
  followers: string[],
  total_followers: number
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `int` | **Required**. ID of account. |

#### Get Following List Of User

```http
  GET /users/:user_id/following/
```
Returns the following object.

```
{
  following: string[],
  total_followers: number
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `int` | **Required**. ID of account. |

#### Follow A User (Authenticated)

```http
  GET /users/:user_id/follow/
```
Returns status `404` if the client is already following the specified user. Updates client profile to follow the user specified by `:user_id`. 

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `int` | **Required**. ID of account to follow. |

#### Unfollow A User (Authenticated)

```http
  GET /users/:user_id/unfollow/
```
Returns status `404` if the client is not following the specified user prior to the request.
Updates client profile to unfollow the user specified by `:user_id`. 
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:user_id`      | `int` | **Required**. ID of account to unfollow. |

### Poll Tags

Code located in `backend/routes/tags.js`.

#### Follow A Tag (Authenticated)

```http
  GET /tags/follow/:tag_name/
```
Returns status `404` if the specified tag does not exist. Updates client profile to follow the tag specified by `:tag_name`.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:tag_name`      | `string` | **Required**. Name of tag to follow. |

#### Unfollow A Tag (Authenticated)

```http
  GET /tags/unfollow/:tag_name/
```
Returns status `404` if the specified tag does not exist or client is not following the tag. Updates client profile to unfollow the tag specified by `:tag_name`.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:tag_name`      | `string` | **Required**. Name of tag to unfollow. |

#### Get Tag Following List (Authenticated)

```http
  GET /tags/
```
Returns status `404` if the client is not following any tags. Returns `string[]`.

### Polls

Code located in `backend/routes/polls`.

#### Get Poll By ID
```http
  GET /polls/:poll_id
```
Returns status `404` if the specified poll does not exist. Returns the following object.
```
{
  poll_id: int,
  user_id: int,
  title: string,
  created_at: timestamp,
  options: { option_id: int, option_text: string }[],
  tags: { tag_id: int, tag_name: string }[]
}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:poll_id`      | `int` | **Required**. ID of poll. |

#### Post Poll (Authenticated)

```http
  POST /polls/
```
Creates a poll attached to the client's account.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required**. Title of poll. |
| `options`      | `string[]` | **Required**. List of options. |
| `tags`      | `string[]` | **Required**. List of tags. |

#### Delete Poll (Authenticated)

```http
  DELETE /polls/:poll_id
```
Returns status `404` if the specified poll does not exist prior to the request. Deletes the specified poll.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:poll_id`      | `int` | **Required**. ID of poll. |

#### Get Comments By Poll ID
```http
  GET /polls/comments/:poll_id
```
Returns the following object.
```
{
  username: string,
  user_id: int,
  comment_id: int,
  parent_id: int,
  comment: string
}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:poll_id`      | `int` | **Required**. ID of poll. |

#### Post Comment (Authenticated)
```http
  POST /polls/comments/
```
Posts a comment to the poll specified by `poll_id`.

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `poll_id`      | `int` | **Required**. ID of poll. |
| `parent_id`      | `int` | **Optional**. ID of parent comment. |
| `comment`      | `string` | **Required**. Content of comment. |

#### Delete Comment By Comment ID (Authenticated)
```http
  GET /polls/comments/:comment_id
```
Deletes the specified comment.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:comment_id`      | `int` | **Required**. ID of comment. |

### Feeds

Code located in `backend/routes/feed`.

All routes return the following array of objects.
```
{
  poll_id: int,
  title: string,
  created_at: timestamp,
  username: string,
  user_id: int,
  vote_count: int,
  tags: string, //Comma-delimited tags
  score: int,
  options: { option_id: int, option_text: string, vote_count: int }[]
}[]
```
All routes take the following URL parameter.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `:page_num`      | `int` | **Required**. Page number of feed. |

#### Get Discover Feed By Page
```http
  GET /feed/:page_num
```
Returns `404` if no polls exist. 

#### Get Friends Feed By Page (Authenticated)
```http
  GET /feed/friends/:page_num
```

#### Get Tags Feed By Page (Authenticated)
```http
  GET /feed/tags/:page_num
```

#### Get Client User Feed By Page (Authenticated)
```http
  GET /feed/user/:page_num
```
=======

## Frontend Documentation. 
The frontend is split into components, which match up with routing as supported by Next.JS. This project relied on Material UI for components such as a Card, Button, Page Bar, Login, etc. 

### Auth
Signin.tsx has the login components. Likewise, Signup has the login components. Each of them rely on AuthContext, which is a context at the Contexts folder that is passed into each component that needs to know if the user is signed in or not. 

### Discover

This folder has all the components for the Feed in Discover, Freinds, and Following. The parent file is ```feed.tsx``` which calls the rest of the files. Each PollCard has a username of who made it (```addFreind.tsx```), a comment box (```comments.tsx```). When the comments are open, we load ```pollCardNoComments.tsx```. To search, we use ```search.tsx```, and to create a poll, we use ```PollForm.tsx```. The buttons on the feed are in ```feedButtons.tsx```. 

### Profile
```profile.tsx``` renders the profile page. This shows user stats (how many polls made, how many votes, etc.) and any polls a user made. 

### Navigation
Lastly, we have a nav bar in ```navigation.tsx``` which has the Home button, Profile, and log in/log out. 

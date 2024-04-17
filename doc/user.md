# User API Spec

### Model User

- Username
- Password
- Name

### Register User

Endpoint : POST /api/users

Request:

```json
{
  "name": "Wahyu",
  "username": "wahyu",
  "password": "rahasia"
}
```

Response Body (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wahyu",
    "username": "wahyu"
  }
}
```

Response Body (Error):

```json
{
  "code": 400,
  "status": "error",
  "data": {
    "message": "Username already registered"
  }
}
```

### Login User

Endpoint : POST /api/login

Request:

```json
{
  "username": "wahyu",
  "password": "rahasia"
}
```

Response (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wahyu",
    "username": "wahyu",
    "token": "<generate_radom_token>"
  }
}
```

Response (Error):

```json
{
  "code": 401,
  "status": "error",
  "data": {
    "message": "username or password wrong"
  }
}
```

### Update User

Endpoint : PATCH /api/user/current

Headers :

- Authorization: token

Request:

```json
{
  "name": "Wahyu", //(optional)
  "password": "wahyu" //(optional)
}
```

Response (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wahyu",
    "username": "wahyu",
    "token": "<generate_radom_token>"
  }
}
```

### Get User

Endpoint : GET /api/current

Headers :

- Authorization: token

Response (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wahyu",
    "username": "wahyu",
    "token": "<generate_radom_token>"
  }
}
```

Response (Error):

```json
{
  "code": 401,
  "status": "error",
  "data": {
    "message": "Unauthorized"
  }
}
```

### Logout User

Endpoint : DELETE /api/logout

Headers :

- Authorization: token

Response (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": true
}
```

Response (Error):

```json
{
  "code": 401,
  "status": "error",
  "data": {
    "message": "Unauthorized"
  }
}
```

# Contact API Spec

### Model Contact

- Fisrt Name
- Last Name
- Email
- Phone

### Create Contact

Endpoint: POST /api/contact

Headers :

- Authorization: token

Request:

```json
{
  "first_name": "Wahyu",
  "last_name": "Nur Fadillah",
  "email": "wahyu@gmail.com",
  "phone": "0812888888"
}
```

Response Body (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "first_name": "Wahyu",
    "last_name": "Nur Fadillah",
    "email": "wahyu@gmail.com",
    "phone": "0812888888"
  }
}
```

Response Body (Error):

```json
{
  "code": 400,
  "status": "error",
  "data": {
    "message": "Bad Request"
  }
}
```

### Update Contact

Endpoint: PUT /api/contact/:id

Headers :

- Authorization: token

Request:

```json
{
  "first_name": "Wahyu",
  "last_name": "Nur Fadillah",
  "email": "wahyu@gmail.com",
  "phone": "0812888888"
}
```

Response Body (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "first_name": "Wahyu",
    "last_name": "Nur Fadillah",
    "email": "wahyu@gmail.com",
    "phone": "0812888888"
  }
}
```

Response Body (Error):

```json
{
  "code": 400,
  "status": "error",
  "data": {
    "message": "Bad Request"
  }
}
```

### Get Contact

Endpoint: GET /api/contact/:id

Headers :

- Authorization: token

Response Body (Success):

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "id": 1,
    "first_name": "Wahyu",
    "last_name": "Nur Fadillah",
    "email": "wahyu@gmail.com",
    "phone": "0812888888"
  }
}
```

Response Body (Error):

```json
{
  "code": 404,
  "status": "error",
  "data": {
    "message": "Data Not Found"
  }
}
```

### Search Contact

Endpoint: GET /api/contact

Headers :

- Authorization: token

Query Params :

- name: string, contact first name or contact last name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Response

```json
{
  "code": 200,
  "status": "success",
  "data": [
    {
      "id": 1,
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy",
      "email": "eko@example.com",
      "phone": "08999999999"
    },
    {
      "id": 2,
      "first_name": "Eko Kurniawan",
      "last_name": "Khannedy",
      "email": "eko@example.com",
      "phone": "08999999999"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

### Remove Contact

Endpoint: DELETE /api/contact

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

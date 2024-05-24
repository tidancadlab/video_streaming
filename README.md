# WhiteBlob Streaming Server Documentation

## Overview

The WhiteBlob Streaming Server is a backend server that supports the WhiteBlob Streaming application. It provides various APIs for user authentication, video management, and video streaming. This documentation outlines the available API endpoints, their usage, and the expected request and response formats.

## API Endpoints

### 1. User Authentication

#### **POST /api/auth/login**

This endpoint is used for user login. It authenticates the user and returns a JWT token on successful authentication.

**Request:**

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```

**Response:**

- **Success (200):**
  ```json
  {
    "token": "jwt-token-string",
    "message": "Welcome Back"
  }
  ```
- **Failure (404):**
  ```json
  {
    "message": "User not found"
  }
  ```
- **Failure (401):**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

### 2. User Registration

#### **POST /api/auth/register**

This endpoint is used for user registration. It creates a new user account and returns a JWT token on successful registration.

**Request:**

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```

**Response:**

- **Success (201):**
  ```json
  {
      "message": "successfully registered",
      "username": "email",
      "ok": true,
      "date": Date(),
  }
  ```
- **Failure (400):**
  ```json
  {
    "message": "User already exists"
  }
  ```

### 3. Video Management

#### **GET /api/videos**

This endpoint retrieves a list of all videos available for streaming.

**Request:**

- **URL:** `/api/videos`
- **Method:** `GET`

**Response:**

- **Success (200):**
  ```json
  {
    "videos": [
      {
        "id": "video-id",
        "user": "Uploaded by",
        "title": "video title",
        "description": "Video Description",
        "thumbnails": [{
          "id": "thumbnail-id",
          "url": "Thumbnail url",
          "size": "Thumbnail size in kb",
          "height": "Thumbnail height",
          "width": "Thumbnail width",
          "created_at": "Thumbnail time_stamp",
        }, 
        ...]
        "video_created_at": "time stamp"
      },
      ...
    ]
  }
  ```

#### **POST /api/upload**

This endpoint allows a registered user to upload a new video.

**Request:**

- **URL:** `/api/upload`
- **Method:** `POST`
- **Headers:** 
  - `Authorization: Bearer jwt-token-string`
  - `Content-Type: multipart/form-data`
- **Body:** FormData with fields:
  - `title` (string): Title of the video.
  - `description` (string): Description of the video.
  - `video` (file): Video file to be uploaded.

**Response:**

- **Success (201):**
  ```json
  {
    "message": "Video uploaded successfully",
    "video": {
      "id": "video-id",
      "title": "Video Title"
    }
  }
  ```

**Example:**

```javascript
let chunks = [];
  // Divide file into chunks and store into Array
  const handleUpload = (videoFile) => {
    try {
      const chunkSize = 1024 * 1024 * 2;
      let offset = 0;

      while (offset < videoFile.size) {
        const chunk = videoFile.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
      }

      const isLast = chunks.length === 1;
      const chunk = chunks.shift();
      onUploadChunk(videoFile, chunk);

    } catch (error) {
      console.log(error);
    }
  };

  const onUploadChunk = (videoFile, chunk, isLast = false) => {
    const { id, name, lastModified, size } = videoFile;

    const formData = new FormData();
    formData.append('id', id);
    formData.append('video', chunk, name);
    formData.append('lastModified', lastModified);
    formData.append('size', size);
    formData.append('isTail', isLast);

    readyAxios
      .post(`api/upload`, formData)
      .then((data) => {         
        if (data.status === 200) {
          // this will run recursively
          if(chunks.length >= 1){
            const isLast = chunks.length === 1;
            const chunk = chunks.shift();
            onUploadChunk(videoFile, chunk, isLast)
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleUpload(videoFile)

```

- **Failure (400):**
  ```json
  {
    "error": "Invalid video format"
  }
  ```

### 4. Video Streaming

#### **GET /api/videos/player/:id** - get video by id for player

This endpoint retrieves a list of all videos available for streaming.

**Request:**

- **URL:** `/api/videos/player/:id`
- **Method:** `GET`

**Response:**

- **Success (200):**
  ```json
  {
    "ok": true,
    "message": "retrieved successfully",
    "data": {
              "id": "video-id",
              "url": "https://api.whiteblob.site/api/media/xxxxxxxxx/master.m3u8",
            }
  }
  ```

## Error Handling

All error responses follow a consistent format:
```json
{
  "error": "Error message"
}
```

## Authentication

Endpoint `/api/upload` require a valid JWT token to be included in the `Authorization` header of the request.

Example:
```
Authorization: Bearer jwt-token-string
```

## Response Codes

- **200 OK:** The request was successful.
- **201 Created:** The resource was successfully created.
- **400 Bad Request:** The request was invalid or cannot be served.
- **401 Unauthorized:** The request requires user authentication.
- **404 Not Found:** The requested resource could not be found.
- **500 Internal Server Error:** An error occurred on the server.

## Contribution

We welcome contributions to improve the WhiteBlob Streaming Server. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
5. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request on GitHub.

## License

This project is licensed under the MIT License.

---

For any further questions or support, please contact us at [info@whiteblob.site](mailto:info@whiteblob.site).

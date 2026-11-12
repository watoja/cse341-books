

## Feature 1: Book CRUD Operations and Author References

### Goal
 Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

| Field | Type | Requirement |
|---|---|---|
| `id` | String | Required and unique; custom ID such as `b1` |
| `authorId` | String | Required; references the `id` field of an existing author |
| `title` | String | Required and non-empty |
| `publicationDate` | String | Required; valid date in `YYYY-MM-DD` format |

Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API must reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Initial Book Records

```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Patterns of Light",
    "publicationDate": "2021-08-17"
  },
  {
    "id": "b2",
    "authorId": "a2",
    "title": "Atomic Habits",
    "publicationDate": "2018-10-16"
  },
  {
    "id": "b3",
    "authorId": "a3",
    "title": "1984",
    "publicationDate": "1949-06-08"
  }
]
```

### Routes

#### GET /books

**Purpose:** Return all books.

**Success:**
- Status code: `200`
- Response body: An array of book objects.

**Errors:**
- `500` if an unexpected server or database error occurs.

#### GET /books/:id

**Purpose:** Return one book by its custom ID.

**Success:**
- Status code: `200`
- Response body: The matching book object.

**Errors:**
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /books

**Purpose:** Create a new book.

**Request body:**

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

**Success:**
- Status code: `201`
- Response body: The newly created book object.

**Errors:**
- `400` if a required field is missing or invalid.
- `400` if the submitted `id` already exists.
- `400` if the submitted `authorId` does not match an existing author.
- `500` if an unexpected server or database error occurs.

#### PUT /books/:id

**Purpose:** Update an existing book.

**Request body:**

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

**Success:**
- Status code: `200`
- Response body: The updated book object.

**Errors:**
- `400` if a required field is missing or invalid.
- `400` if the submitted `authorId` does not match an existing author.
- `400` if the request attempts to change the book's custom ID.
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

#### DELETE /books/:id

**Purpose:** Delete an existing book.

**Success:**
- Status code: `204`
- Response body: None.

**Errors:**
- `404` if no book exists with that ID.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation

Swagger must document every book route.

Each route must include:
- HTTP method and endpoint.
- Summary and description.
- Path parameters, where applicable.
- Required request fields and request body schema, where applicable.
- Successful response status and response schema.
- Possible error responses.

Swagger UI must allow users to test every book route from the browser.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal

Create an authors API that supports all CRUD operations for author records. The API must allow users to retrieve, create, update, and delete authors while maintaining the relationship between authors and books.

Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

| Field | Type | Requirement |
|---|---|---|
| `id` | String | Required and unique; custom ID such as `a1` |
| `name` | String | Required and non-empty |
| `birthYear` | Number | Required integer; cannot exceed the current year |

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Initial Author Records

```json
[
  {
    "id": "a1",
    "name": "Maya Rivera",
    "birthYear": 1984
  },
  {
    "id": "a2",
    "name": "James Clear",
    "birthYear": 1986
  },
  {
    "id": "a3",
    "name": "George Orwell",
    "birthYear": 1903
  }
]
```

### Relationship to Books

An author may have multiple books, but each book must reference one existing author through its `authorId` field.

The API must maintain the following rules:

- An author may be associated with multiple books.
- Each book must reference an existing author.
- Author names must not be duplicated in book documents.
- Updating an author's name or birth year must not break existing book references.
- An author with associated books must not be deleted.

Before deleting an author, the API must check whether any book references that author.

For example:

```javascript
db.books.findOne({ authorId: "a1" });
```

If a matching book exists, the API must reject the deletion with a `409` status code.

### Routes

#### GET /authors

**Purpose:** Return all authors.

**Success:**
- Status code: `200`
- Response body: An array of author objects.

**Errors:**
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id

**Purpose:** Return one author by their custom ID.

**Success:**
- Status code: `200`
- Response body: The matching author object.

**Errors:**
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /authors

**Purpose:** Create a new author.

**Request body:**

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1990
}
```

**Success:**
- Status code: `201`
- Response body: The newly created author object.

**Errors:**
- `400` if a required field is missing or invalid.
- `400` if the submitted `id` already exists.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id

**Purpose:** Update an existing author.

**Request body:**

```json
{
  "name": "Updated Author Name",
  "birthYear": 1992
}
```

**Success:**
- Status code: `200`
- Response body: The updated author object.

**Errors:**
- `400` if a required field is missing or invalid.
- `400` if the request attempts to change the author's custom ID.
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### DELETE /authors/:id

**Purpose:** Delete an existing author who has no associated books.

**Success:**
- Status code: `204`
- Response body: None.

**Errors:**
- `404` if no author exists with that ID.
- `409` if one or more books still reference the author.
- `500` if an unexpected server or database error occurs.

### Swagger Documentation

Swagger must document every author route.

Each route must include:
- HTTP method and endpoint.
- Summary and description.
- Path parameters, where applicable.
- Required request fields and request body schema, where applicable.
- Successful response status and response schema.
- Possible error responses.

Swagger UI must allow users to test every author route from the browser.

### Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

## Feature 3: Data Validation and Integrity

### Goal

Ensure that all incoming requests contain valid data and that relationships between books and authors remain consistent.

### Validation Rules

The following rules apply to both collections:

1. Required fields must be provided.
2. String fields must not contain only whitespace.
3. Custom IDs must be unique within their respective collections.
4. Unexpected request body properties must be rejected.
5. Birth years must be integers and cannot exceed the current year.
6. Publication dates must represent valid calendar dates in `YYYY-MM-DD` format.
7. Books must reference an existing author.
8. MongoDB `_id` and custom IDs must not be modified through PUT requests.

POST and PUT requests must return HTTP `400` when submitted data is invalid.

### Standardized API Responses

All error responses must use the following structure:

```json
{
  "error": "A descriptive error message"
}
```

The API must use these status codes consistently:

| Status | Application |
|---|---|
| `200` | Successful retrieval or update |
| `201` | Successful creation |
| `204` | Successful deletion with no response body |
| `400` | Invalid request data |
| `404` | Requested book, author, or referenced author not found |
| `409` | Duplicate custom ID or author still referenced by books |
| `500` | Unexpected server or database error |

Database error details, credentials, and internal stack traces must not be returned to clients.

---

## Feature 4: MongoDB Migration and Indexes

### Goal

Update the existing Week 01 database structure to support the new authors collection and the relationship between books and authors without losing existing data.

### Migration Requirements

- Create or update the three author records.
- Assign the correct custom IDs to the existing authors.
- Replace the old `author` field in each book with the corresponding `authorId`.
- Remove the old `author` field after successfully assigning the relationship.
- Preserve existing MongoDB `_id` values.
- Preserve existing book titles, custom IDs, and publication dates.
- Avoid duplicate author records when the migration is run again.
- Verify the migration before deploying the updated API.

### Required Indexes

| Collection | Index | Configuration |
|---|---|---|
| `books` | `id` | Unique |
| `authors` | `id` | Unique |
| `books` | `authorId` | Non-unique |

---

## Feature 5: Swagger Documentation

### Goal

Provide complete API documentation that allows developers and testers to understand and test all book and author routes.

### Documentation Requirements

All ten endpoints must be documented and testable through Swagger UI.

Each endpoint must document:

- HTTP method and route.
- Summary and description.
- Path parameters, where applicable.
- Required request fields.
- Request body schema, where applicable.
- Successful response status and response schema.
- Possible error responses.

Swagger UI must remain accessible at:

`/api-docs`

The documentation must work locally and on Render.

---

## Acceptance Criteria

### Database

- [ ] The `authors` collection contains the three agreed author records.
- [ ] The `books` collection contains the three existing books.
- [ ] All three books reference the correct authors through `authorId`.
- [ ] Existing MongoDB `_id` values remain unchanged.
- [ ] Required MongoDB indexes exist.

### Book API

- [ ] GET `/books` returns all books.
- [ ] GET `/books/:id` returns one book by custom ID.
- [ ] POST `/books` creates a new book.
- [ ] PUT `/books/:id` updates an existing book.
- [ ] DELETE `/books/:id` deletes an existing book.
- [ ] Books cannot reference nonexistent authors.

### Author API

- [ ] GET `/authors` returns all authors.
- [ ] GET `/authors/:id` returns one author by custom ID.
- [ ] POST `/authors` creates a new author.
- [ ] PUT `/authors/:id` updates an existing author.
- [ ] DELETE `/authors/:id` deletes an author without associated books.
- [ ] Authors with associated books cannot be deleted.

### Validation and Documentation

- [ ] Required fields and data formats are validated.
- [ ] Duplicate custom IDs are rejected.
- [ ] Unexpected request body properties are rejected.
- [ ] Invalid requests return appropriate HTTP status codes.
- [ ] Error responses use the standard JSON structure.
- [ ] All ten endpoints are documented in Swagger.
- [ ] Swagger allows testing of all ten endpoints.
- [ ] All endpoints work locally and on Render.


## Final Summary

Week 02 extends the existing Books API by introducing an `authors` collection and connecting books to authors through `authorId`. The API will support complete CRUD operations for both resources, enforce validation and data integrity, preserve existing database records during migration, and provide Swagger documentation for all ten endpoints.

The implementation must be tested locally and on Render before the Week 02 work is considered complete.
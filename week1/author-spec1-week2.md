# Searching for Authors and Linking Authors to Books

The API should make it easy for clients to find an existing author and connect that author to a book. This should work both when a new book is created and when an existing book is updated.

Each author will have a custom `id`, provided when the author is created. This ID will be used throughout the API when retrieving, updating, deleting, searching for, or linking authors to books. MongoDB's automatically generated `_id` should not be used for these operations.

## 1. Search for an Author

**Route:** `GET /authors/search?q={searchTerm}`

Clients should be able to search for an author using either their name or their custom ID. This will help users find the correct author before linking them to a book.

The search should:

- Allow partial name searches without requiring the full name.
- Ignore differences between uppercase and lowercase letters when searching by name.
- Allow searches using an author's custom ID.
- Remove any unnecessary spaces at the beginning or end of the search term.
- Return matching authors with only their `id`, `name`, and `birthYear` fields.
- Return an empty array if no matching authors are found.

A missing or empty search term should not be accepted.

**Example request:**

`GET /authors/search?q=Maya`

**Example successful response — 200 OK:**

```json
[
  {
    "id": "a1",
    "name": "Maya Rivera",
    "birthYear": 1984
  }
]
```

If no authors match the search, the API should return:

```json
[]
```

**Expected responses:**

- `200 OK` – The search was successful. The response contains the matching authors or an empty array.
- `400 Bad Request` – The search term is missing or empty.
- `500 Internal Server Error` – Something unexpected went wrong while processing the search.

## 2. Link an Author to a Book

Once a client has found the correct author, it should be possible to use that author's custom ID when creating a book.

Each book will store the selected author's ID in a field called `authorId`. This creates the relationship between the book and its author.

**Example book request body:**

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "A New Beginning",
  "publicationDate": "2024-05-15"
}
```

When a book is submitted, the application should:

1. Receive the selected author's custom ID.
2. Check that all required book information has been provided and is valid.
3. Look up the author in the `authors` collection using the supplied custom ID.
4. Confirm that the author exists before saving the book.
5. Store the selected ID in the book's `authorId` field.

If the supplied author ID does not belong to an existing author, the application should reject the request rather than create a book with an invalid author reference.

**Expected responses:**

- `201 Created` – The book was successfully created and linked to the selected author.
- `400 Bad Request` – Required book information is missing or invalid.
- `404 Not Found` – The supplied author ID does not match an existing author.
- `500 Internal Server Error` – An unexpected error occurred while processing the request.

## 3. Update a Book's Author

Clients should also be able to change the author associated with an existing book. For example, when editing a book, a user may search for another author and select that person instead.

Before saving the changes, the application must confirm that both the book and the newly selected author exist.

**Example request:**

`PUT /books/b4`

**Example request body:**

```json
{
  "authorId": "a2",
  "title": "A New Beginning",
  "publicationDate": "2024-05-15"
}
```

The application should only update the book after confirming that the selected author is valid. If either the book or the selected author cannot be found, the update should not be applied. This prevents books from being linked to authors who do not exist.

**Expected responses:**

- `200 OK` – The book was successfully updated with the selected author.
- `400 Bad Request` – The supplied information is invalid or required information is missing.
- `404 Not Found` – The book or selected author does not exist.
- `500 Internal Server Error` – An unexpected error occurred while processing the request.

## 4. How Author Search and Selection Should Work

The expected process for creating or updating a book is straightforward:

1. The user starts creating a new book or editing an existing one.
2. The user enters an author's name or custom ID into the author search field.
3. The application sends a request to `GET /authors/search?q={searchTerm}`.
4. The matching authors are displayed, including their custom IDs, names, and birth years.
5. The user selects the correct author from the results.
6. The application takes the selected author's custom ID and uses it as the book's `authorId`.
7. The book is submitted with the selected author information.

The purpose of this process is to ensure that users select an existing author instead of manually entering an author name that may not match any record in the database.

A separate graphical user interface is not required by this specification. However, the search and linking process must be possible to demonstrate using API requests and the Swagger interface.

Throughout this process, the application must use the custom author ID rather than MongoDB's automatically generated `_id`.

## 5. Route Registration

The author search route must be registered before the route used to retrieve an individual author.

For example, `GET /authors/search` should appear before `GET /authors/:id` in the Express route configuration.

This is important because Express could otherwise interpret `search` as an author ID and send the request to the wrong route.

## 6. Acceptance Criteria

This feature will be considered complete when:

- Clients can search for authors using their names or custom IDs.
- Name searches support partial matches and ignore uppercase and lowercase differences.
- Search terms are trimmed before they are processed.
- Search results include the author's custom ID, name, and birth year.
- A search with no matching authors returns an empty array with `200 OK`.
- A missing or empty search term returns `400 Bad Request`.
- Clients can select an author from the search results.
- The selected author's custom ID is stored in the book's `authorId` field.
- The application confirms that an author exists before linking them to a book.
- An existing book can be reassigned to another valid author.
- Invalid author references cannot be used to create or update books.
- An author cannot be deleted while existing books still reference that author.
- The author search route is registered before the parameterized author route.
- The search and linking functionality is documented in Swagger.

## 7. Swagger Documentation and Testing

All the relevant endpoints should be documented in Swagger/OpenAPI so that developers can understand and test how the search and linking process works.

The documentation should include:

- The author search route and its `q` query parameter.
- The expected search response, including an empty result.
- The possible HTTP status codes for each endpoint.
- The request body required when creating a book with an author.
- The request body required when updating a book's author.

All these operations should be available for testing through Swagger at `/api-docs`, both in the local development environment and on the deployed Render application.
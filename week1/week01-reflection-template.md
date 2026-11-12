# Week 01 Reflection

1. Include a link to one of your Pull Requests (PRs) at GitHub. (It should be merged and closed at this point.)

GitHub Pull Request Link: https://github.com/watoja/cse341-books/pull/7 

2. Include a link to one of your Issues at GitHub. (It should be closed at this point.)

GitHub Issue Link: https://github.com/watoja/cse341-books/issues/3

3. Which issue took more or less time than expected? Why?

Answer: Deploying the API to render and cnnecting it successfully to MongoDB Atlas was a challenge that stalled and stretched me. After running locally successfully, I received errors in render and it could not deploy the application. This connection error resulted in a lot of checks about IP access settings for MongoDB, a deep thought about my Variables under environment and examining render logs for the most current deploys. A conflict of why the API ran successfully locally , however failed to be deployed via render was chaotic. I learned that an application can easily run locally due to correct method application-where most of the focus could be applied. Nevertheless, Systematic collaboration is required for a local product to be broadcasted on web.

4. Include a link to your walk-though video. (It must include your name, show your web service working at Render, explain the way your `Get Single Book` controller works, and discuss status codes.):


Video link: https://docs.google.com/videos/d/1-dDDg_HvKWEy28ctoHVlDpLBWy0cozH6Mv40UcO5v1k/play?usp=sharing

5.a. Include a GitHub link to a file that shows how your app uses sensitive data, such as the MongoDB connection string.

GitHub link: https://github.com/watoja/cse341-books/blob/main/week1/src/db/connect.js 

5.b. How did you store sensitive data? Why is that approach important?

Answer: I stored sensitive data such as "MONGODB_NAME, node.js connection string" in the .env file and guarded it under the .gitignore file. The .gitignore file secures confidential data so that it is not pushed to the repository and is never accessible to other users who could engage with the console. This ensures security of passwords and crucial information of the database.

6.a. Include a GitHub link to a file that shows one other implementation decision you made.

GitHub link:https://github.com/watoja/cse341-books/blob/main/week1/src/controllers/books.js 

6.b. What decision does this file show, and why did you make that choice?

Answer: I made this choice to maintain separation of concerns within the application. This enhances distribution of roles with every request and responses are kept tailored to requests specifically. The controller is responsible for handling HTTP requests and responses, while the model handles database operations. This makes the code easier to understand, maintain, test, and extend without mixing database logic with request-handling logic.

I also chose to use different HTTP status codes depending on the outcome:
- 200 OK: The requested book or list of books was successfully retrieved.
- 404 Not Found: The requested book ID does not exist in the database.
- 500 Internal Server Error: An unexpected error occurs while retrieving data.
Additionally, I return a general error message to the client while logging the actual error on the server. This prevents internal application details from being exposed to users while still allowing developers to investigate problems.

Most importantly, this decision makes the API more predictable, secure, maintainable, and consistent with REST API conventions.

7. What is one specific habit or process you will work on for next week?

Answer: I will work on next week is testing my application in small steps before moving to the next development task. I will make it a habit to test each feature locally, run ESLint,
 check the Git changes, and verify that the feature works in the hosted environment after deployment.

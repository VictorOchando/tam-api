# TAM-API Docs:

TAM-API is a REST API that allows you to have complete control over your business while keeping a close relationship with your employees and customers. With it you can easily manage your database and it even automates the process of uploading the customers and users photos to your own amazon s3 bucket so you dont have to worry about managing them.

-   [Getting started](#getting-started)
-   [Routes](#routes)
    -   [Auth](#auth)
    -   [Customers](#customers)
    -   [Users](#users)
-   [Testing](#testing)
-   [Photo Uploads](#photo-uploads)

# Getting started

To start using TAM-API just clone the project and run

    npm install

Next, you would need to have a .env file with your own data for the project to run. As an extra help, a .env.example file is included to guide you through this process.

You will also need to create your first admin-user. This can be achieved through the `/register` endpoint, sending a valid user with a `registerPassword` field that matches the REGISTER_PASSWORD in your .env file. After this admin is created, you can either tell other admins to register by sharing with them the register password, or delete it and create other users by yourself, using your admin-user credentials.

    {
    name: "example",
    surname: "example",
    email: "valid@email.com",
    role: "admin",
    password: "1234",
    registerPassword: "REGISTER_PASSWORD",
    }

Once that is done, you can run the server using:

    npm start

TAM-API should now be reachable on port 3000.

# Routes

Routes can be divided into three groups:

    -   auth
    -   customers
    -   users

Any errors in these routes should be self-explanatory. For example, trying to patch or get a non-existan id will return a 404 status with the message `User/customer not found`, or failing to pass a validation will return a 400 status with an error message specifying which fields didn't validate.

-   ## Auth

| auth | /         |
| ---- | --------- |
| POST | /login    |
| POST | /register |

Auth is the only unprotected route of the API and it holds the login and register. Register will only accept requests with the correct `registerPassword` and can be disabled by removing `REGISTER_PASSWORD` from .env file.

Login will send back an `auth-token` in the header of the response once supplied with a correct email and password combination.
Default duration of these tokens is set at 5 hours but can be changed in .env

## Customers

| customers | /customers |
| --------- | ---------- |
| POST      | /          |
| GET       | /          |
| GET       | /:id       |
| PATCH     | /:id       |
| DELETE    | /:id       |

The endpoints of this route are all protected by middleware that checks if you have a valid `auth-token` header from the previous login. All users can manage customers. An example of a valid POST to customer would be:

    {
        name: "customerName",
        surname: "customerSurname"
    }

The photo property is optional and can either be an url to an already hosted image or a file that will be uploaded to your own AWS S3 bucket and it's url saved. By default, the size limit is set to 500kb and photo extension is limited to jpg/jpeg/png. These options can be changed in the multer.js file inside the `middlewares` folder.

When creating a customer, it will have a `createdBy` property which contains an ObjectId that references the user that created it. When PATCHING an existing user, the property `modifiedBy` will also be created or modified to reflect the last user that modified the customer. This fields will be automatically populated with the user's name and surname.

    {
    "_id": "60de2b7248280d01205c9239",
    "name": "exampleName",
    "surname": "exampleSurname",
    "photo": "https://example.s3.eu-west-1.amazonaws.com/60de2b7248280d01205c9239",
    "createdBy": {
        "_id": "60dbc0850166f30d0cf9e1dd",
        "name": "m",
        "surname": "asdadadadada"
    },
    "__v": 0
    }

\*NOTE: When the user referenced in `createdBy` or `modifiedBy` is deleted, it will show up as null, so that front can manage it with `Deleted user` or similar.

When a user gets deleted, it will also delete its corresponding file from the S3 bucket (if it exists).

## Users

| users  | /users |
| ------ | ------ |
| POST   | /      |
| GET    | /      |
| GET    | /:id   |
| PATCH  | /:id   |
| DELETE | /:id   |

Apart from checking if you are logged in, the users routes also check if you have the admin role, since normal users are only allowed to operate with customers and not other users.

When a user is created or its password modified, it will be hashed with bcrypt before going into the db. Also everytime a user or users are returned, the password field will be omitted.

# Testing

This API comes with extensive automated tests for every endpoint. To run them use:

    npm test

That will connect to the test database you have specified in .env, wipe it just in case, and proceed to test each endpoint with various cases, like wrong info, not logged in, etc.

If everything worked, you should just see the green message `41 passing`. If there are any errors, it will list specifically each case that failed to pass the test. For example:

     1) /post /register
       respond with created user:

      Uncaught AssertionError: expected 400 to equal 200
      + expected - actual

      -400
      +200

# Photo uploads

Whenever a user decides to upload a photo, multer will check if the requirements are met (by default 500kb max and only jpg/jpeg/png formats) and will decline the upload if they are not.If they are, it will upload it to your S3 bucket with the owner's `_id` as its name. After that it will delete the image from the node server to clear space.

When a customer/user is deleted, it will check on the S3 if there's any file with its `_id` and delete it if that's the case. The general S3 bucket permissions are up to you, but the API should have read and write access.

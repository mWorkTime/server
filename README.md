# Application for working time management

In the application you can register your organization. After registration, you can create users who are part of 
the organization and assign them roles: "Employee", "Manager". The manager gives tasks to the employees. 
Employees can see the tasks on their Tasks page and get involved in the work. 
After completion of the task, the employee can send a report on the work performed in the "Reports" section. 

## How to install and run server

* Clone this repository on your PC
* Create `.env`, copy the fields with `.env.expample` and fill in
* Run ```npm install```
* Run ```npm run start```

### Structure

- **node_modules** - libraries.
- **controllers** - includes functions that are used in routes
- **emails** - includes files with default templates for mail
- **models** - includes schemas. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
- **routes** - includes routes. Routing refers to how an application’s endpoints (URIs) respond to client requests.
- **services** - include functions that are worked with database and returned result to user.
- **validators** - includes validators that are used in routes, also, for validate data which will come from front-end
- **index.js** - main file that are starting our server and connecting to database
- **.env.example** - includes the example default settings required to start the server

## Using frameworks

* [Express JS](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [JSON Web Tokens (JWT)](https://jwt.io/) - JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mWorkTime/server/blob/master/LICENSE) file for details

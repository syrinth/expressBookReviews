const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => user.username === username && user.password === password);

    if(validusers.length > 0){
        return true;
    }
    else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization){
        const isbn = req.params.isbn;
        const review = req.body.review;

        let number = Object.keys(books[isbn].reviews);
        books[isbn].reviews[number + 1] = {
            "username":req.session.authorization.username,
            "review":review,
        }
        res.send(JSON.stringify(books[isbn].reviews[number + 1]));
    }
    else{
        return res.status(404).json({message: "Please login"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization){
        const isbn = req.params.isbn;
        for (const [key, value] of Object.entries(books[isbn].reviews)) {
            if(value.username == req.session.authorization.username){
                delete (books[isbn].reviews[key]);
                break;
            }
        }
        return res.status(200).send({message: "Review successfully deleted", reviews: JSON.stringify(books[isbn].reviews)});
    }
    else{
        return res.status(404).json({message: "Please login"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

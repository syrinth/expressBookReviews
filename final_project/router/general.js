const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExit = (username) => {
    let found_users = users.filter((user) => user.username === username);

    if(found_users.length > 0){
        return true;
    }
    else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesExit(username)){
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User registered"});
    }
    else{
        return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user"});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise= new Promise((resolve) => {
        resolve(books);
    });

    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage));
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise= new Promise((resolve) => {
        const isbn = req.params.isbn;

        resolve(books[isbn]);
    });

    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage));
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise= new Promise((resolve, reject) => {
        const author = req.params.author;

        let found_books = [];
        for (const [key, value] of Object.entries(books)) {
            if(value.author === author){
                found_books.push(value);
            }
        }

        resolve(found_books);
    });

    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise= new Promise((resolve) => {
    const title = req.params.title;
    
    let found_books = [];
    for (const [key, value] of Object.entries(books)) {
        if(value.title === title){
            found_books.push(value);
        }
      }
    
        resolve(found_books);
    });

    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;

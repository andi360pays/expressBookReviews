const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = require("./general.js").users;

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

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
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;// req.body.username;
  let userReview = req.query.review;

  let bookNum = Object.keys(books).filter((item) => {
    return item === isbn;
  });


  if (bookNum.length > 0) {
    let bookKey = bookNum[0];
    if (!books[bookKey].reviews) {
      books[bookKey].reviews = {};
    }

    if (username in books[bookKey].reviews) {
      books[bookKey].reviews[username] = userReview;
    } else {
      books[bookKey].reviews[username] = userReview;
    }

    return res.status(200).json(books[bookKey]);
  } else {
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
//module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
const public_users = express.Router();

let users = [];

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let myPromise = Promise.resolve(books); // Resolve the promise immediately with the books object

  myPromise
    .then((resolvedBooks) => {
      console.log(resolvedBooks);
      res.status(300).json(resolvedBooks); // Return books as JSON response
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Bad Request");
    });

  // return res.status(300).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let bookPromise = new Promise((resolve, reject) => {
    let bookNum = Object.keys(books).filter((item) => {
      return (item === isbn)
    });
    if (bookNum.length > 0) {
      resolve(books[bookNum[0]]);
    } else {
      reject("Book not found");
    }
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });


  // let isbn = req.params.isbn;
  // let bookNum = Object.keys(books).filter((item) => {
  //   return (item === isbn)
  // });

  // return res.status(300).json(books[bookNum]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let bookPromise = new Promise((resolve, reject) => {
    let bookByAuthor = Object.values(books).filter((item) => {
      return (item.author === author)
    });
    if (bookByAuthor) {
      resolve(bookByAuthor);
    } else {
      reject("Book not found");
    }
  });

  bookPromise
    .then((bookByAuthor) => {
      res.status(200).json(bookByAuthor);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });

  // let author = req.params.author;
  // let bookByAuthor = Object.values(books).filter((item) => {
  //   return (item.author === author)
  // });
  // return res.status(300).json(bookByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let bookPromise = new Promise((resolve, reject) => {
    let book = Object.values(books).filter((item) => {
      return (item.title === title)
    });
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });

  // let title = req.params.title;
  // let book = Object.values(books).filter((item) => {
  //   return (item.title === title)
  // });

  // return res.status(300).json(book);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let bookNum = Object.keys(books).filter((item) => {
    if (item === isbn)
      return item;
  });

  return res.status(300).json(books[bookNum].reviews);
});

module.exports.general = public_users;
module.exports.users = users;
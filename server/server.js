const express = require('express');
const cors = require('cors');
const app = express();
const fs =  require('fs');
const bodyParser = require('body-parser');

// ROUTES
app.use(cors());
app.use(bodyParser.json());

function idGenerator(){
    return Math.floor((Math.random() * 1000000) + 1);
}

// LOGIN USER
app.post('/api/books/login', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/users.json'));
        if(!data.length) {
            res.status(404).send({code: "no-users"});
        } else {
            for(let i = 0; i < data.length; i++) {
                const comparison = {mail: data[i].mail, password: data[i].password}
                if(JSON.stringify(comparison) === JSON.stringify(req.body)) {
                    res.status(200).send(data[i]);
                    break;
                } else {
                    if(i === data.length - 1) {
                        res.status(404).send({code: "user-not-found"});
                    }
                }
            }
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

// SIGNUP USER
app.post('/api/books/signup', (req,res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/users.json'));
        let newUser = req.body;
        if(data.some(user => user.mail === req.body.mail)) {
            res.status(401).send({code: "already-signed-up"})
        } else {
            newUser.id = idGenerator();
            newUser.superUser = Boolean(newUser.mail === "mushvig@gmail.com");
            data.push(newUser);
            fs.writeFileSync('db/users.json', JSON.stringify(data));
            res.status(200).send({id: newUser.id});
        }
    } catch (error) {
        res.status(500).send({code: "could-not-sign-up"})
    }
})




// GET ALL BOOKS
app.get('/api/books', (req,res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/db.json'));
        setTimeout(() => res.status(200).send(data), 1000);    
    } catch (error) {
        res.sendStatus(500);
    }
});

// GET A BOOK BY ID
app.get('/api/books/:id', (req,res) => {
    try {
        const allBooks = JSON.parse(fs.readFileSync('db/db.json'));
        const bookById = allBooks.filter(book => book.id == req.params.id);
        if(bookById.length) {
            res.json(bookById[0])
        } else {
            res.status(404).send({code: "not-found"})
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

// PUBLISH A BOOK
app.post('/api/books', (req,res) => {
    try {
        const books = JSON.parse(fs.readFileSync('db/db.json'));
        const newBook = req.body;

        if(newBook.id == "" || newBook.id == undefined) {
            newBook.id = idGenerator();
            books.push(newBook);
            fs.writeFileSync('db/db.json', JSON.stringify(books));
        } else {
            books.map(book => {
                if(book.id == newBook.id) {
                    book.title = newBook.title
                    book.author = newBook.author,
                    book.publishDay = newBook.publishDay,
                    book.genre = newBook.genre,
                    book.imageUrl = newBook.imageUrl,
                    book.price = newBook.price,
                    book.bookCover = newBook.bookCover,
                    book.publisher = newBook.publisher,
                    book.sold = newBook.sold,
                    book.synopsis = newBook.synopsis
                }
            });
            fs.writeFileSync('db/db.json', JSON.stringify(books));
        }
       setTimeout(()=> res.status(200).send({id: newBook.id}),4000);
    } catch(err) {
        res.sendStatus(500);
    }
});

// DELETE A BOOK
app.delete('/api/books/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/db.json'));
        const result = data.find(book => book.id == req.params.id);
        if(Boolean(result)) {
            const newList = data.filter(book => book.id != req.params.id);
            fs.writeFileSync('db/db.json', JSON.stringify(newList));
            setTimeout(() => res.sendStatus(200), 3000);
        } else {
            res.status(404).send({code: "no-book-found"})
        }
    } catch(err) {
        res.sendStatus(500);
    }
});

// GET ALL AUTHORS
app.get('/api/authors', (req,res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/authors.json'));
        setTimeout(() => res.status(200).send(data), 5000);    
    } catch (error) {
        res.sendStatus(500);
    }
});

// GET AN AUTHOR BY ID
app.get('/api/authors/:id', (req,res) => {
    try {
        const allAuthors = JSON.parse(fs.readFileSync('db/authors.json'));
        const authorById = allAuthors.filter(author => author.id == req.params.id);
        if(authorById.length) {
            res.json(bookById[0])
        } else {
            res.status(404).send({code: "not-found"})
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

// DELETE AN AUTHOR
app.delete('/api/authors/:id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/authors.json'));
        const result = data.find(book => book.id == req.params.id);
        if(Boolean(result)) {
            const newList = data.filter(book => book.id != req.params.id);
            fs.writeFileSync('db/authors.json', JSON.stringify(newList));
            res.sendStatus(200);
        } else {
            res.status(404).send({code: "no-author-found"})
        }
    } catch(err) {
        res.sendStatus(500);
    }
});

// POST AN AUTHOR
app.post('/api/authors', (req,res) => {
    try {
        const authors = JSON.parse(fs.readFileSync('db/authors.json'));
        const newAuthor = req.body;

        if(newAuthor.id == "" || newAuthor.id == undefined) {
            newAuthor.id = idGenerator();
            authors.push(newAuthor);
            fs.writeFileSync('db/authors.json', JSON.stringify(authors));
        } else {
            authors.map(author => {
                if(author.id == newAuthor.id) {
                    author.name = newAuthor.name
                    author.imgUrl = newBook.author,
                    author.biography = newAuthor.biography
                }
            });
            fs.writeFileSync('db/authors.json', JSON.stringify(authors));
        }
        res.status(200).send({id: newAuthor.id});
    } catch(err) {
        res.sendStatus(500);
    }
});

// GET ALL USERS
app.get('/api/users', (req,res) => {
    try {
        const data = JSON.parse(fs.readFileSync('db/users.json'));
        setTimeout(() => res.status(200).send(data), 200);    
    } catch (error) {
        res.sendStatus(500);
    }
});



app.listen("3000");
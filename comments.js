// Create web server
// 1. create web server object
// 2. listen to port
// 3. handle request
// 4. send response

// create server object
const http = require('http');
// create file system object
const fs = require('fs');
// create url object
const url = require('url');
// create querystring object
const querystring = require('querystring');
// create comments object
const comments = require('./comments');

// listen to port
const port = 8000;
const server = http.createServer((req, res) => {
    // handle request
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const commentId = parsedQuery.id;
    const commentIndex = comments.findIndex((comment) => {
        return comment.id === commentId;
    });
    // handle response
    if (pathname === '/' && method === 'GET') {
        // send index.html
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
            res.statusCode = 200;
            res.end(data);
        });
    } else if (pathname === '/comments' && method === 'GET') {
        // send comments
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(comments));
    } else if (pathname === '/comments' && method === 'POST') {
        // add comment
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const comment = JSON.parse(body);
            comments.push(comment);
            res.statusCode = 201;
            res.end();
        });
    } else if (pathname === '/comments' && method === 'PUT') {
        // update comment
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const comment = JSON.parse(body);
            comments[commentIndex] = comment;
            res.statusCode = 200;
            res.end();
        });
    } else if (pathname === '/comments' && method === 'DELETE')

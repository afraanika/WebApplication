const express = require('express');
const { request, response } = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const url = require('url');

var path;
function renderHTML(path, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile(path, null, function(error, data ){
        if (error) {
            response.writeHead(404);
            response.write('File Not Found');           
        }
        else {
            response.write(data);
        }
        response.end();
    })
}
function getConnection(){
        return mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'webapp'
    })

}

app.use(express.static('./'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/landing_page', (request, response) => {
    const postEmail = request.body.email;
    const postPassword = request.body.password;
    const connection = getConnection();

    connection.query("Select * from users ", (error, rows, fields) => {
        if(error) {
            console.log("Connection Failed")
            response.sendStatus(500)
            return
        }
        var i;
        var check = false;
        for (i = 0; i < rows.length; i++) {
            if(postEmail.localeCompare(rows[i].email) == 0  && postPassword.localeCompare(rows[i].password) == 0){
                check = true;
            }
        }
        if(check) {
            renderHTML('./success.html', response);
        }
        else {
            renderHTML('./error.html', response);
        }
    })
})

app.get('/', (request, response) => {
    renderHTML('./login.html', response);
})

app.listen(5000, () => {
    console.log("Server is listening");
})
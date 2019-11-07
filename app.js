const express = require('express')
const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let db = new sqlite3.Database('./test.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

db.run('CREATE TABLE IF NOT EXISTS TEST_TABLE (id INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT);');

app.get('/', (req, res) => {
   res.send('Hello World!')
});

app.post('/insert', (req, res) =>  {
   const name = req.body.name;
   // The first arguement is your SQL with parameters indicated by ?, the order of the parameters is the order
   //   they will be applied. The second arguement is the array of parameters. In this case only one
   db.run('INSERT INTO TEST_TABLE(NAME) VALUES (?)', [name], function(err){
    if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
   });
   res.sendStatus(200)
});

app.get('/select', (req, res) => 
{
   const results = [];
   const name = req.query.name;
   db.all('SELECT * FROM TEST_TABLE WHERE NAME = ?', [name], (err,rows) => {
    rows.forEach((row) => {
        // NOTE the row.<field> must match the casing of the database, ie row.name does not work
        results.push(row.NAME);
    });
    res.send(JSON.stringify(results));
   });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const { query } = require('express');
const express = require('express');
const app = express();
app.use(express.json());


// PSQL Connection Creation
const { Client } = require('pg');

const client = new Client({
    user: 'test_user',
    host: 'localhost',
    database: 'testdb',
    password: 'test@123',
    port: 5432,
});

client.connect();

// RAW sql for fetching all db rows data from entries table
const schemaQuery1 = `
CREATE TABLE Student (
    id serial NOT NULL PRIMARY KEY,
    name varchar,
    email varchar
);
`;

const schemaQuery2 = `
CREATE TABLE StudentScore (
    id serial NOT NULL PRIMARY KEY,
    student_id int,
    round varchar,
    score Int
);
`;

let sql = "SELECT * FROM  entries";


//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to mukul\'s REST API with Node.js !!');
});

// app.get('/schema', (req, res) => {
//     client
//     .query(schemaQuery1)
//     .then(res => {
//         console.log('Table is successfully created');
//     })
//     .catch(err => {
//         console.error(err);
//     })
//     .finally(() => {
//         client.end();
//     });
//     client
//     .query(schemaQuery2)
//     .then(res => {
//         console.log('Table is successfully created');
//     })
//     .catch(err => {
//         console.error(err);
//     })
//     .finally(() => {
//         client.end();
//     });
// });



// Required Post API to load all data from db
app.post('/add/student/', function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    
    let sql = `INSERT INTO Student(name, email) VALUES ('${name}', '${email}');`
    
    client
    .query(sql)
    .then(res => {
        res.send('Student stored successfully!');
    })
    .catch(err => {
        console.error(err);
    })

    res.send('Student stored successfully!')

});

app.post('/add/score/', function (req, res) {
    let email = req.body.email
    let round = req.body.round
    let score = req.body.score
    if ( score < 1 || score >10 ) {
        res.send("Score must be between 0 to 10")
    } 
    let find_student = `SELECT ID from Student where email = '${email}'`;
    client
    .query(find_student)
    .then(res => {
        if (res.rowCount > 0) {
            let studentID = res.rows[0].id
            console.log(res.rows[0].id)
            let insert_score = `INSERT INTO StudentScore(student_id, round, score) VALUES (${studentID}, '${round}', ${score});`
            client
            .query(insert_score)
            .then(
                res.send("score inserted succesfully!")
            )
            .catch(err => {
                res.send('Failed')
            })
        }
        else {
            res.send('Student Not found!')
        }  
    })
    .catch(err => {
        res.send('score inserted succesfully!')
    })
  });

app.get('/highestScorer', (req, res) => {
    let highestScoringStudent = `SELECT DISTINCT(round) from StudentScore`;

    res.send('Welcome to mukul\'s REST API with Node.js !!');
});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}..`));
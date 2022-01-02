const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

// connect to mlab database
// make sure to replace my db string & creds with your own

mongoose.connect('mongodb+srv://pranat:Dkooaf45@cluster0.oe0w1.mongodb.net/test')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
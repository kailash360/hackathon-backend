const express = require('express');
const app = express();
const db = require('./src/config/db.js')
const auth = require('./src/routes/auth.js')
app.use(express.json());

app.use('/auth', auth)

app.listen(process.env.PORT || 80, () => {
    console.log('Server started successfully');
})
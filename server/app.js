const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const cors = require('cors')
const routes = require('./routes');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())
app.use("/api", routes);

const PORT = config.get('port') ?? 8080;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => {
        console.log(chalk.green(`Server has been started on port ${PORT}...`))
    })
    } catch (error) {
        console.log(chalk.red(error.message))
        process.exit(1)
    }
}

start();

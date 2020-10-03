import express from 'express';
import cors from 'cors'
import config from './config/config';
import zombies from './routes/zombies';
import { catchErrors } from './middlewares/errors';
import bodyParser from 'body-parser';
import babelPolyfill from 'babel-polyfill';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import swaggerOptions from './config/swagger';
import dbConfig from './config/database';
import mongoose from 'mongoose';

/* ------------- mongo db --------------- */
mongoose.connect(dbConfig.mongoUrl, {
  user: dbConfig.mongo_user,
  pass: dbConfig.mongo_password,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});


/* ------------- app --------------- */
const app = express();
app.use(cors())

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes config
app.use('/api/zombies', zombies());

// errors handling
app.use(catchErrors);

//api documentation by swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// start the server
app.listen(config.server.port, () => {
    console.log(`Server is up on port ${config.server.port}`);
});

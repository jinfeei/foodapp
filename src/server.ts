import * as firebaseAdmin from "firebase-admin";
import indexRoute from "./routes/index.route";
import cors from "cors";
import {
  FIREBASE_DATABASE_URL,
  FIREBASE_JSON_PATH,
  MYSQL_CONNECTION_STRING,
} from "./helpers/constants";

const Fastify = require("fastify");
const log = require("pino")({ level: "info", prettyPrint: true });

const PORT = process.env.PORT || 3000;
const serviceAccount = require(FIREBASE_JSON_PATH);
const path = require("path");

async function build() {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });

  const fastify = Fastify({ logger: log });

  await fastify.register(require("middie"));
  fastify.use(require("cors")());

  fastify.setErrorHandler((error, req, res) => {
    req.log.error(error.toString());
    res.send({ error });
  });

  const corOptions: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  };

  fastify.use(cors(corOptions));

  fastify.register(require("fastify-mysql"), {
    promise: true,
    connectionString: MYSQL_CONNECTION_STRING,
  });

  fastify.register(require("fastify-static"), {
    root: path.join(__dirname, "../public"),
    prefix: "/public/",
  });

  fastify.register(indexRoute);
  fastify.decorateRequest("fastify", fastify);

  return fastify;
}

build()
  .then((fastify) =>
    fastify.listen(+PORT, "0.0.0.0", (err, host) => {
      if (err) throw err;
      console.log(`FoodApp server listening on ${host}`);
    })
  )
  .catch(console.log);

import {
  consoleError,
  consoleInfo,
  //getRandomNumberBetween,
  //validEmail,
  //validPassword,
} from "../helpers/utils";
import {
  ApiErrors,
  ApiMessages,
  responseClientError,
  responseOK,
  responseServerError,
} from "../helpers/response-builder";
import { REPL_MODE_SLOPPY } from "repl";

export async function getUserByUid(req: any, res: any) {
  consoleInfo("CALLING SERVICE: getUserByUid");
  try {
    console.log(req.user);

    const connection = await req.fastify.mysql.getConnection();
    const uid: string = req.user.uid;
    const sqlStmt = req.fastify.mysql.format("CALL `UserGet`(?);", [uid]);

    const [rows, fields] = await connection.query(sqlStmt);
    connection.release();
    return res.code(200).send(responseOK(ApiMessages.public, { result: rows }));
  } catch (err) {
    consoleError(err);
    return res.code(500).send(responseServerError());
  }
}

export async function balanceUser(req: any, res: any) {
  consoleInfo("CALLING SERVICE: balanceUser");
  try {
    const connection = await req.fastify.mysql.getConnection();
    const [rows, fields] = await connection.query("SELECT * FROM CartEx");
    connection.release();
    return res.code(200).send(responseOK(ApiMessages.public, { result: rows }));
  } catch (err) {
    consoleError(err);
    return res.code(500).send(responseServerError());
  }
}
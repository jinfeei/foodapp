import { consoleError } from "../helpers/utils";
import { ApiErrors, responseClientError } from "../helpers/response-builder";

import * as admin from "firebase-admin";

export async function trivialAuth(req: any, res: any, next: any) {}

export async function ensureAuth(req: any, res: any, next: any) {
  if (!req.headers.authorization) {
    return res
      .code(400)
      .send(responseClientError(ApiErrors.missing_authentication));
  }

  try {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");

    if (!m) {
      return res
        .code(400)
        .send(responseClientError(ApiErrors.authentication_error));
    }

    const decodedToken = await admin.auth().verifyIdToken(m[1], true);

    if (!decodedToken) {
      return res
        .code(400)
        .send(responseClientError(ApiErrors.authentication_error));
    } else {
      req.user = decodedToken;
    }
  } catch (ex) {
    consoleError(ex.message);
    if (ex.message === "Token expired") {
      return res.code(400).send(responseClientError(ApiErrors.token_expired));
    } else {
      return res
        .code(400)
        .send(responseClientError(ApiErrors.authentication_error));
    }
  }
}

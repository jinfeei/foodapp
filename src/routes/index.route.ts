import * as firebaseAuth from "../helpers/firebaseauth";
import * as UserService from "../controllers/user.service";
import { doesNotMatch } from "assert";

export default function indexRoute(server, options, next) {
  server.get("/", function (req: any, res: any) {
    res.send("FoodApp API - Version 1.00");
  });

  server.get(
    "/getuserbyuid",
    { preHandler: [firebaseAuth.ensureAuth] },
    UserService.getUserByUid
  );

  server.get("/balance", UserService.balanceUser);

  next();
}

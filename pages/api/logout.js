import { withIronSessionApiRoute } from "iron-session/next";
import { sessionCookie } from "../../lib/session";

export default withIronSessionApiRoute(
  function logoutRoute(req, res, session) {
    req.session.destroy();
    res.send({ status: "success" });
  },
  sessionCookie()
);
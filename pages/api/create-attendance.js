import { PrismaClient } from '@prisma/client'
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionCookie } from '../../lib/session';

  
export default withIronSessionApiRoute( async function handler(req, res) {

  const prisma = new PrismaClient()

  const user = req.session.user

  const attendanceSheet = await prisma.attendanceSheet.create({
      data: {
        userId: user.id,
      },
  })

  res.json({status: "success", data: attendanceSheet});
    
}, sessionCookie())

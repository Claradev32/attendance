import { PrismaClient } from '@prisma/client'
import { withIronSessionApiRoute } from "iron-session/next";
import { parseBody } from '../../lib/parseBody';
import { sessionCookie } from '../../lib/session';

  
export default withIronSessionApiRoute( async function handler(req, res) {

    const prisma = new PrismaClient()

    const {attendanceSheetId, action} = parseBody(req.body)

    const user = req.session.user

    const attendance = await prisma.attendance.findMany({
        where: {
            userId: user.id,
            attendanceSheetId: attendanceSheetId
        }
    })

    //check if atendance have been created
    if (attendance.length === 0) {
        const attendance = await prisma.attendance.create({
            data: {
                userId: user.id,
                attendanceSheetId: attendanceSheetId,
                signIn: true,
                signOut: false,
                signOutTime: new Date()
            },
        })   

        return res.json({status: "success", data: attendance});

    } else if (action === "sign-out") {
        await prisma.attendance.updateMany({
            where: {
                userId: user.id,
                attendanceSheetId: attendanceSheetId
            },
            data: {
              signOut: true,
              signOutTime: new Date()
            },
        })

        return res.json({status: "success", data: { ...attendance[0], signOut: true, signOutTime: new Date()}});
    }

    res.json({status: "success", data: attendance});
    
}, sessionCookie())

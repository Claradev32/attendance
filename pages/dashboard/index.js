import { withIronSessionSsr } from "iron-session/next";
import Head from 'next/head'
import { useState, useCallback } from "react";
import { PrismaClient } from '@prisma/client'
import SideBar from '../../components/SideBar'
import styles from '../../styles/Home.module.css'
import dashboard from '../../styles/Dashboard.module.css'
import { sessionCookie } from "../../lib/session";
import { postData } from "../../lib/request";


export default function Page(props) {

  const [attendanceSheet, setState] = useState(JSON.parse(props.attendanceSheet));

  const sign = useCallback((action="") => {

    const body = {
      attendanceSheetId: attendanceSheet[0]?.id,
      action
    }

    postData("/api/sign-attendance", body).then(data => {

      if (data.status === "success") {

        setState(prevState => {

          const newState = [...prevState]

          newState[0].attendance[0] = data.data

          return newState

        })
     
      }

    })

  }, [attendanceSheet])


  const createAttendance = useCallback(() => {

    postData("/api/create-attendance").then(data => {

      if (data.status === "success") {
        alert("New Attendance Sheet Created")
        setState([{...data.data, attendance:[]}])
      }

    })

  }, [])

  return (
    <div>

      <Head>
        <title>Attendance Management Dashboard</title>
        <meta name="description" content="dashboard" />
      </Head>

      <div className={styles.navbar}></div>

      <main className={styles.dashboard}>

        <SideBar />

        <div className={dashboard.users}>

          {
            props.isAdmin && <button className={dashboard.create} onClick={createAttendance}>Create Attendance Sheet</button>
          }
            
          { attendanceSheet.length > 0 &&

            <table className={dashboard.table}>
              <thead>
                <tr> 
                  <th>Id</th> <th>Created At</th> <th>Sign In</th> <th>Sign Out</th> 
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{attendanceSheet[0]?.id}</td>
                  <td>{attendanceSheet[0]?.createdAt}</td>

                  {
                    attendanceSheet[0]?.attendance.length != 0 ? 
                      <>
                        <td>{attendanceSheet[0]?.attendance[0]?.signInTime}</td>
                        <td>{
                          attendanceSheet[0]?.attendance[0]?.signOut ? 
                          attendanceSheet[0]?.attendance[0]?.signOutTime: <button onClick={() => sign("sign-out")}> Sign Out </button> }</td>
                      </>
                      :
                      <>
                        <td> <button onClick={() => sign()}> Sign In </button> </td>
                        <td>{""}</td>
                      </>
                  }
                </tr>
              </tbody>

            </table>

          }
          
        </div>

      </main>

    </div>
  )
}

export const getServerSideProps = withIronSessionSsr( async ({req}) => {

  const user = req.session.user

  const prisma = new PrismaClient()

  const attendanceSheet = await prisma.attendanceSheet.findMany({  
    take: 1,
    orderBy: {
      id: 'desc',
    },
    include: { 
      attendance: {
        where: {
          userId: user.id
        },
      }
    }
  })

  return {
    props: {
      attendanceSheet: JSON.stringify(attendanceSheet),
      isAdmin: user.role === "ADMIN"
    }
  }

}, sessionCookie()) 

import { withIronSessionSsr } from "iron-session/next";
import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import SideBar from '../../components/SideBar'
import styles from '../../styles/Home.module.css'
import dashboard from '../../styles/Dashboard.module.css'
import { sessionCookie } from "../../lib/session";



export default function Page(props) {

  const data = JSON.parse(props.attendanceSheet)

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

        <table className={dashboard.table}>

          <thead>

            <tr> 
              <th> Attendance Id</th> <th>Date</th> 
              <th>Sign In Time</th> <th>Sign Out Time</th> 
            </tr> 

          </thead>

            <tbody>

              {
                data.map(data =>   {

                  const {id, createdAt, attendance } = data

  
                  return (
                    <tr key={id}> 

                      <td>{id}</td> <td>{createdAt}</td>  

                      { attendance.length === 0 ? 
                      
                        (
                          <>
                            <td>You did not Sign In</td>
                            <td>You did not Sign Out</td>
                          </>
                        )
                        :
                        (
                          <>
                            <td>{attendance[0]?.signInTime}</td>
                            <td>{attendance[0]?.signOut ? attendance[0]?.signOutTime : "You did not Sign Out"}</td>
                          </>
                        )
                        
                      }
              
                    </tr>
                  )

                })

              }  

            </tbody>

          </table>

        </div>

      </main>

    </div>
  )
}

export const getServerSideProps = withIronSessionSsr( async ({req}) => {

  const user = req.session.user

  const prisma = new PrismaClient()
  // By unique identifier
  const attendanceSheet = await prisma.attendanceSheet.findMany({
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
    }
  }

}, sessionCookie()) 

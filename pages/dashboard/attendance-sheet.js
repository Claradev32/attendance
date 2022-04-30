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

        {
          data?.map(data => {

            const {id, createdAt, attendance } = data

            return (
              <>

                <table key={data.id} className={dashboard.table}>

                  <thead>
                    
                    <tr> 
                      <th> Attendance Id</th> <th>Date</th> 
                      <th> Name </th> <th> Email </th> <th> Role </th>
                      <th>Sign In Time</th> <th>Sign Out Time</th> 
                    </tr> 

                  </thead>

                  <tbody>

                    {
                      (attendance.length === 0)  &&
                      (
                        <>
                        <tr><td> {id} </td> <td>{createdAt}</td> <td colSpan={5}> No User signed this sheet</td></tr>
                        </>
                      )
                    }

                    {
                      attendance.map(data => {

                        const {name, email, role} = data.user

                      
                        return (
                          <tr key={id}> 

                            <td>{id}</td> <td>{createdAt}</td>  

                            <td>{name}</td> <td>{email}</td>

                            <td>{role}</td>

                            <td>{data.signInTime}</td>

                            <td>{data.signOut ? attendance[0]?.signOutTime: "User did not Sign Out"}</td>  
                    
                          </tr>
                        )

                      })

                    }  

                  </tbody>
                  
                </table>
              </>
            )
          })
          
          }

        </div>

      </main>

    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async () => {


  const prisma = new PrismaClient()
  // By unique identifier
  const attendanceSheet = await prisma.attendanceSheet.findMany({
    orderBy: {
      id: 'desc',
    },
    include: { 
      attendance: {
        include: { 
          user: {
            select: {
              name: true, 
              email: true, 
              role: true
            }
          }
        }
      },
    },

  })

  return {
    props: {
      attendanceSheet: JSON.stringify(attendanceSheet),
    }
  }

}, sessionCookie()) 

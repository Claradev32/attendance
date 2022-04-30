import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {

    const router = useRouter()


    const logout = async () => {

        try {

            const response = await fetch('/api/logout', {
                method: 'GET', 
                credentials: 'same-origin', 
            });

            if(response.status === 200)  router.push('/')

        } catch (e) {
            alert(e)
        }
  
    }
      

    return (
        <nav className={styles.sidebar}>

            <ul>

                <li> <Link href="/dashboard"> Dashboard</Link> </li>

                <li> <Link href="/dashboard/attendance"> Attendance </Link> </li>

                <li> <Link href="/dashboard/attendance-sheet"> Attendance Sheet </Link> </li>

                <li onClick={logout}> Logout </li>

            </ul>

        </nav>
    )

}

export default SideBar
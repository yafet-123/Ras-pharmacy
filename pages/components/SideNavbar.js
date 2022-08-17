import {useEffect,useState} from 'react'
import Link from 'next/link'
import styles from '../../styles/Sidebar.module.css'
import { FaGreaterThan } from 'react-icons/fa';

export default function SideNavbar({mrn}){
	return(
		<div className={styles.sidebar}>
            <div className={styles.top}>
                <h1>Casher</h1>
            </div>
            <hr className={styles.horizontal}/>
            <div className={styles.center}>
                <ul className={styles.ullist}>
                   	<li className={styles.list}>
                        <Link href={{pathname: `/Pharma/PharmacyRequest`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Pharmacy Request</span>
                            </a>
                        </Link>
                    </li>

                </ul>
            </div> 
        </div>
	)
}

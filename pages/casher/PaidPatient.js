import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'


export async function getServerSideProps(context) {
   const {params,req,res,query} = context
   const patient_id_Medical_Record = query.mrn
   const token = req.cookies.token
   if (!token) {
      return {
            redirect: {
            destination: '/login',
            permanent: false,
            },
         }
    }
   const accesstoken = token
   const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
   const authaxios = axios.create({
      baseURL : apiURL,
      headers :{
         Authorization : `Bearer ${accesstoken} `
      }
   })
   const data = await authaxios.get(`${apiURL}/casher/paid/${patient_id_Medical_Record}`)
   
   return {
      props: {
         patient:data.data,
       }, // will be passed to the page component as props
   }
}


export default function PaidPatient({patient}){
   const patientRadiology = patient['rad']
   const patientLabrotory = patient['lab']
   const ptientMRN = patient['info'].MRN
   return(
      <div className={styles.home}>
         <SideNavbar mrn={ptientMRN}/>
         <div className={styles.homeContainer}>
            <Header />
            <Container >
               <div className="bg-white border my-3 rounded">
                  <Row className="p-3">
                     <Col md={4} className="text-center">
                        <p>MRN</p>
                        <p>{patient['info'].MRN}</p>
                     </Col>
                     <Col md={4} className="text-center">
                        <p>Name</p>
                        <p>{patient['info'].Name}</p>
                     </Col>
                     <Col md={4} className="text-center">
                        <p>Age</p>
                        <p>{patient['info'].DateOfBirth}</p>
                     </Col>
                  </Row>

                  <Row className="p-3">

                     <Col md={4} className="text-center">
                        <p>Gender</p>
                        <p>{patient['info'].Gender}</p>
                     </Col>

                     <Col md={4} className="text-center">
                        <p>Phone Number</p>
                        <p>{patient['info'].Phonenumber}</p>
                     </Col>

                     <Col md={4} className="text-center">
                        <p>Occupation</p>
                        <p>{patient['info'].Occupation}</p>
                     </Col>
                  </Row>
               </div>
               {patientRadiology.map((data,index)=>(
                  <div key={index} className="bg-white border my-3 rounded">
                     <Row className="p-3">
                        <Col md={3} >
                           <h5>Id</h5>
                           <p>{data.id}</p>
                        </Col>

                        <Col md={3} >
                           <h5>Created By</h5>
                           <p>{data.CreatedBy}</p>
                        </Col>
                        <Col md={3}>
                           <h5>Requested Date</h5>
                           <p>{data.Requested_Date}</p>
                        </Col>

                        <Col md={3}>
                           <h5>Clinic</h5>
                           <p>{data.Clinic}</p>
                        </Col>
                     </Row>

                     <Row className="p-3">
                        <Col md={6} >
                           <h5>Approved By</h5>
                           <p>{data.ApprovedBy}</p>
                        </Col>
                        <Col md={6}>
                           <h5>Approved Date</h5>
                           <p>{data.ApprovedDate}</p>
                        </Col>
                     </Row>

                     <Row className="p-3">
                        <Col md={4} >
                           <h5>Request Id</h5>
                           <p>{data.Requestid}</p>
                        </Col>
                        <Col md={4}>
                           <h5>Request</h5>
                           <p>{data.Request}</p>
                        </Col>

                        <Col md={4}>
                           <h5>Price</h5>
                           <p>{data.Price}</p>
                        </Col>
                     </Row>

                  </div>
               ))}         
            </Container>
         </div>
      </div>
   )  
}
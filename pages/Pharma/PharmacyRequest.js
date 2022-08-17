import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState,useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import styles from '../../styles/Home.module.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Link from 'next/link'
import Cookies from 'universal-cookie';
import api from '../components/api.js'
import style from '../../styles/SickLeavePrint.module.css'
import moment from 'moment';
import {useReactToPrint} from "react-to-print";

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
	const authaxios = axios.create({
		baseURL : api,
		headers :{
			Authorization : `Bearer ${accesstoken} `
		}
	})
	const data = await authaxios.get(`${api}/prescription/${patient_id_Medical_Record}`)
	const data1 = await authaxios.get(`${api}/searchmedication/`)	
  	return {
    	props: {
	    	prescription  :data.data,
	    	medication: data1.data

	    }, // will be passed to the page component as props
	}
}

export default function DisplayPrescription({prescription,medication}) {
	console.log(prescription)
	const componentRef = useRef();
	const mrn = prescription[0].PatientId
	const cookies = new Cookies();
    const role = cookies.get('role')
	const [getSearchValue,setgetSearchValue] = useState("")
	const [id,setid]=useState("")
    const [Name,setName]=useState("")
    const [Price,setprice]=useState()
    const [Remaining, setRemaining]=useState()
    const router = useRouter();
    const [StockId, setStockId]= useState()
    const [OrderedQuantity, setOrderedQuantity]= useState()
    const [OrderedBy, setOrderedBy]= useState()
    const [PatientPrescriptionId, setPatientPrescriptionId]= useState()
    const [PatientId, setPatientId]= useState(mrn)

    const [show, setShow] = useState(false);
  	const handleClose = () => {
  		setShow(false);
  	}
  	const handlePrint = useReactToPrint({
		content:()=> componentRef.current
	})
  	const handleShow = () => setShow(true);

  	const [show1, setShow1] = useState(false);
  	const handleClose1 = () => {
  		setShow1(false);
  	}
  	const [PrintData, setPrintData] = useState([])
  	const handleShow1 = () => setShow1(true);

  	const [show2, setShow2] = useState(false);
  	const handleClose2 = () => {
  		setShow2(false);
  	}
  	
  	const handleShow2 = () => setShow2(true);

  	const handleClear = ()=>{
        setStockId("")
        setOrderedQuantity("")
        setOrderedBy("")
        setPatientPrescriptionId("")
    }
    const accesstoken = cookies.get('token')
    const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
    const authaxios = axios.create({
        baseURL : apiURL,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })

  	const handlesubmit = async (e)=>{
        e.preventDefault()
        setStockId(id)
        setOrderedBy(role)
        await authaxios.post(`${apiURL}/orderpharmacy/`,{
            PatientId:parseInt(PatientId),
            StockId: parseInt(StockId),
            OrderedQuantity: parseInt(OrderedQuantity),
            OrderedBy: parseInt(OrderedBy),
            PatientPrescriptionId: parseInt(PatientPrescriptionId)
        }).then(function (response) {
            console.log(response)
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
    }
   	return (
   		<div className={styles.home}>
            <SideNavbar mrn={mrn}/>
            <div className={styles.homeContainer}>
                <Header />
				<Container>
		        	{prescription.map((data,index)=>(
		        		<div key={index} className="bg-white border my-3 rounded">
		        			<div className="bg-light border m-3 rounded">
					            <Row className="p-3">
									<Col md={4} >
										<h5>Created By</h5>
										<p>{data.CreatedBy}</p>
									</Col>
									<Col md={4}>
										<h5>Created Date</h5>
										<p>{data.CreatedDate}</p>
									</Col>
									<Col md={4}>
										<h5>Clinic</h5>
										<p>{data.Clinic}</p>
									</Col>
								</Row>

								<Row className="p-3">
									<Col md={4}>
										<h5>Medication</h5>
										<p>{data.Medication}</p>
											</Col>

									<Col md={4}>
										<h5>Strength</h5>
										<p>{data.Strength}</p>
									</Col>

									<Col md={4}>
										<h5>AmountToBeTaken</h5>
										<p>{data.AmountToBeTaken}</p>
									</Col>
								</Row>

								<Row className="p-3">
									<Col md={3}>
										<h5>Frequency</h5>
										<p>{data.Frequency}</p>
									</Col>

									<Col md={3}>
										<h5>Route</h5>
										<p>{data.Route}</p>
									</Col>

									<Col md={3}>
										<h5>HowMuch</h5>
										<p>{data.HowMuch}</p>
									</Col>

									<Col md={3}>
										<h5>Refills</h5>
										<p>{data.Refills}</p>
									</Col>
								</Row>

								<Row className="p-3">
									<Col md={12}>
										<h5>Note</h5>
										<p>{data.Note}</p>
									</Col>
								</Row>

							</div>
							<Row className="px-3 py-2">
									<Col md={6}>
										<Button className="m-3"
											variant="primary" 
											onClick={(index)=>{
								        		handleShow()	
								        	}}
						        		>
						        			Update
     						 			</Button>
									</Col>

									<Col md={6}>
										<Button className="m-3"
											variant="primary" 
											onClick={(index)=>{
												handleShow1()
												setPrintData(data)
											}}
										>
							    		Print
	     								</Button>
     								</Col>
								</Row>
						</div>
		          	))}  
        		</Container>

				<Modal size="lg" show={show} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
					<Modal.Header closeButton>
						<Modal.Title>Modal title</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="d-flex flex-column">
							{medication.filter((val)=>{
					        	if(getSearchValue == ""){
					        		return val
					        	}else if(val.Name.toLowerCase().includes(getSearchValue.toLowerCase())){
					        		return val
					        	}
					        }).map((data,index)=>(
						        <button className="my-3 border rounded-pill p-2" 
						        	onClick={()=>{
                            			setid(data.id)
                            			setprice(data.Price)
                            			setPatientPrescriptionId(data.id)
                            			setName(data.Name)
                            			setRemaining(data.Remaining)
                            		}}
                            	>
                            		{data.Name}	
                            	</button>											      	
					        ))}
						</div>		
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handleShow1}>
							Make Prescription
						</Button>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal size="lg" show={show1} onHide={handleClose1} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
					<Modal.Header closeButton>
						<Modal.Title>Modal title</Modal.Title>
					</Modal.Header>
					<Modal.Body>
		                    <Container>
		                        <Row className="my-3">
		                            <Col sm>

		                               <FloatingLabel controlId="floatingInput" label="Ordered Quantity">
		                                   <Form.Control 
		                                     type="text" 
		                                     required
		                                     placeholder="Ordered Quantity" 
		                                     value = {OrderedQuantity}
		                                     onChange={(e) => setOrderedQuantity(e.target.value)}
		                                  />
		                                </FloatingLabel>
		                            </Col>
		                        </Row>
		                    </Container>	
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handlesubmit}>
							Submit
						</Button>
						<Button variant="secondary" onClick={handleClose1}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal size="lg" show={show1} onHide={handleClose1} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<div className={style.Print} ref={componentRef}>
			        				<Container>
							            <h4 className="d-flex justify-content-center">
					            			Ras Hospital Management System
					          			</h4>

					          			<h5 className="d-flex justify-content-center">
					          				Pharmacy Request
					          			</h5>

					          			<div className="d-flex justify-content-between">
						          				<div className="d-flex flex-column">
											      	<h6>Address</h6>
											      	<p>
											      		Addis Ababa, Ethiopia
											      	</p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Phone</h6>
											        <p>
											          	+251-911-123-456
											        </p>
											    </div>

											    <div className="d-flex flex-column">
											        <h6>Email</h6>
											        <p>
														someone@gmail.com
											        </p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Postal</h6>
											        <p>
											          	01234
											        </p>
											    </div>
					      				</div>

					      				
										       

													<div className="d-flex flex-column">
													    <div className="d-flex justify-content-between">
															<div className="d-flex flex-column">
																<h5>Medication</h5>
																<p>{PrintData.Medication}</p>
															</div>

															<div className="d-flex flex-column">
																<h5>Strength</h5>
																<p>{PrintData.Strength}</p>
															</div>

															<div className="d-flex flex-column">
																<h5>AmountToBeTaken</h5>
																<p>{PrintData.AmountToBeTaken}</p>
															</div>
														</div>

														<div className="d-flex justify-content-between">
															<div className="d-flex flex-column">
																<h5>Frequency</h5>
																<p>{PrintData.Frequency}</p>
															</div>
															<div className="d-flex flex-column">
																<h5>Route</h5>
																<p>{PrintData.Route}</p>
															</div>

															<div className="d-flex flex-column">
																<h5>HowMuch</h5>
																<p>{PrintData.HowMuch}</p>
															</div>

															<div className="d-flex flex-column">
																<h5>Refills</h5>
																<p>{PrintData.Refills}</p>
															</div>
														</div>

														<div className="p-3">
															<div className="d-flex flex-column">
																<h5>Note</h5>
																<p>{PrintData.Note}</p>
															</div>
														</div>
													</div>
										        
					      				

					      				<div className="d-flex justify-content-between">
					      					<div className="d-flex flex-column">
										        <h6>Date of Examination</h6>
										        <p>
													{moment(PrintData.Requested_Date).utc().format('YYYY-MM-DD')}
										        </p>
										    </div>

					      					<div className="d-flex flex-column">
										        <h6>Doctor's Name</h6>
										        <p>
													{PrintData.CreatedBy}
										        </p>
										    </div>
										</div>
	      							</Container>
	        					</div>	
							</Modal.Body>
							<Modal.Footer>
								<Button variant="primary" onClick={handlePrint}>
									Print
								</Button>
								<Button variant="secondary" onClick={handleClose1}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>
			</div>
		</div>
  )
}
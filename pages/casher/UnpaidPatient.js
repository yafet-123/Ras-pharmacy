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
import styles from '../../styles/Home.module.css'
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
	const data = await authaxios.get(`${apiURL}/casher/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	patient:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function CasherPayment({patient}){
	const router = useRouter();
	const PatientDataRad = patient['rad']
	const PatientDatalab = patient['lab']
	const ptientMRN = patient['info'].MRN
	const [RequestId, setRequestId] =  useState([])
	const [RequestName, setRequestName] =  useState([])
	const [show1, setShow1] = useState(false);
	const [show2, setShow2] = useState(false);
  	const [PriceRad,setPriceRad] =  useState([])
  	const [PriceLab,setPriceLab] =  useState([])
  	const handleClose = () => {
  		setShow1(false);
  		setShow2(false);
  		setRequestId([])
  		setPriceRad([])
  		setPriceLab([])
  	}
  	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const apiURL = "https://hmsapiserver.herokuapp.com/api/v1"
    const authaxios = axios.create({
        baseURL : apiURL,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
    const IdListLab = []
    const IdListRad = []

    PatientDatalab.map((data)=>(
		IdListLab.push(data.id)
	))

	PatientDataRad.map((data)=>(
		IdListRad.push(data.id)
	))
	const withOutDuplicateIdForLab = [...new Set(IdListLab)];
	const withOutDuplicateIdForRad = [...new Set(IdListRad)];
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});

  	const groupById = groupBy(['id']);
  	const PatientDataRadGroupById = groupById(PatientDataRad)
  	const PatientDatalabGroupById = groupById(PatientDatalab)
  	const handleShow1 = () => setShow1(true);
  	const handleShow2 = () => setShow2(true);
  	const [fullscreen, setFullscreen] = useState(true);
  	const handleAdditionForRad=(number)=>{
  		PatientDataRadGroupById[number].map((data)=>{
  			setPriceRad(PriceRad=>[...PriceRad, data.Price]);
  			setRequestId(RequestId=>[...RequestId,data.Requestid])
  		})	
  	}


  	const initialValue1 = 0;
  	const TotalPriceRad = PriceRad.reduce(
		  (previousValue, currentValue) => previousValue + currentValue,
		  initialValue1
	);
  	console.log(TotalPriceRad)
  	const handleAdditionForLab=(number)=>{
  		PatientDatalabGroupById[number].map((data)=>{
  			setPriceLab(PriceLab=>[...PriceLab, data.Price]);
  			setRequestId(RequestId=>[...RequestId,data.Requestid])
  		})	
  	}

  	
  	const initialValue2 = 0;
	const TotalPriceLab = PriceLab.reduce(
		  (previousValue, currentValue) => previousValue + currentValue,
		  initialValue2
	);

	const onSubmitForRad = async(e)=>{
		e.preventDefault()
        await authaxios.patch(`${apiURL}/casher/`,{
            RequestId:RequestId,
            "type":"Rad"
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
	}

	const onSubmitForLab = async(e)=>{
		e.preventDefault()
        await authaxios.patch(`${apiURL}/casher/`,{
            RequestId:RequestId,
            "type":"Lab"
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
	}
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
						<div className="bg-white p-3 my-3">
							<div>
								<div>
									<h5 className="text-center text-primary fs-4">Radiology</h5>
								</div>
							</div>
							{withOutDuplicateIdForRad.map((number,id)=>(
								<div className="bg-light border my-5 rounded px-3">
									{PatientDataRadGroupById[number].map((data,index)=>(
			                     		<Row className="p-3">
						                    <Col md={6}>
						                        <h5>Request</h5>
						                        <p>{data.Request}</p>
						                    </Col>
						                    <Col md={6}>
						                        <h5>Price</h5>
						                        <p>{data.Price}</p>
						                   	</Col>
			                     		</Row>
									))}

									<button type="btn" className="btn btn-primary mb-3" onClick={()=>{
										handleShow2()
										handleAdditionForRad(number)
									}}
									>
										calculate Total
									</button>
								</div>
							))}
						</div>

						<div className="bg-white p-3 my-3">
							<div>
								<h5 className="text-center text-primary fs-4">Laboratory</h5>
							</div>
							
							{withOutDuplicateIdForLab.map((number,id)=>(
								<div className="bg-light border my-5 rounded px-3">
									{PatientDatalabGroupById[number].map((data,index)=>(
							            <Row className="p-3">
							                <Col md={6} >
							                    <h5>Panel</h5>
							                    <p>{data.Panel}</p>
							                </Col>
							                <Col md={6}>
							            <h5>Price</h5>
							                    <p>{data.Price}</p>
							                </Col>
							            </Row>
									))}
									
									<button type="btn" className="btn btn-primary mb-3" onClick={()=>{
										handleShow1()
										handleAdditionForLab(number)
									}}
									>
										Payment
									</button>
								</div>
							))}
						</div>
						<Modal size="lg" show={show2} onHide={handleClose} dialogClassName="modal-90w">
							<Modal.Header closeButton>
								<Modal.Title>Total Price</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								The Total amount of the Price is {TotalPriceRad}
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={onSubmitForRad}>
									submit
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>

						<Modal size="lg" show={show1} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Total Price</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								The Total amount of the Price is {TotalPriceLab}
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={onSubmitForLab}>
									submit
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>	
				</Container>
			</div>
		</div>
	)	
}






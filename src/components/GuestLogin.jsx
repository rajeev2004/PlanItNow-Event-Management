import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import EventInfo from "./EventInfo";
import axios from "axios";
function GuestLogin(){
    const backend="https://planitnow-backend.onrender.com";
    const navigate=useNavigate();
    const[filterEvents,setFilterEvents]=useState([]);
    const[events,setEvents]=useState([]);
    const[upcomingEvents,setUpcomingEvents]=useState([]);
    const[pastEvents,setPastEvents]=useState([]);
    const[title,setTitle]=useState('');
    const[description,setDescription]=useState('');
    const[location,setLocation]=useState('');
    const [date,setDate]=useState('');
    const[search,setSearch]=useState('');
    useEffect(()=>{
        async function guestLoginEvents(){
            try{
                const result=await axios.get(`${backend}/api/users/events`);
                setEvents(result.data);
                setFilterEvents(result.data);
                const today_date=new Date();
                const upcoming=result.data.filter(event=>new Date(event.date_time)>=today_date);
                const past=result.data.filter(event=>new Date(event.date_time)<today_date);
                setUpcomingEvents(upcoming);
                setPastEvents(past);
            }catch(err){
                console.error(err.message);
            }
        }
        guestLoginEvents();
    },[]);
    async function handleSearch(e){
        try{
            const term=e.target.value.toLowerCase();
            setSearch(term);
            if(term===""){
                setFilterEvents(events);
                const today_date=new Date();
                const upcoming=events.filter(event=>new Date(event.date_time)>=today_date);
                const past=events.filter(event=>new Date(event.date_time)<today_date);
                setUpcomingEvents(upcoming);
                setPastEvents(past);
            }else{
                try{
                    const result=await axios.get(`${backend}/api/users/guestSearchEvent/${term}`);
                    setFilterEvents(result.data);
                    const today_date=new Date();
                    const upcoming=result.data.filter(event=>new Date(event.date_time)>=today_date);
                    const past=result.data.filter(event=>new Date(event.date_time)<today_date);
                    setUpcomingEvents(upcoming);
                    setPastEvents(past);
                }catch(err){
                    console.error(err.message);
                }
            }
        }catch(err){
            console.error(err.message);
        }
    }
    async function Login(id){
        navigate('/login');
    }
    return(
        <div className="guestLoginContainer">
            <div className="name">
                <h2>PlanItNow</h2>
            </div>
            <div className="header">
                <input type="text" placeholder="Search" value={search} onChange={handleSearch} />
                <button onClick={()=>navigate('/login')}>My Events (Hosting)</button>
                <button onClick={()=>navigate('/login')}>Events to Attend</button>
                <button onClick={()=>navigate('/')}>Register</button>
            </div>
            <div className="formContainer">
                <form onSubmit={()=>navigate('/login')} className="eventForm">
                    <input type="text" value={title} placeholder="Title of the event" onChange={(e)=>setTitle(e.target.value)} required />
                    <input type="text" value={location} placeholder="Location of the event" onChange={(e)=>setLocation(e.target.value)} required />
                    <textarea type="text" value={description} placeholder="Description of the event" onChange={(e)=>setDescription(e.target.value)} rows='5' required></textarea>
                    <input type="date" value={date} placeholder="Title of the event" onChange={(e)=>setDate(e.target.value)} required />
                    <button type="submit">Add Event</button>
                </form>
            </div>
            <div className="allEventContainer">
                {upcomingEvents.length>0?(
                    <div>
                        <h2>upcoming Events...</h2>
                        <div className="upcomingEvents">
                            {upcomingEvents.map((currentEvent,index)=>{
                                return(
                                    <div key={index}>
                                        <EventInfo
                                        id={currentEvent.id}
                                        title={currentEvent.title}
                                        location={currentEvent.location}
                                        view={Login}
                                        join={Login}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ):(
                    <p>No Upcoming Events Available...</p> 
                )}
                {pastEvents.length>0?(
                    <div>
                        <h2>past Events...</h2>
                        <div className="pastEvents">
                            {pastEvents.map((currentEvent,index)=>{
                                return(
                                    <div key={index}>
                                        <EventInfo
                                        id={currentEvent.id}
                                        title={currentEvent.title}
                                        location={currentEvent.location}
                                        view={Login}
                                        join={Login}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ):(
                    <p>No Past Events Available...</p> 
                )}
            </div>
        </div>
    )
}
export default GuestLogin;
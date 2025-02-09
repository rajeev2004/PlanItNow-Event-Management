import React,{ useState,useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import EventInfo from "./EventInfo";
import axios from "axios";
function Dashboard(){
    const backend="https://planitnow-backend.onrender.com";
    const navigate=useNavigate();
    const [events,setEvents]=useState([]);
    const [filterEvents,setFilterEvents]=useState([]);
    const [upcomingEvents,setUpcomingEvents]=useState([]);
    const [pastEvents,setPastEvents]=useState([]);
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [date,setDate]=useState('');
    const [location,setLocation]=useState('');
    const [id,setId]=useState();
    const [search,setSearch]=useState('');
    useEffect(()=>{
        const userID=localStorage.getItem('id');
        setId(userID);
        async function getEvents(){
            try{
                const result=await axios.get(`${backend}/api/users/getEveryEvent/${localStorage.getItem('id')}`);
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
        getEvents();
    },[]);
    async function viewEvent(id){
        try{
            const result=await axios.get(`${backend}/api/users/eventDetail/${id}`);
            if(result.data.success){
                navigate('/viewEvent',{
                    state:{
                        EventDetails:result.data.data
                    }
                })
            }else{
                alert('Cannot view the details. Please try again')
            }
        }catch(err){
            console.error(err.message);
        }
    }
    async function joinEvent(event_id){
        try{
            const result=await axios.post(`${backend}/api/users/joinEvent/${event_id}/${id}`);
            if(result.data.success){
                alert("You have successfully joined the event");
            }else if(result.data.message==='already Joined'){
                alert('You have Already Joined this event. Check your attending events.')
            }else{
                alert('Something went wrong or the event has already ended. Please check the date')
            }
        }catch(err){
            console.error(err.message);
        }
    }
    async function EventAdded(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/api/users/addEvent/${id}`,{title,description,location,date});
            if(result.data.success){
                alert('Event added successfully')
                const updatedEvents=await axios.get(`${backend}/api/users/getEveryEvent/${id}`);
                setEvents(updatedEvents.data);
                setFilterEvents(updatedEvents.data);
                setTitle('');
                setDescription('');
                setLocation('');
                setDate('');
            }else if(result.data.message==='cannot create a past event'){
                setTitle('');
                setDescription('');
                setLocation('');
                setDate('');
                alert(`${result.data.message}`)
            }else{
                alert('Event not added! please try again.')
            }
        }catch(err){
            console.error(err.message);
        }
    }
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
                    const result=await axios.get(`${backend}/api/users/searchEvent/${term}/${id}`);
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
    async function myEvents(){
        try{
            const result=await axios.get(`${backend}/api/users/myEvents/${id}`);
            navigate('/myEvents',{
                state:{
                    myEvents:result.data
                }
            })
        }catch(err){
            console.error(err.message);
        }
    }
    async function attendeeEvent(){
        try{
            const result=await axios.get(`${backend}/api/users/attendeeEvent/${id}`);
            navigate('/AttendingEvent',{
                state:{
                    events:result.data
                }
            })
        }catch(err){
            console.error(err.message);
        }
    }
    async function logout(){
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        navigate('/login');
    }
    return(
        <div className="dashboardContainer">
            <div className="name">
                <h2>PlanItNow</h2>
            </div>
            <div className="header">
                <input type="text" placeholder="Search" value={search} onChange={handleSearch} />
                <button onClick={()=>myEvents()}>My Events (Hosting)</button>
                <button onClick={()=>attendeeEvent()}>Events to Attend</button>
                <button onClick={()=>logout()}>Logout</button>
            </div>
            <div className="formContainer">
                <form onSubmit={EventAdded} className="eventForm">
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
                                        view={viewEvent}
                                        join={joinEvent}
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
                                        view={viewEvent}
                                        join={joinEvent}
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
export default Dashboard;
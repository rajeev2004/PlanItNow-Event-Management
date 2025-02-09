import React,{useState,useEffect} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import HostingEvent from "./HostingEvent";
import axios from "axios";
function MyEvent(){
    const backend="https://planitnow-backend.onrender.com";
    const location=useLocation();
    const navigate=useNavigate();
    const [hostingEvents,setHostingEvents]=useState([]);
    useEffect(()=>{
        if(location.state?.myEvents){
            setHostingEvents(location.state.myEvents);
        }
    },[location.state]);
    async function deleteEvent(id){
        try{
            const result=await axios.delete(`${backend}/api/users/deleteEvent/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(result.data.success){
                const updatedEvents=hostingEvents.filter(events=>events.id!==id);
                setHostingEvents(updatedEvents);
                alert('event deleted successfully');
            }else{
                alert('please try again');
            }
        }catch(err){
            console.error(err.message);
        }
    }
    async function editEvent(id){
        try{
            navigate('/editEvent',{
                state:{
                    id
                }
            })
        }catch(err){
            console.error(err.message);
        }
    }
    const today=new Date().toISOString().split("T")[0];
    const upcomingEvents=hostingEvents.filter(event=>event.date_time>=today);
    const pastEvents=hostingEvents.filter(event=>event.date_time<today);
    return(
        <div className="hostingEventContainer">
            {upcomingEvents.length>0 && (
                <>
                    <h2>Upcoming Events...</h2>
                    <div className="upcomingEvents">
                        {upcomingEvents.map((current_event,index)=>(
                            <HostingEvent
                                key={current_event.id}
                                id={current_event.id}
                                title={current_event.title}
                                description={current_event.description}
                                location={current_event.location}
                                date={current_event.date_time}
                                attendee={current_event.attendee_count}
                                edit={editEvent}
                                delete={deleteEvent} />
                        ))}
                    </div>
                </>
            )}
            {pastEvents.length>0 && (
                <>
                    <h2>Past Events...</h2>
                    <div className="pastEvents">
                        {pastEvents.map((current_event,index)=>(
                            <HostingEvent
                                key={current_event.id}
                                id={current_event.id}
                                title={current_event.title}
                                description={current_event.description}
                                location={current_event.location}
                                date={current_event.date_time}
                                attendee={current_event.attendee_count}
                                edit={editEvent}
                                delete={deleteEvent} />
                        ))}
                    </div>
                </>
            )}
            <div>
                <button onClick={()=>navigate('/homepage')}>Go To Homepage</button>
            </div>
        </div>
    )
}
export default MyEvent;
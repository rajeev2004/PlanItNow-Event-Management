import React, { useEffect,useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import EventToAttend from "./EventToAttend";
import axios from "axios";
function AttendingEvent(){
    const backend="https://planitnow-backend.onrender.com";
    const location=useLocation();
    const navigate=useNavigate();
    const [events,setEvents]=useState([]);
    useEffect(()=>{
        setEvents(location.state.events);
    },[location.state]);
    const today=new Date().toISOString().split("T")[0];
    const upcomingEvents=events.filter(event=>event.date_time>=today);
    const pastEvents=events.filter(event=>event.date_time<today);
    async function cancelEvent(id){
        try{
            const result=await axios.delete(`${backend}/api/users/deleteAttendingEvent/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(result.data.success){
                alert('booking cancelled');
                const updatedEvents=events.filter(EVENT=>EVENT.id!==id);
                setEvents(updatedEvents);
            }else{
                alert('You do not access to cancel this event booking');
            }
        }catch(err){
            console.error(err.message);
        }
    }
    return(
        <div className="attendingEventsContainer">
            <div className="upcomingAttending">
                {upcomingEvents.length>0 && (
                    <>
                        <h2>Upcoming Events...</h2>
                        <div className="upcomingEvents">
                            {upcomingEvents.map((current_event,index)=>(
                                <EventToAttend
                                key={current_event.id}
                                id={current_event.id}
                                title={current_event.title}
                                description={current_event.description}
                                location={current_event.location}
                                date={current_event.date_time}
                                attendee={current_event.attendee_count}
                                unroll={cancelEvent} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="PastAttending">
                {pastEvents.length>0 && (
                    <>
                        <h2>Past Events...</h2>
                        <div className="pastEvents">
                            {pastEvents.map((current_event,index)=>(
                                <EventToAttend
                                key={current_event.id}
                                id={current_event.id}
                                title={current_event.title}
                                description={current_event.description}
                                location={current_event.location}
                                date={current_event.date_time}
                                attendee={current_event.attendee_count} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="AttendingEventButton">
                <button onClick={()=>navigate('/homepage')}>Go To Homepage</button>
            </div>
        </div>
    )
}
export default AttendingEvent;
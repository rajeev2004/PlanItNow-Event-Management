import React,{useRef} from "react";
import {motion,useInView} from "framer-motion"
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
function ViewEvent(){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const backend="https://planitnow-backend.onrender.com";
    const location=useLocation();
    const navigate=useNavigate();
    const formattedDate=new Date(location.state.EventDetails[0].date_time).toISOString().split('T')[0];
    async function joinEvent(event_id,id){
        try{
            const result=await axios.post(`${backend}/api/users/joinEvent/${event_id}/${id}`);
            if(result.data.success){
                alert("You have successfully joined the event");
            }else{
                alert('Something went wrong or the event has already ended. Please check the date')
            }
        }catch(err){
            console.error(err.message);
        }
    }
    return(
        <motion.div
        ref={ref} 
        className="viewEventContainer"
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="EventContent">
                <p>Title: {location.state.EventDetails[0].title}</p>
                <p>Description: {location.state.EventDetails[0].description}</p>
                <p>Location: {location.state.EventDetails[0].location}</p>
                <p>Date: {formattedDate}</p>
                <p>Attendee_count: {location.state.EventDetails[0].attendee_count}</p>
            </div>
            <div className="goToButton">
                <button onClick={()=>navigate('/homepage')}>Go To Homepage</button>
                <button onClick={()=>joinEvent(location.state.EventDetails[0].id,localStorage.getItem('id'))}>Join Event</button>
            </div>
        </motion.div>
    )
}
export default ViewEvent;
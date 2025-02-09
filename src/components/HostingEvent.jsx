import React,{useRef} from "react";
import {motion,useInView} from "framer-motion"
function HostingEvent(props){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const formattedDate=new Date(props.date).toISOString().split('T')[0];
    return(
        <motion.div
        ref={ref} 
        className="hostingEvent"
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="hostingEventDetails">
                <p>Title: {props.title}</p>
                <p>Description: {props.description}</p>
                <p>Location: {props.location}</p>
                <p>No. of current Attendees: {props.attendee}</p>
                <p>Date: {formattedDate}</p>
            </div>
            <div className="hostingEventButtons">
                <button onClick={()=>props.edit(props.id)}>Edit</button>
                <button onClick={()=>props.delete(props.id)}>Delete</button>
            </div>
        </motion.div>
    )
}
export default HostingEvent;
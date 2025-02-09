import React,{useRef} from "react";
import {motion,useInView} from "framer-motion"
function EventToAttend(props){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const formattedDate=new Date(props.date).toISOString().split('T')[0];
    return(
        <motion.div
        ref={ref} 
        className="EventToAttendContainer"
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="attendingEventDetails">
                <p>Title: {props.title}</p>
                <p>Description: {props.description}</p>
                <p>Location: {props.location}</p>
                <p>No. of current Attendees: {props.attendee}</p>
                <p>Date: {formattedDate}</p>
            </div>
            {props.unroll && (
                <div className="attendingEventButtons">
                    <button onClick={()=>props.unroll(props.id)}>Leave</button>
                </div>
            )}
        </motion.div>
    )
}
export default EventToAttend;
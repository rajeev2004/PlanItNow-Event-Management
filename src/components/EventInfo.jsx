import React,{useRef} from "react";
import {motion,useInView} from "framer-motion";
function EventInfo(props){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    return(
        <motion.div 
        ref={ref}
        className="EventContainer"
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="EventContainerValues">
                <p>Title: {props.title}</p>
                <p>location: {props.location}</p>
            </div>
            <div className="EventContainerButton">
                <button onClick={()=>props.view(props.id)}>View Event</button>
                <button onClick={()=>props.join(props.id)}>Join Event</button>
            </div>
        </motion.div>
    )
}
export default EventInfo;
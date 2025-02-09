import React,{useState,useEffect,useRef} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import {motion,useInView} from "framer-motion";
import axios from "axios";
function EditEvent(){
    const ref=useRef();
    const isInView=useInView(ref,{threshold:0.2});
    const backend="https://planitnow-backend.onrender.com";
    const location=useLocation();
    const navigate=useNavigate();
    const id=location.state.id;
    const [eventDetail,setEventDetail]=useState({
        id:'',
        title:'',
        description:'',
        location:'',
        date_time:'',
        attendee:''
    });
    useEffect(()=>{
        async function getDetails(){
            const result=await axios.get(`${backend}/api/users/eventDetail/${id}`);
            setEventDetail(result.data.data[0]);
        }
        getDetails();
    },[id]);
    async function handleChange(e){
        const {name,value}=e.target;
        let updatedValue=value;
        if (name==="date_time") {
            updatedValue=new Date(value).toISOString().split("T")[0];
        }
        setEventDetail(prev=>({
            ...prev,
            [name]:updatedValue
        }))
    }
    async function saveChanges(){
        try{
            const result=await axios.put(`${backend}/api/users/updateEvent/${id}`,eventDetail,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(result.data.success){
                alert('update successful. Navigating to events tab');
                setTimeout(async ()=>{
                    try{
                        const result=await axios.get(`${backend}/api/users/myEvents/${localStorage.getItem('id')}`);
                        navigate('/myEvents',{
                            state:{
                                myEvents:result.data
                            }
                        })
                    }catch(err){
                        console.error(err.message);
                    }
                },2000);
            }else{
                alert('something went wrong please try again');
            }
        }catch(err){
            console.error(err.message);
        }
    }
    return(
        <motion.div
        ref={ref} 
        className="editEventContainer"
        initial={{opacity:0,y:20}}
        animate={isInView?{opacity:1,y:0}:{opacity:0,y:20}}
        transition={{duration:0.5}}>
            <div className="editEventContainerComponents">
                <label>
                    Title:
                </label>
                <input type="text"
                name="title"
                value={eventDetail.title||''}
                onChange={handleChange}/>
            </div>
            <div className="editEventContainerComponents">
                <label>
                    Description:
                </label>
                <input type="text"
                name="description"
                value={eventDetail.description||''}
                onChange={handleChange}/>
            </div>
            <div className="editEventContainerComponents">
                <label>
                    Location:
                </label>
                <input type="text"
                name="location"
                value={eventDetail.location||''}
                onChange={handleChange}/>
            </div>
            <div className="editEventContainerComponents">
                <label>
                    Date:
                </label>
                <input type="date"
                name="date_time"
                value={eventDetail.date_time?new Date(eventDetail.date_time).toISOString().split("T")[0]:''}
                onChange={handleChange}/>
            </div>
            <div className="editEventContainerButtons">
                <button onClick={()=>saveChanges()}>Save Changes</button>
                <button onClick={async ()=>{
                    try{
                        const result=await axios.get(`${backend}/api/users/myEvents/${localStorage.getItem('id')}`);
                        navigate('/myEvents',{
                            state:{
                                myEvents:result.data
                            }
                        })
                    }catch(err){
                        console.error(err.message);
                    }
                }}>Cancel</button>
            </div>
        </motion.div>
    )
}
export default EditEvent;
import axios from "axios";
import config from "./config";

export const request = (url="", method = "", data = {}) => {
    //url = "customers search"
    return axios({
        url:config.base_url + url,
        method:method, //"get","post" ,"put","delete"
        data:data,
        headers:{
            Accept:"application/json",
            "Content-Type": "application/json",
        }
    }).then((res)=>{
        return res.data;
    }).catch((err)=>{
        console.log(err);
    });
}
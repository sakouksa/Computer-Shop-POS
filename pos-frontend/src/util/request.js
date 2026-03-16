import axios from "axios";
import config from "./config";
import { profileStore } from "../store/profileStore";

export const request = (url = "", method = "", data = {}) => {

  let access_token = profileStore.getState().access_token;
  return axios({
    url: config.base_url + url,
    method: method, //"get","post" ,"put","delete"
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization : "Bearer" + access_token,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      const response = error.response;
      if (response) {
        const status = response.status;
        const data = response.data;
        let errors = {
          message:data?.message,
        };
        if (status == 500) {
          errors.message = "មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀត!";
        }

        if (data.errors) {
           Object.keys(data.errors).map((key) => {
             errors[key] = {
               validateStatus: "error",
               help: data.errors[key][0], //get error message
               hasFeedback: true,
             };
           });
        }
        return {
          error :true,
          status:status,
          errors: errors,
        };
      }
      // ករណីគ្មាន Internet ឬ Server បិទ
      return { 
        error: true,
        errors: { message: "501 : មិនអាចតភ្ជាប់ទៅកាន់ Server បានទេ!" }
      };
    });
};

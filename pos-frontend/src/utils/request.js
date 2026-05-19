import axios from "axios";
import config from "./config";
import {
  profileStore
} from "../store/profileStore";

export const request = (url = "", method = "", data = {}, option = {}) => {
  let access_token = profileStore.getState().access_token;
  let headers = {
    "Content-Type": "application/json", //json data
  };
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data", // form data
    };
  }

  return axios({
      url: config.base_url + url,
      method: method, //"get","post" ,"put","delete"
      data: data,
      //So that axios knows what type of data to accept (json or blob)
      responseType: option.responseType || "json",
      headers: {
        ...headers,
        Accept: "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch(async (error) => {
      console.log(error);
      const response = error.response;
      if (response) {

        let data = response.data;

        if (data instanceof Blob) {
          const text = await data.text();
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = {
              message: text || "Unknown Error"
            };
          }
        }

        const status = response.status;
        let errors = {
          message: data?.message,
        };
        if (status == 500) {
          const errMsg = "500 : មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀត!";
          throw new Error(errMsg);
        }

        // if (status == 500) {
        //   errors.message =
        //     "500 : មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ សូមព្យាយាមម្តងទៀត!";
        //   return {
        //     error: true,
        //     status: status,
        //     errors: errors,
        //   };
        // }

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
          error: true,
          status: status,
          errors: errors,
        };
      }

      return {
        error: true,
        errors: {
          message: "501 : មិនអាចតភ្ជាប់ទៅកាន់ Server បានទេ!"
        },
      };
    });
};
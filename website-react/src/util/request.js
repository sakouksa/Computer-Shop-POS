import axios from "axios";
import config from "./config";
// បង្កើត Object សម្រាប់បកប្រែឈ្មោះ field ទៅជាភាសាខ្មែរ
const khmerErrorMessages = {
  name: "សូមបញ្ចូលឈ្មោះតួនាទី!",
  code: "សូមបញ្ចូលកូដតួនាទី!",
  description: "សូមបញ្ចូលការពិពណ៌នា!",
  status: "សូមជ្រើសរើសស្ថានភាព!",
};

export const request = (url = "", method = "", data = {}) => {
  //url = "customers search"
  return axios({
    url: config.base_url + url,
    method: method, //"get","post" ,"put","delete"
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
               help: khmerErrorMessages[key] || data.errors[key][0], //get error message
               hasFeedback: true,
             };
           });
        }
        return {
          status:status,
          errors: errors,
        };
      }
    });
};

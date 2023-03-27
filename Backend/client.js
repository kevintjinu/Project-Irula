const fs = require("fs");
const axios = require("axios");

const data = JSON.parse(fs.readFileSync("dict/dict.json", "utf-8"));


data.forEach((obj) => {
    let config = {
      method: "post",
      url: "https://project-irula.azurewebsites.net/api/newWord",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(obj),
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

});

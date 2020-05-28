require("dotenv").config();
const axios = require("fetch");

const API = (stage = "master") =>
  `https://api-euwest.graphcms.com/v1/${process.env.API_ID}/${stage}`;
const PROJECT_API = API("master");

// Builds generic AXIOS utils.
const axiosCreate = (url, key) =>
  axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${process.env[key]}`,
      "Content-Type": "application/json",
    },
  });

const importAxios = axiosCreate(PROJECT_API, "GRAPHCMS_PAT");

const uploadMutation = (query, variables, diagnosticKey) => async (data) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  const response = await importAxios({
    method: "POST",
    url: "",
    data: {
      query: query,
      variables: { ...variables, ...{ data: data } },
    },
  });

  if (response.data.errors) {
    console.log("Error with ", response.data.errors);
    if (diagnosticKey)
      console.log(
        "Error Entries ",
        data.map((obj) => obj[diagnosticKey])
      );
  } else {
    console.log("Upserted ", response.data);
  }
};

export default uploadMutation;

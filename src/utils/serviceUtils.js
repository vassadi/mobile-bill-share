import axios from 'axios';

export const getData = async (url, requestObj) => {
  console.log('Triggered', url.substring(url.lastIndexOf('/')));
  const response = await axios
    .post(url, { ...requestObj })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(response);
};

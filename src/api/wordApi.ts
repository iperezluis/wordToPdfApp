import axios from "axios";

const wordApi = axios.create({
  baseURL:
    "https://627qydwj5l4uefidfboo2xiqnu0dwzro.lambda-url.us-east-1.on.aws",
});

export default wordApi;

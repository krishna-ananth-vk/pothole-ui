import { APIs } from "../apis";
import axios from "axios";
import type { LoginResponseData } from "../types";

const fetchLoggedInUserData = async (idToken: string) => {
  try {
    const resp = await axios.post<LoginResponseData>(APIs.USER.GET_USER_INFO, {
      idToken,
    });
    console.log("auth_service_userInfo", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export { fetchLoggedInUserData };

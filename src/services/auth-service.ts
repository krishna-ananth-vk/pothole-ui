import { APIs } from "../apis";

const fetchLoggedInUserData = async (idToken: string) => {
  const resp = await fetch(APIs.USER.GET_USER_INFO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  console.log("auth_service_userInfo", resp);
};

export { fetchLoggedInUserData };

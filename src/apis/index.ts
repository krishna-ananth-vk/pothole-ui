const server_context = "/pothole-core/v1/api";
const APIs = {
  USER: {
    CREATE: "/api/users",
    GET_USER_INFO: `${server_context}/login`,
    UPDATE: "/api/users",
  },
  AUTH: {
    VERIFY_TOKEN: "/api/auth",
  },
  POTHOLE: {
    CREATE: "/api/potholes",
    GET_ALL: "/api/potholes/list",
    GET: "/api/potholes",
    DELETE: "/api/potholes/delete",
  },
  LEADERBOARD: {
    GET: "/api/leaderboard",
  },
  CONSTITUENCY: {
    GET_BY_LOCATION: "/api/constituency",
  },
};

export { APIs };

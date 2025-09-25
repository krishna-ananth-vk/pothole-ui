const APIs = {
  USER: {
    CREATE: "/api/users",
    GET: "/api/users",
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

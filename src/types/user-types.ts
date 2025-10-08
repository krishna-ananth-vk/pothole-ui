interface UserData {
  uid: string;
  display_name: string;
  email: string;
  created_at: string;
  show_anonymous: boolean;
  is_active: boolean;
  is_banned: boolean;
  exp_points: number;
  level: number;
  reports_count: number;
}

interface LoginResponseData {
  uid: string;
  display_name: string;
  email: string;
  created_at: string;
  timestamp: string;
  message: string;
  user_exist: boolean;
  user: UserData;
}

export type { LoginResponseData, UserData };

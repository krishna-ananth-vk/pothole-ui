import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { fetchLoggedInUserData } from "../services/auth-service";
import type { LoginResponseData, ProfileData } from "../types";

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resentVerification: () => Promise<boolean>;
  updateUserProfile: (profileData: ProfileData) => void;
  userProfile: LoginResponseData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<LoginResponseData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  console.log(children, loading);
  const signup = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
  };

  const getLoggedInUser = async (loggedInUser: User) => {
    const idTokeen = await loggedInUser.getIdToken();
    const userInfo = await fetchLoggedInUserData(idTokeen);
    return userInfo;
  };
  const logout = () => {
    return signOut(auth);
  };
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const loggedInUserData = await getLoggedInUser(userCredential.user);
    if (loggedInUserData) {
      setUserProfile(loggedInUserData);
    } else {
      logout();
    }
    console.log("auth_context_userCredential", { userCredential });

    return userCredential;
  };

  const resentVerification = async () => {
    if (auth && auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return true;
    }
    return false;
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = (profileData: ProfileData) => {
    console.log("updating_profile", { profileData });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        getLoggedInUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        signInWithGoogle,
        logout,
        resetPassword,
        resentVerification,
        updateUserProfile,
        userProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

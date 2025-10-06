import React, { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Calendar, MapPin, LogOut, Edit3 } from "lucide-react";
import ProfileEditForm from "../components/profile_edit";

interface UserStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  joinedDate: string;
}

const mockUserStats: UserStats = {
  totalReports: 12,
  pendingReports: 3,
  resolvedReports: 9,
  joinedDate: "2024-01-01",
};

interface ProfileData {
  displayName: string;
  bio: string;
  isAnonymous: boolean;
  isActive: boolean;
  photoURL: string | null;
}

const fetchUserStats = async (): Promise<UserStats> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUserStats), 500);
  });
};

const Profile: React.FC = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: currentUser?.displayName || "Anonymous User",
    bio: "",
    isAnonymous: false,
    isActive: true,
    photoURL: currentUser?.photoURL || null,
  });

  const { data: userStats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!currentUser) {
    return null;
  }

  const handleSaveProfile = (data: ProfileData) => {
    setProfileData(data);
    if (updateUserProfile) {
      updateUserProfile();
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <ProfileEditForm
          initialData={profileData}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center relative">
                {profileData.photoURL ? (
                  <img
                    src={profileData.photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-600" />
                )}
                {profileData.isActive && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileData.isAnonymous
                      ? "Anonymous User"
                      : profileData.displayName}
                  </h2>
                  {profileData.isAnonymous && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      Anonymous
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
              </div>
            </div>

            {profileData.bio && (
              <p className="text-gray-600 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                {profileData.bio}
              </p>
            )}

            {currentUser.metadata.creationTime && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Member since{" "}
                  {new Date(
                    currentUser.metadata.creationTime,
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.totalReports}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userStats?.pendingReports}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {userStats?.resolvedReports}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userStats
                    ? Math.round(
                        (userStats.resolvedReports / userStats.totalReports) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                <span className="text-gray-900 font-medium">
                  Location Preferences
                </span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">About NammaBLR</h3>
            <p className="text-sm text-gray-600">
              Help improve Bangalore's roads by reporting potholes. Your
              contributions help local authorities prioritize infrastructure
              improvements and make our city safer for everyone.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, MapPin, Calendar, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Pothole {
  id: string;
  location: string;
  date: string;
  status: "pending" | "reviewed" | "fixed";
  imageUrl: string;
}

const mockPotholes: Pothole[] = [
  {
    id: "1",
    location: "MG Road, Bangalore",
    date: "2024-01-15",
    status: "pending",
    imageUrl:
      "https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    id: "2",
    location: "Brigade Road, Bangalore",
    date: "2024-01-10",
    status: "reviewed",
    imageUrl:
      "https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
];

const fetchUserPotholes = async (): Promise<Pothole[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPotholes), 500);
  });
};

const Dashboard: React.FC = () => {
  const {
    data: potholes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPotholes"],
    queryFn: fetchUserPotholes,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "fixed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "reviewed":
        return <Calendar className="w-4 h-4" />;
      case "fixed":
        return <MapPin className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 mb-4">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          Error loading potholes. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <Link
          to="/capture"
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      {potholes && potholes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start reporting potholes to make Bangalore better!
          </p>
          <Link
            to="/capture"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Report a Pothole
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {potholes?.map((pothole) => (
            <div key={pothole.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={pothole.imageUrl}
                  alt="Pothole"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {pothole.location}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pothole.status)}`}
                    >
                      {getStatusIcon(pothole.status)}
                      <span className="ml-1 capitalize">{pothole.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Reported on {new Date(pothole.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

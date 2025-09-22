import React, { useState, useRef } from "react";
import { Camera, MapPin, Send, RotateCcw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PotholeReport {
  image: string;
  location: string;
  description: string;
}

const submitPotholeReport = async (report: PotholeReport): Promise<void> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Pothole report submitted:", report);
      resolve();
    }, 1000);
  });
};

const Capture: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: submitPotholeReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPotholes"] });
      // Reset form
      setCapturedImage(null);
      setLocation("");
      setDescription("");
      alert("Pothole reported successfully!");
    },
    onError: () => {
      alert("Failed to submit report. Please try again.");
    },
  });

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera on mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get current location. Please enter manually.");
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (capturedImage && location && description) {
      submitMutation.mutate({
        image: capturedImage,
        location,
        description,
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Report a Pothole
      </h1>

      <div className="space-y-6">
        {/* Camera Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Take a Photo
          </h2>

          {!capturedImage && !isCapturing && (
            <button
              onClick={startCamera}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Camera className="w-6 h-6 mr-2" />
              Start Camera
            </button>
          )}

          {isCapturing && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg bg-gray-900"
              />
              <button
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-6 h-6" />
              </button>
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured pothole"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={retakePhoto}
                className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <div className="flex space-x-2">
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location or coordinates"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the pothole size, traffic impact, etc."
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              !capturedImage ||
              !location ||
              !description ||
              submitMutation.isPending
            }
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {submitMutation.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            {submitMutation.isPending ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Capture;

import { X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../utils/constants";

const IncopmpleteProfileAlert = () => {
  const [showBanner, setShowbanner] = useState(true);
  const { pathname } = useLocation();
  console.log("user_location", { pathname, p: APP_ROUTES.PROFILE });
  if (!showBanner) {
    return;
  }
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-800/50 px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-gray-100">
          <strong className="font-semibold">Incomplete Profile</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          Update to report potholes
        </p>
        {!pathname.includes(APP_ROUTES.PROFILE) && (
          <Link
            to="profile"
            className="flex-none rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-xs inset-ring-white/20 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Update <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:-outline-offset-4"
          onClick={() => setShowbanner(false)}
        >
          <span className="sr-only">Dismiss</span>
          <X aria-hidden="true" className="size-5 text-gray-100" />
        </button>
      </div>
    </div>
  );
};

export default IncopmpleteProfileAlert;

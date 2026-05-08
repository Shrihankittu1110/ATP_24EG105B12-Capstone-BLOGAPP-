import { useAuth } from "../Store/authStore";
import { Navigate } from "react-router";
import {toast} from "react-hot-toast";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowedRoles }) {
  //get user login status from store
  const { loading, currentUser, isAuthenticated, checkAuth } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      // If already authenticated in store, no need to re-check.
      if (isAuthenticated) {
        if (isMounted) setIsReady(true);
        return;
      }

      await checkAuth();
      if (isMounted) setIsReady(true);
    };

    restoreAuth();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, checkAuth]);

  //loading state
  if (loading || !isReady) {
    return <p>Loading...</p>;
  }
  //if user not loggedin
  if (!isAuthenticated) {
    toast.error("Redirecting to Login", { id: "redirect-login" })
    //redirect to Login
    return <Navigate to="/login" replace />;
  }

  //check roles
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
   
    //redirect to Login
    return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;
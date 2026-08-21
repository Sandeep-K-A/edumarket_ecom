import { useEffect } from "react";
import { getCurrentUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";

const useAuthInit = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      try {
        const { user } = await getCurrentUser();

        setUser(user);
      } catch (error) {
        // 401 simply means the visitor isn't logged in.
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, clearAuth, setLoading]);
};

export default useAuthInit;

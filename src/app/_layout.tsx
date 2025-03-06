import { Stack, useRouter, useSegments } from "expo-router";
import Toast from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';

import { useEffect, useState } from "react";
import { isTokenValid } from "../api/auth";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments() as string[];
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid: boolean = await isTokenValid() || false;
      setIsAuthenticated(isValid);

      // if the user is not authenticated and not on the login page (index.tsx)
      if (!isValid && segments.length > 0) {
        router.replace("/");
      }

      //if authenticated user is on login page
      if (isValid && segments.length === 0) {
        router.replace("/home");
      }
    }

    checkAuth();
  }, [segments])



  if (isAuthenticated === null) {
    return null; // Prevent flickering while checking auth
  }



  return (
    <>
      <RecoilRoot>
        <Stack screenOptions={{ statusBarHidden: true ,gestureEnabled:false}}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </RecoilRoot>
    </>
  );
}


import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  });
  return fontsLoaded;
}
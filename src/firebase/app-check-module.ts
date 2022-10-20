import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseApp } from "./index";

const reCAPTCHA_PUBLIC_KEY = "6LfZi5UiAAAAAA9IqaPiw_C-wn17mziJTJWduHZX";

export const startAppCheck = () => initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(reCAPTCHA_PUBLIC_KEY),
  isTokenAutoRefreshEnabled: true,
});

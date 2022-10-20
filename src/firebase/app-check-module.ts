import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseApp } from "./index";
import { environment } from "../environments/environment";

const reCAPTCHA_PUBLIC_KEY = "6LfZi5UiAAAAAA9IqaPiw_C-wn17mziJTJWduHZX";

if (!environment.production) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const startAppCheck = () =>
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(reCAPTCHA_PUBLIC_KEY),
    isTokenAutoRefreshEnabled: true,
  });

declare var self: {
  FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | undefined;
};

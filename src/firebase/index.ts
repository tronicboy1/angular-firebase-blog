import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfHOnbpqeOBdL3ZY0CohUj2qCbnf2IEQc",
  authDomain: "austin-mayer-blog.firebaseapp.com",
  projectId: "austin-mayer-blog",
  storageBucket: "austin-mayer-blog.appspot.com",
  messagingSenderId: "353824563902",
  appId: "1:353824563902:web:969ffaf048dd3a15b1b4ef",
  measurementId: "G-3PZH7TSRYN",
};

export const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

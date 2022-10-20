import { initializeApp } from "firebase/app";

const config = {
  projectId: "austin-blog-965da",
  appId: "1:262418756090:web:ff1629670efe372c017443",
  storageBucket: "austin-blog-965da.appspot.com",
  locationId: "asia-east2",
  apiKey: "AIzaSyBEMXKxQ-R7FnO3KVbnMZpSdluPFcp-lyY",
  authDomain: "austin-blog-965da.firebaseapp.com",
  messagingSenderId: "262418756090",
};

export const firebaseApp = initializeApp(config);

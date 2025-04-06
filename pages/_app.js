import "../styles/globals.css";
import fs from "fs";
//INTERNAL IMPORT
import {PROVIDER} from "../context/context";
import toast,{Toaster} from "react-hot-toast";
if (typeof window === 'undefined') {
  // This code will run only on the server-side
  const fs = require('fs');
  console.log("fs:",fs)
};


export default function App({ Component, pageProps }) {
  return (
    <>

      <PROVIDER>
         <Component {...pageProps} />

      </PROVIDER>
      <Toaster />
      

      <script src="assets/js/jquery.min.js"></script>
      <script src="assets/js/proper-min.js"></script>
      <script src="assets/js/bootstrap.min.js"></script>
      <script src="assets/js/plugin/waypoint.min.js"></script>
      <script src="assets/js/plugin/owl.carousel.min.js"></script>
      <script src="assets/js/plugin/jquery.nice-select.min.js"></script>
      <script src="assets/js/plugin/wow.min.js"></script>
      <script src="assets/js/main.js"></script>
    </>
  );
}

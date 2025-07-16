
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider ,getAuth, signInWithPopup} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDWmwwKzi8IZdfZ4Wy7JHRMOLcnHcZZ9CU",
  authDomain: "mern-blog-website-35de2.firebaseapp.com",
  projectId: "mern-blog-website-35de2",
  storageBucket: "mern-blog-website-35de2.firebasestorage.app",
  messagingSenderId: "117248811805",
  appId: "1:117248811805:web:4a830384237da8c93537f4"
};


const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth=getAuth();

export const authWithGoogle = async()=>
{
    let user=null;

    await signInWithPopup(auth,provider).then((result)=>{
        user=result.user
    })
    .catch((err)=>
    {
        console.log("error");
    })

    return user;

}
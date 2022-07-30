import type {AppProps} from 'next/app'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../config/firebase";
import Login from "./login";
import {CircularProgress, Box} from "@mui/material";
import {useEffect} from "react";
import {doc, setDoc, serverTimestamp} from "@firebase/firestore";

function MyApp({Component, pageProps}: AppProps) {
  const [loggedInUser, loading] = useAuthState(auth);

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL
          },
          { merge: true }
        )
      } catch (error) {
        console.log('ERROR SETTING USER INFO IN DB', error)
      }
    }

    if (loggedInUser) {
      setUserInDb()
    }
  }, [loggedInUser])

  if (loading) return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 'auto'
    }}>
      <CircularProgress/>
    </Box>
  )
  if (!loggedInUser) return <Login/>
  return <Component {...pageProps} />
}

export default MyApp

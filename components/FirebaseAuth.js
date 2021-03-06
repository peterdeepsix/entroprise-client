/* globals window */
import { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import cookie from "js-cookie";
import initFirebase from "../utils/auth/initFirebase";
import { auth as firebaseuiAuth } from "firebaseui";

import Link from "../components/Link";

import {
  Card,
  CardContent,
  Container,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListSubheader,
} from "@material-ui/core";

// Init the Firebase app.
initFirebase();

const firebaseAuthConfig = {
  autoUpgradeAnonymousUsers: true,
  signInFlow: "popup",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    firebaseuiAuth.AnonymousAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      // xa is the access token, which can be retrieved through
      // firebase.auth().currentUser.getIdToken()
      const { uid, email, xa } = user;
      const userData = {
        id: uid,
        email,
        token: xa,
      };
      cookie.set("auth", userData, {
        expires: 1,
      });
    },
  },
};

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRenderAuth(true);
    }
  }, []);
  return (
    <Container maxWidth="sm">
      {renderAuth ? (
        <Box mt={3} mb={1}>
          <Card variant="outlined">
            <CardContent>
              <Box mt={2} mb={1}>
                <StyledFirebaseAuth
                  uiConfig={firebaseAuthConfig}
                  firebaseAuth={firebase.auth()}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : null}
    </Container>
  );
};

export default FirebaseAuth;

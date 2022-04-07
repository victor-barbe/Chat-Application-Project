/** @jsxImportSource @emotion/react */
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";
import qs from "qs";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Button, Link } from "@mui/material";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import logo from "./images/ECE_Chat.jpg";
import { Grid } from "@mui/material";

import easyToUse from "./images/Easy_to_use.png";
import free from "./images/Free.png";
import secure from "./images/Secure.png";

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const useStyles = (theme) => ({
  root: {
    flex: "1 1 auto",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    "& > div": {
      // margin: `${theme.spacing(0.5)}`,
      marginLeft: "auto",
      marginRight: "auto",
    },
    "& fieldset": {
      border: "none",
      "& label": {
        //marginBottom: theme.spacing(),
        display: "block",
      },
    },
  },
  grid: {
    paddingLeft: "12%",
    flex: "1 1 auto",
    textAlign: "center",
  },
  logo: {
    textAlign: "center",
  },
  connect: {
    textAlign: "center",
  },
  card: {
    textAlign: "center",
  },
});

const Redirect = ({ config, codeVerifier }) => {
  const styles = useStyles(useTheme());
  const redirect = (e) => {
    e.stopPropagation();
    const code_challenge = base64URLEncode(sha256(codeVerifier));
    const url = [
      `${config.authorization_endpoint}?`,
      `client_id=${config.client_id}&`,
      `scope=${config.scope}&`,
      `response_type=code&`,
      `redirect_uri=${config.redirect_uri}&`,
      `code_challenge=${code_challenge}&`,
      `code_challenge_method=S256`,
    ].join("");
    window.location = url;
  };
  return (
    <div css={styles.root}>
      <div css={styles.logo}>
        <img src={logo} width="250px" height="250px" alt="logo" />
      </div>
      <div css={styles.connect}>
        <Button
          variant="contained"
          style={{ color: "black", fontSize: "25px" }}
          onClick={redirect}
          startIcon={<ArrowForwardIosIcon />}
        >
          Login with OpenID Connect and OAuth2
        </Button>
      </div>
      <div css={styles.grid}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          <Grid item xs>
            <div css={styles.card}>
              <img src={secure} width="70%" alt="secure" />
            </div>
          </Grid>

          <Grid item xs>
            <div css={styles.card}>
              <img src={easyToUse} width="70%" alt="easy to use" />
            </div>
          </Grid>

          <Grid item xs>
            <div css={styles.card}>
              <img src={free} width="70%" alt="free" />
            </div>
          </Grid>
        </Grid>
      </div>

      <br />
    </div>
  );
};

const Tokens = ({ oauth }) => {
  const { setOauth } = useContext(Context);
  const styles = useStyles(useTheme());
  const { id_token } = oauth;
  const id_payload = id_token.split(".")[1];
  const { email } = JSON.parse(atob(id_payload));
  const logout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <div css={styles.root}>
      Welcome {email}{" "}
      <Link onClick={logout} color="secondary">
        logout
      </Link>
    </div>
  );
};

const LoadToken = ({ code, codeVerifier, config, removeCookie, setOauth }) => {
  const styles = useStyles(useTheme());
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.post(
          config.token_endpoint,
          qs.stringify({
            grant_type: "authorization_code",
            client_id: `${config.client_id}`,
            code_verifier: `${codeVerifier}`,
            redirect_uri: `${config.redirect_uri}`,
            code: `${code}`,
          })
        );
        removeCookie("code_verifier");
        setOauth(data);
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  });
  return <div css={styles.root}>Loading tokens</div>;
};

export default function Login({ onUser }) {
  const styles = useStyles(useTheme());
  // const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const { oauth, setOauth } = useContext(Context);
  const config = {
    authorization_endpoint: "http://localhost:5556/dex/auth",
    token_endpoint: "http://localhost:5556/dex/token",
    client_id: "webtech-frontend",
    redirect_uri: "http://localhost:3000",
    scope: "openid%20email%20offline_access%20profile",
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  // is there a code query parameters in the url
  if (!code) {
    // no: we are not being redirected from an oauth server
    if (!oauth) {
      const codeVerifier = base64URLEncode(crypto.randomBytes(32));
      console.log("set code_verifier", codeVerifier);
      setCookie("code_verifier", codeVerifier);
      return (
        <Redirect
          codeVerifier={codeVerifier}
          config={config}
          css={styles.root}
        />
      );
    } else {
      // yes: user is already logged in, great, is is working
      return <Tokens oauth={oauth} css={styles.root} />;
    }
  } else {
    // yes: we are coming from an oauth server
    console.log("get code_verifier", cookies.code_verifier);
    return (
      <LoadToken
        code={code}
        codeVerifier={cookies.code_verifier}
        config={config}
        setOauth={setOauth}
        removeCookie={removeCookie}
      />
    );
  }
}

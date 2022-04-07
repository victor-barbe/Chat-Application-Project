/** @jsxImportSource @emotion/react */
// Layout
import { useContext, useState } from "react";

import { Button } from "@material-ui/core";
import { useTheme } from "@mui/styles";
import Context from "./Context";
import Gravatar from "react-gravatar";
import { Link } from "@mui/material";

const useStyles = (theme) => ({
  root: {
    background: "white",
    overflow: "hidden",
    flex: "1 1 auto",
    color: "#2F365F",
  },
  title: {
    color: "#2F365F",
    width: "fit-content",
    display: "block",
    margin: "auto",
    paddingTop: "3%",
    fontSize: "30px",
    fontFamily: "Lucida Console",
  },
  personnalInformations: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    paddingTop: "2%",
    "& div": {
      paddingTop: "2%",
    },
  },
  profilePicture: {
    textAlign: "center",
  },
  vide: {
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  newProfilePicture: {
    ":hover": {
      opacity: "0.3",
    },
  },
});

export default function Settings() {
  const { oauth } = useContext(Context);
  const styles = useStyles(useTheme());

  const [editBoolPp, setEditBool] = useState(false);

  const [scrollDown, setScrollDown] = useState(false);

  const [profilePicture, setProfilePicture] = useState(oauth.email);

  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown);
  };
  return (
    <main css={styles.root} onScrollDown={onScrollDown}>
      <div css={styles.title}>Settings</div>
      <div css={styles.personnalInformations}>
        Name : {oauth.name}
        <div />
        Email : {oauth.email}
        <div>
          Profile picture :
          <div css={styles.profilePicture}>
            {profilePicture === oauth.email ? (
              <Gravatar email={profilePicture} size={100} />
            ) : (
              <img
                src={profilePicture}
                height={100}
                width={100}
                alt="profile picture"
              />
            )}
            <Link
              href={"https://en.gravatar.com/gravatars/new/"}
              target="_blank"
              underline={"none"}
              text-decoration={"none"}
            >
              <div>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  text-decoration={"none"}
                >
                  Modify PP with Gravatar
                </Button>
              </div>
            </Link>
            <div>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                  editBoolPp ? setEditBool(false) : setEditBool(true);
                }}
              >
                Modify PP with one provided by our APP
              </Button>
              <div />
              {editBoolPp ? (
                <span>
                  <img
                    src="https://image.freepik.com/vecteurs-libre/gens-blanc_24877-49457.jpg"
                    height={100}
                    width={100}
                    alt="profile picture"
                    css={styles.newProfilePicture}
                    onClick={() => {
                      setProfilePicture(
                        "https://image.freepik.com/vecteurs-libre/gens-blanc_24877-49457.jpg"
                      );
                    }}
                  />
                  <span css={styles.vide}></span>
                  <img
                    src="https://image.freepik.com/vecteurs-libre/gens-blanc_24877-49458.jpg"
                    height={100}
                    width={100}
                    alt="profile picture"
                    css={styles.newProfilePicture}
                    onClick={() => {
                      setProfilePicture(
                        "https://image.freepik.com/vecteurs-libre/gens-blanc_24877-49458.jpg"
                      );
                    }}
                  />
                  <span css={styles.vide}></span>
                  <Gravatar
                    css={styles.newProfilePicture}
                    email={oauth.email}
                    size={100}
                    onClick={() => {
                      setProfilePicture(oauth.email);
                    }}
                  />
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** @jsxImportSource @emotion/react */
import { useContext } from "react";
// Layout
import { useTheme } from "@mui/styles";
import { IconButton, Link } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Context from "./Context";

import { Button } from "@material-ui/core";

const useStyles = (theme) => ({
  header: {
    backgroundColor: "#03224C",
    fontSize: "26px",
    fontFamily: "Lucida Console",
    color: "#F7F1ED",
    padding: "10px",
  },

  welcome: {
    paddingRight: "3%",
  },
  grid: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },

  homepageButton: {
    color: "#2F365F",
    borderRadius: "35px",
  },

  homepageCss: {
    paddingLeft: "3%",
  },

  logoutButton: {
    borderRadius: "35px",
    backgroundColor: "#BB0B0B",
    color: "white",
  },

  logoutCss: {
    paddingRight: "2%",
  },

  headerLogIn: {
    backgroundColor: "red",
  },
  headerLogOut: {
    backgroundColor: "blue",
  },
  menu: {
    [theme.breakpoints.up("sm")]: {
      display: "none !important",
    },
  },
  login: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

export default function Header({ drawerToggleListener }) {
  const styles = useStyles(useTheme());
  const { oauth, setOauth, drawerVisible, setDrawerVisible } =
    useContext(Context);
  const drawerToggle = (e) => {
    setDrawerVisible(!drawerVisible);
  };
  const onClickLogout = (e) => {
    e.stopPropagation();
    setOauth(null);
  };
  return (
    <header css={styles.header}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={drawerToggle}
        css={styles.menu}
      >
        <MenuIcon />
      </IconButton>

      {oauth ? (
        <span css={styles.grid}>
          <div css={styles.homepageCss}>
            <Link href={`/`} underline={"none"}>
              <Button style={styles.homepageButton} variant={"contained"}>
                Homepage
              </Button>
            </Link>
          </div>
          <div css={styles.welcome}>{oauth.name}</div>
          <div css={styles.logoutCss}>
            <Link href={`/`} underline={"none"}>
              <Button onClick={onClickLogout} style={styles.logoutButton}>
                logout
              </Button>
            </Link>
          </div>
        </span>
      ) : (
        <span css={styles.login}>Welcome</span>
      )}
    </header>
  );
}

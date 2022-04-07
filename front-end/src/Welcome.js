/** @jsxImportSource @emotion/react */
// Layout
import { useTheme } from "@mui/styles";
import { Grid } from "@mui/material";

import easyToUse from "./images/Easy_to_use.png";
import free from "./images/Free.png";
import secure from "./images/Secure.png";

import step1 from "./images/Step_1.png";
import step2 from "./images/Step_2.png";
import step3 from "./images/Step_3.png";
import step4 from "./images/Step_4.png";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    color: "black",
    fontFamily: "Fantasy",

    paddingTop: "3%",
    overflow: "scroll",
    "& li": {
      paddingTop: "5px",
      marginLeft: "10%",
      listStyleType: "disc",
    },
  },
  card: {
    textAlign: "center",
  },
  welcome: {
    fontSize: "34px",
    fontFamily: "Inconsolata",
    color: "#F7F1ED",
    textAlign: "center",
    backgroundColor: "#03224C",
    paddingTop: "5%",
    paddingBottom: "5%",
  },
  underWelcome: {
    fontSize: "24px",
  },
  content: {
    paddingTop: "3%",
    paddingLeft: "3%",
    fontFamily: "Lucida Console",
    fontSize: "18px",
  },
  logo: {
    paddingLeft: "27%",
  },
  grid: {
    paddingTop: "30px",
    flex: "1 1 auto",
  },
  padding: {
    paddingLeft: "12%",
  },
});

export default function Welcome() {
  const styles = useStyles(useTheme());
  return (
    <div css={styles.root}>
      <div css={styles.welcome}>
        ECE Chat <div css={styles.underWelcome}>The easy-to-use Chat App</div>
      </div>
      <div css={styles.padding}>
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
                <img src={secure} width="80%" alt="secure" />
              </div>
            </Grid>

            <Grid item xs>
              <div css={styles.card}>
                <img src={easyToUse} width="80%" alt="easy to use" />
              </div>
            </Grid>

            <Grid item xs>
              <div css={styles.card}>
                <img src={free} width="80%" alt="free" />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div css={styles.content}>
        <h3>
          ECE Chat is a real time message application that allow users to create
          private channels and communicate with their friends or coworkers.
        </h3>
        <br />
        <br />
        <br />
        Get started by creating a channel and inviting friends :
        <div css={styles.image}>
          <img src={step1} width="80%" alt="step1" />
        </div>
        You're now on the channel creation page. You can set your channel's
        name, invite as many friends as you want, clicking "ADD FRIEND". <br />
        Once done, you can submit the creation.
        <div css={styles.image}>
          <img src={step2} width="80%" alt="step2" />
        </div>
        New Channel informations are now displayed to you. You can check every
        informations before confirming the creation. If you confirm, the channel
        will be created and you and all the invited friends will have access to
        this channel.
        <div css={styles.image}>
          <img src={step3} width="80%" alt="step3" />
        </div>
        Your new channel is available in your channel's list. You can now chat
        with your friends.
        <div css={styles.image}>
          <img src={step4} width="80%" alt="step4" />
        </div>
      </div>
    </div>
  );
}

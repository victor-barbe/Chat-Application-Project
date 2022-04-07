/** @jsxImportSource @emotion/react */
// Layout
import { Button, TextField } from "@material-ui/core";
import { useTheme } from "@mui/styles";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Context from "./Context";

import axios from "axios";
import { useState, useContext } from "react";

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
  inputs: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    paddingTop: "10%",
  },
  buttons: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    paddingTop: "10%",
  },
  dialog: {
    color: "black",
  },
  friendsButton: {
    width: "fit-content",
    display: "block",
    margin: "auto",
    paddingTop: "2%",
  },
});

export default function NewChannel() {
  const onSubmit = () => {
    axios.post(`http://localhost:3001/channels`, {
      // route to create a new channel in the database, setting name of the channel, admin and members
      name: channelName,
      admin: oauth.name,
      members: channelMembers,
    });
    window.location = "/"; // redirect to main page
  };

  const [channelName, setChannelName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [channelMembers, setChannelMembers] = useState([]);

  const addMember = () => {
    // function to add a member to the channel that we're creating
    let tempList = channelMembers; // tempList in order to use useState
    tempList.push(newMember);
    setChannelMembers(tempList);
  };

  const { oauth } = useContext(Context);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleChangeFriend = (e) => {
    setNewMember(e.target.value);
  };

  const styles = useStyles(useTheme());
  return (
    <main css={styles.root}>
      <div css={styles.title}>Channel Creation</div>
      <div css={styles.inputs}>
        <TextField
          label="Channel name"
          variant="outlined"
          onChange={handleChange}
        ></TextField>
        <div css={styles.inputs}>
          <TextField
            label="Invite friends"
            variant="outlined"
            onChange={handleChangeFriend}
          ></TextField>
          <div css={styles.friendsButton}>
            <Button
              onClick={() => {
                addMember();
              }}
            >
              Add friend
            </Button>
          </div>
        </div>

        <div css={styles.buttons}>
          <Button
            variant="outlined"
            onClick={() => {
              handleClickOpen();
            }}
          >
            Submit
          </Button>
          <div css={styles.dialog}>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                style={{
                  backgroundColor: "#2F365F",
                  color: "#F7F1ED",
                  fontFamily: "Lucida Console",
                }}
                id="alert-dialog-title"
              >
                {
                  "Are you sure you want to create a Channel with these informations ? "
                }
              </DialogTitle>
              <DialogContent
                style={{
                  backgroundColor: "#F7F1ED",
                  color: "#2F365F",
                  paddingTop: "5%",
                }}
              >
                <DialogContentText
                  style={{ backgroundColor: "#F7F1ED", color: "#2F365F" }}
                  id="alert-dialog-description"
                >
                  Channel Name : {channelName} <br />
                  Friends :
                  <ul>
                    {channelMembers.map((member, i) => (
                      <li key={i}>{member}</li>
                    ))}
                  </ul>
                </DialogContentText>
              </DialogContent>
              <DialogActions
                style={{
                  backgroundColor: "#F7F1ED",
                  color: "#2F365F",
                  borderTop: "3px solid rgba(47, 54, 95, 0.5)",
                }}
              >
                <Button color="secondary" onClick={handleClose}>
                  Disagree
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    onSubmit();
                    handleClose();
                  }}
                  autoFocus
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </main>
  );
}

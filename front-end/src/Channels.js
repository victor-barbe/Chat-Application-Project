/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// Layout

import { Link as RouterLink } from "react-router-dom";
// Local
import Context from "./Context";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// ICONS
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import AddBoxIcon from "@mui/icons-material/AddBox";

const styles = {
  root: {
    backgroundColor: "#F7F1ED",
    overflow: "scroll",

    "& a": {
      padding: ".2rem .5rem",
      whiteSpace: "nowrap",
    },
  },
  channel: {
    textAlign: "center",
    padding: "10 px",
  },
  dialog: {
    color: "black",
  },
  important: {
    color: "red",
  },
  createChannel: {
    textAlign: "center",
    paddingTop: "3%",
  },
  menu: {
    textAlign: "center",
    color: "black",
    paddingTop: "2%",
  },
  settings: {
    textAlign: "center",
    color: "black",
  },
  myChannels: {
    textAlign: "center",
    color: "black",
    marginTop: "10%",
    paddingTop: "2%",
    paddingBottom: "5%",
    borderTop: "3px solid rgba(47, 54, 95, 0.5)",
  },
};

export default function Channels() {
  const { oauth, channels, setChannels } = useContext(Context);
  const [boolMenu, setBoolMenu] = useState(false);
  const [open, setOpen] = useState(false);

  const [index, setIndex] = useState(0);

  const [boolDelete, setBoolDelete] = useState(false);

  const [boolAddFriends, setBoolAddFriends] = useState(false);

  const [boolSettings, setBoolSettings] = useState(false);

  const [newMember, setNewMember] = useState([]);

  const [uniqueNewMember, setUniqueNewMember] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeFriend = (e) => {
    setUniqueNewMember(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setBoolAddFriends(false);
    setBoolDelete(false);
    setBoolSettings(false);
  };

  const addMember = async (channel) => {
    // function to add a new member to a channel when the channel is already created
    let tempList = newMember; // tempList in order to use useState
    tempList.push(uniqueNewMember);
    setNewMember(uniqueNewMember);
    await axios.put(`http://localhost:3001/channels/${channel.id}`, {
      // route to modify the database and add a new member
      ...channel,
      members: newMember,
    });
  };

  const onDelete = (channelID) => {
    axios.delete(`http://localhost:3001/channels/${channelID}`); // route to delete a channel
    window.location = "/";
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: channels } = await axios.get(
          `http://localhost:3001/channels/connexion/${oauth.name}`,
          {}
        );
        setChannels(channels);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [oauth, setChannels]);
  return (
    <ul css={styles.root}>
      <div css={styles.menu}>
        <Button
          to="/channels"
          component={RouterLink}
          onClick={() => {
            setBoolMenu(false);
          }}
        >
          Menu
        </Button>
      </div>
      <div css={styles.createChannel}>
        <Button
          style={{
            color: "rgb(18, 130, 76)",
          }}
          href={`/newChannel`}
          endIcon={<AddBoxIcon />}
        >
          Create channel
        </Button>
      </div>
      <div css={styles.settings}>
        <Button href={`/settings`} endIcon={<SettingsIcon />}>
          Settings
        </Button>
      </div>
      <div css={styles.myChannels}>
        <Button
          to="/channels"
          component={RouterLink}
          onClick={() => {
            setBoolMenu(false);
          }}
        >
          My channels{" "}
        </Button>
      </div>
      {channels.map((channel, i) => (
        <li key={i} css={styles.channel}>
          <Button
            href={`/channels/${channel.id}`}
            fullWidth
            style={{ fontSize: "15px" }}
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/channels/${channel.id}`);
              setBoolMenu(true);
              setIndex(i);
            }}
          >
            {channel.name}
          </Button>
          {boolMenu === true && index === i ? (
            <>
              <Button
                color="primary"
                style={{
                  color: "rgb(18, 130, 76)",
                  fontSize: "10px",
                }}
                endIcon={<GroupAddIcon />}
                onClick={() => {
                  handleClickOpen();
                  setBoolAddFriends(true);
                  setBoolDelete(false);
                  setBoolSettings(false);
                  setNewMember(channel.members);
                }}
              >
                Invite friends
              </Button>
              <div />
              <div>
                <Button
                  style={{
                    fontSize: "10px",
                    color: "blue",
                  }}
                  onClick={() => {
                    handleClickOpen();
                    setBoolAddFriends(false);
                    setBoolDelete(false);
                    setBoolSettings(true);
                  }}
                  endIcon={<HelpOutlineIcon />}
                >
                  Informations
                </Button>
              </div>
              <Button
                color="secondary"
                style={{
                  fontSize: "10px",
                }}
                endIcon={<DeleteForeverIcon />}
                onClick={() => {
                  handleClickOpen();
                  setBoolDelete(true);
                  setBoolSettings(false);
                }}
              >
                Delete {channel.name}
              </Button>
              <div css={styles.dialog}>
                {boolDelete === true && channel.admin === oauth.name ? (
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
                      Are you sure you want to delete{" "}
                      <span css={styles.important}>{channel.name}</span> forever
                      ?
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
                        Your friends and you will never have access to this
                        channel again
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions
                      style={{
                        backgroundColor: "#F7F1ED",
                        color: "#2F365F",
                        borderTop: "3px solid rgba(47, 54, 95, 0.5)",
                      }}
                    >
                      <Button
                        color="secondary"
                        onClick={() => {
                          handleClose();
                          setBoolDelete(false);
                        }}
                      >
                        Disagree
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          handleClose();
                          onDelete(channel.id);
                          setBoolDelete(false);
                        }}
                        autoFocus
                      >
                        Agree
                      </Button>
                    </DialogActions>
                  </Dialog>
                ) : boolDelete === true && channel.admin !== oauth.name ? (
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle
                      id="alert-dialog-title"
                      style={{
                        backgroundColor: "#2F365F",
                        color: "#F7F1ED",
                        fontFamily: "Lucida Console",
                      }}
                    >
                      <span css={styles.important}>Error</span>
                    </DialogTitle>
                    <DialogContent
                      style={{
                        backgroundColor: "#F7F1ED",
                        color: "#2F365F",
                        paddingTop: "5%",
                      }}
                    >
                      <DialogContentText
                        id="alert-dialog-description"
                        style={{ backgroundColor: "#F7F1ED", color: "#2F365F" }}
                      >
                        You do not have the rights to delete this channel.
                        Please contact the admin :{" "}
                        <span css={styles.important}>{channel.admin}</span>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions
                      style={{
                        backgroundColor: "#F7F1ED",
                        color: "#2F365F",
                        borderTop: "3px solid rgba(47, 54, 95, 0.5)",
                      }}
                    >
                      <Button color="primary" onClick={handleClose} autoFocus>
                        Agree
                      </Button>
                    </DialogActions>
                  </Dialog>
                ) : null}
                {boolAddFriends ? (
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle
                      style={{
                        backgroundColor: "#2F365F",
                        color: "#F7F1ED",
                        fontFamily: "Lucida Console",
                        minWidth: "400px",
                      }}
                    >
                      Invite friends
                    </DialogTitle>
                    <DialogContent
                      style={{
                        backgroundColor: "#F7F1ED",
                        color: "#2F365F",
                        paddingTop: "5%",
                      }}
                    >
                      <DialogContentText
                        style={{
                          backgroundColor: "#F7F1ED",
                          color: "#2F365F",
                        }}
                      >
                        Invite friend to channel{" "}
                        <span css={styles.important}>{channel.name}</span>
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Friend Name"
                        type="email"
                        fullWidth
                        variant="standard"
                        onChange={handleChangeFriend}
                      />
                      <DialogContentText
                        style={{
                          backgroundColor: "#F7F1ED",
                          color: "#2F365F",
                          paddingTop: "2%",
                        }}
                      >
                        Current friends in this channel :{" "}
                        <ul>
                          {channel.members.map((member, i) => (
                            <li key={i}>- {member}</li>
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
                      <Button
                        color="secondary"
                        onClick={() => {
                          handleClose();
                          setBoolAddFriends(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          handleClose();
                          setBoolAddFriends(false);
                          addMember(channel);
                        }}
                      >
                        Invite
                      </Button>
                    </DialogActions>
                  </Dialog>
                ) : null}
                {boolSettings && (
                  <div css={styles.dialog}>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle
                        id="alert-dialog-title"
                        style={{
                          backgroundColor: "#2F365F",
                          color: "#F7F1ED",
                          fontFamily: "Lucida Console",
                          minWidth: "400px",
                        }}
                      >
                        <span css={styles.important}> {channel.name}</span>{" "}
                        informations
                      </DialogTitle>
                      <DialogContent
                        style={{
                          backgroundColor: "#F7F1ED",
                          color: "#2F365F",
                          paddingTop: "5%",
                        }}
                      >
                        <DialogContentText
                          id="alert-dialog-description"
                          style={{
                            backgroundColor: "#F7F1ED",
                            color: "#2F365F",
                          }}
                        >
                          Admin : {channel.admin}
                          <div>
                            Friends :
                            <ul>
                              {channel.members.map((member, i) => (
                                <li key={i}>- {member}</li>
                              ))}
                            </ul>
                          </div>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions
                        style={{
                          backgroundColor: "#F7F1ED",
                          color: "#2F365F",
                          borderTop: "3px solid rgba(47, 54, 95, 0.5)",
                        }}
                      >
                        <Button
                          color="primary"
                          onClick={() => {
                            handleClose();
                            setBoolSettings(false);
                          }}
                          autoFocus
                        >
                          Quit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

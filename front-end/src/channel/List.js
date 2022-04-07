/** @jsxImportSource @emotion/react */
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
// Layout
import { useTheme } from "@mui/styles";
// Markdown
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
// Time
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";

// Mui
import { Button } from "@material-ui/core";

import axios from "axios";
import Context from "../Context";
import { TextField } from "@mui/material";

// Dialogs

import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  calendar: {
    sameElse: "DD/MM/YYYY hh:mm A",
  },
});

const useStyles = (theme) => ({
  root: {
    position: "relative",
    paddingLeft: "3%",
    paddingRight: "2%",
    flex: "1 1 auto",
    overflow: "auto",
    "& ul": {
      margin: 0,
      padding: 0,
      textIndent: 0,
      listStyleType: 0,
    },
  },
  message: {
    padding: ".2rem .5rem",
    ":hover": {
      backgroundColor: "rgba(255,255,255,.05)",
    },
  },

  message_sent: {
    width: "50%",
    border: "3px solid #2F365F",
    backgroundColor: "#2F365F",
    color: "white",
    borderRadius: "10px",
    marginLeft: "45%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },

  message_received: {
    width: "50%",
    border: "3px solid #D3D3D3",
    backgroundColor: "#D3D3D3",
    color: "#2F365F",
    borderRadius: "10px",
    marginRight: "55%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },

  fabWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50px",
  },
  fab: {
    position: "fixed !important",
    top: 0,
    width: "50px",
  },
  delete: {
    display: "flex",
    float: "right",
  },
  contour: {
    padding: "10px 5px 30px 5px",
    borderTop: "2px solid rgba(0,0,0, 0.1)",
    // opacity: "0.3",
  },
  author_email: {
    display: "flex",
    float: "right",
  },
  box: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: "0",
    p: 4,
  },
  editing: {
    width: "100%",
    backgroundColor: "#2F365F",
    color: "white",
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  confirm_editing: {
    color: "white",
  },
  dialog: {
    color: "black",
  },
  printAdmin: {
    display: "flex",
    float: "right",
    fontSize: "18px",
  },
});

export default forwardRef(
  ({ channel, messages, onScrollDown, setMessages }, ref) => {
    // MODAL MUI
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const [boolDelete, setBoolDelete] = useState(false);

    const [newMessage, setNewMessage] = useState("");

    const [editBool, setEditBool] = useState(false);
    const [index, setIndex] = useState(0);
    const [indexDel, setIndexDel] = useState(0);

    const updateMessages = () => {
      fetchMessages();
    };
    const fetchMessages = async () => {
      setMessages([]);
      const { data: messages } = await axios.get(
        `http://localhost:3001/channels/${channel.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${oauth.access_token}`,
          },
        }
      );
      setMessages(messages);
    };
    const onDelete = async (messageDel) => {
      await axios.delete(
        `http://localhost:3001/channels/${channel.id}/messages/${messageDel.creation}` // route to delete the message in params (app.js), it finds the correct message and delete it
      );
      updateMessages();
    };

    const onUpdate = async (messageUpd, newMessage) => {
      await axios.put(
        `http://localhost:3001/channels/${channel.id}/messages/${messageUpd.creation}`, // route to update the message in params, it finds the correct message and update it
        { content: newMessage }
      );
      updateMessages();
    };

    const handleChangeMessage = (e) => {
      setNewMessage(e.target.value);
    };

    const styles = useStyles(useTheme());
    // Expose the `scroll` action
    const { oauth, setOauth } = useContext(Context);
    useImperativeHandle(ref, () => ({
      scroll: scroll,
    }));
    const rootEl = useRef(null);
    const scrollEl = useRef(null);
    const scroll = () => {
      scrollEl.current.scrollIntoView();
    };

    // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
    const throttleTimeout = useRef(null); // react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const rootNode = rootEl.current; // react-hooks/exhaustive-deps
      const handleScroll = () => {
        if (throttleTimeout.current === null) {
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
            const { scrollTop, offsetHeight, scrollHeight } = rootNode; // react-hooks/exhaustive-deps
            onScrollDown(scrollTop + offsetHeight < scrollHeight);
          }, 200);
        }
      };
      handleScroll();
      rootNode.addEventListener("scroll", handleScroll);
      return () => rootNode.removeEventListener("scroll", handleScroll);
    });

    debugger;
    return (
      <>
        <div css={styles.root} ref={rootEl}>
          <h1>
            Messages for {channel.name}{" "}
            <span css={styles.printAdmin}>Admin : {channel.admin}</span>
          </h1>

          <ul>
            {messages.map((message, i) => {
              const { value } = unified()
                .use(markdown)
                .use(remark2rehype)
                .use(html)
                .processSync(message.content);

              return oauth.name === message.author ? (
                <li key={i} css={styles.message}>
                  <p css={styles.contour}>
                    <span>
                      <Button
                        color="primary"
                        onClick={() => {
                          editBool ? setEditBool(false) : setEditBool(true);
                          setIndex(i); // onClick editState value = true
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          handleClickOpen();
                          setIndexDel(i);
                          setBoolDelete(true);
                        }}
                        color="secondary"
                      >
                        Delete
                      </Button>
                    </span>
                    <span css={styles.author_email}>
                      {dayjs().calendar(message.creation)}
                      {" - "}
                      {message.author}
                    </span>
                  </p>
                  {editBool && index === i ? (
                    <div css={styles.message_sent}>
                      <TextField
                        defaultValue={message.content}
                        multiline
                        variant={"standard"}
                        css={styles.editing}
                        onChange={handleChangeMessage}
                      />
                      <div css={styles.confirm_editing}>
                        <Button
                          style={styles.confirm_editing}
                          onClick={() => {
                            setEditBool(false);
                            onUpdate(message, newMessage);
                          }}
                        >
                          Confirm editing
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div css={styles.message_sent}>
                      <div dangerouslySetInnerHTML={{ __html: value }}></div>
                    </div>
                  )}
                  {boolDelete === true && indexDel === i ? (
                    <div css={styles.dialog}>
                      <Dialog
                        style={{ backgroundColor: "transparent" }}
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
                          Are you sure you want to delete this message ?
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
                            {indexDel === i && open === true ? (
                              <span>
                                Message content: <br />"{message.content}"
                              </span>
                            ) : null}
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
                            onClick={() => {
                              handleClose();
                              onDelete(message);
                            }}
                            color="primary"
                            autoFocus
                          >
                            Agree
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  ) : null}
                </li>
              ) : (
                <li key={i} css={styles.message}>
                  <p css={styles.contour}>
                    <span>{message.author}</span>
                    {" - "}
                    <span>{dayjs().calendar(message.creation)}</span>
                  </p>
                  <div css={styles.message_received}>
                    <div dangerouslySetInnerHTML={{ __html: value }}></div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div ref={scrollEl} />
        </div>
      </>
    );
  }
);

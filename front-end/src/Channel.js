/** @jsxImportSource @emotion/react */
import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
// Layout
import { useTheme } from "@mui/styles";
import { Fab } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// Local
import Form from "./channel/Form";
import List from "./channel/List";
import Context from "./Context";
import { useNavigate, useParams } from "react-router-dom";

const useStyles = (theme) => ({
  root: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "auto",
    color: "black",
  },
  root_author: {
    height: "100%",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflowX: "auto",
    color: "red",
  },

  fab: {
    position: "absolute !important",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: "none !important",
  },
});

export default function Channel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { channels, oauth } = useContext(Context);
  const channel = channels.find((channel) => channel.id === id);
  const styles = useStyles(useTheme());
  const listRef = useRef();
  const [messages, setMessages] = useState([]);
  const [scrollDown, setScrollDown] = useState(false);
  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: messages } = await axios.get(
          // get the messages from the database
          `http://localhost:3001/channels/${id}/messages`,
          {
            headers: {
              // TODO: secure the request
            },
          }
        );
        setMessages(messages);
        if (listRef.current) {
          listRef.current.scroll();
        }
      } catch (err) {
        navigate("/oups");
      }
    };
    fetch();
  }, [id, oauth, navigate]);
  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown);
  };
  const onClickScroll = () => {
    listRef.current.scroll();
  };
  if (!channel) {
    return <div>loading</div>;
  }

  return oauth.email === messages.author ? (
    <div css={styles.root_author}>
      <List
        channel={channel}
        messages={messages}
        ref={listRef}
        setMessages={setMessages}
        onScrollDown={onScrollDown}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  ) : (
    <div css={styles.root}>
      <List
        channel={channel}
        messages={messages}
        onScrollDown={onScrollDown}
        ref={listRef}
        setMessages={setMessages}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  );
}

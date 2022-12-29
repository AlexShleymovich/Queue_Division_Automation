import { useState, useContext } from "react";
import { Container, ListItems, Header } from "./Styles/ShifterText.styled";
import { ItemsContext } from "./Context";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

const ShifterText = (props) => {
  const { whoWork } = useContext(ItemsContext);
  const [copied, setCopied] = useState("Copy to clipboard");

  const sufix = (date) => {
    if (date > 20 || date < 10) {
      switch (date % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    } else {
      return "th";
    }
  };

  const dateBuilder = () => {
    const newDate = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    const myDate =
      new Intl.DateTimeFormat("en-US", options).format(newDate) +
      sufix(newDate.getDate());
    return myDate;
  };
  const date_text = "Queue Division - " + dateBuilder() + ":\n\n";
  const shifters_text = whoWork
    .map((shifter) => "*" + String(shifter.employee) + "*: " + shifter.time)
    .join("\n");
  const reminder_text =
    "\n\n:phone_green::phonecall: Please make sure you are all connected to Five9 :phone_green::phonecall:";

  props.slack(date_text + shifters_text + reminder_text);
  const onClickHandler = () => {
    const textArea = document.createElement("textarea");
    textArea.value = date_text + shifters_text + reminder_text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    // navigator.clipboard.writeText(date_text + shifters_text + reminder_text);
    setCopied("Copied");
  };

  return (
    <Container>
      <Header>
        <Typography variant="h6" sx={{ display: "block" }}>
          Queue Division - {dateBuilder()}:
        </Typography>
        <Tooltip
          sx={{ display: "block"}}
          onMouseOver={() => {
            setCopied("Copy to clipboard");
          }}
          title={copied}
          placement="top"
          arrow
        >
          <IconButton onClick={onClickHandler}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Header>
      {whoWork.map((shifter) => {
        return (
          <ListItems key={shifter.id}>
            {shifter.employee}: {shifter.time}
          </ListItems>
        );
      })}
    </Container>
  );
};

export default ShifterText;

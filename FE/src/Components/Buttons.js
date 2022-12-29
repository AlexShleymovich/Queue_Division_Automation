import { useContext } from "react";
import { ItemsContext, UserContext } from "./Context";
import Button from "@mui/material/Button";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { Container } from "./Styles/Buttons.styled";

const Buttons = (props) => {
  const { setWhoWork } = useContext(ItemsContext);
  const { userToken, setUserToken } = useContext(UserContext);
  const navigate = useNavigate();

  const onClickHandler = async () => {
    const response = await fetch("http://127.0.0.1:5000/main", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });
    if (response.status === 401) {
      console.log("session expired -> redirect");
      setUserToken();
      navigate("/");
    } else {
      const data = await response.json();
      setWhoWork(data[0]);
    }
  };

  const onClickHandlerSlack = async () => {
    await fetch(
      "Your Webhook URL",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({"text": props.data})
      }
    );
  };
  return (
    <Container>
      <Button
        variant="contained"
        size="large"
        sx={{ mt: "15px", ml: "70px", height: 45, width: 170, fontSize: 23 }}
        startIcon={<RestartAltIcon />}
        onClick={onClickHandler}
      >
        Reset
      </Button>
      <Button
        variant="contained"
        size="large"
        sx={{ mt: "15px", ml: "50px", height: 45, width: 300, fontSize: 23 }}
        startIcon={<SendIcon />}
        onClick={onClickHandlerSlack}
      >
        Send to Slack
      </Button>
    </Container>
  );
};

export default Buttons;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, ItemsContext } from "./Context";
import { Backdrop, CircularProgress } from "@mui/material";
import Shifter from "./Shifter";
import Buttons from "./Buttons";
import ShifterText from "./ShifterText";
import { Container, Tabs, TextTabs } from "./Styles/Items.styled";

const Items = () => {
  const { userToken, setUserToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [whoWork, setWhoWork] = useState();
  const [open, setOpen] = useState(true);
  const [deletedShifter, setDeletedShifter] = useState(null);
  const [scheduleText, setScheduleText] = useState(null);
  const [night, setNight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
        setNight(data[1]);
        setOpen(false);
      }
    };
    if (!userToken) {
      navigate("/");
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const updateDataFetch = async () => {
      const response = await fetch("http://127.0.0.1:5000/main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({ deleted: deletedShifter, night: night }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          alert("Sorry...Unable to delete this shifter");
        } else {
          console.log("session expired -> redirect from POST");
          setUserToken();
          navigate("/");
        }
      } else {
        const data = await response.json();
        setWhoWork(data[0]);
      }
    };
    if (deletedShifter !== null) {
      updateDataFetch();
    }
  }, [deletedShifter]);

  return (
    <div>
      {!whoWork && (
        <Backdrop open={open} color="#DCDCDC">
          <CircularProgress color="inherit" />
          <h1>Fetching</h1>
        </Backdrop>
      )}
      {whoWork && (
        <Container>
          <ItemsContext.Provider value={{ whoWork, setWhoWork }}>
            <Tabs>
              <Shifter
                onChangeShifterDelete={setDeletedShifter}
                onChangeNightShifters={setNight}
                data={night}
              />
            </Tabs>
            <TextTabs>
              <ShifterText slack={setScheduleText} />
            </TextTabs>
            <Buttons data={scheduleText} />
          </ItemsContext.Provider>
        </Container>
      )}
    </div>
  );
};

export default Items;

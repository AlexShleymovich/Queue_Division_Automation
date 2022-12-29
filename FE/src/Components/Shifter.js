import { useContext, useState } from "react";
import { ItemsContext } from "./Context";
import { Container, Text } from "./Styles/Shifter.styled";
import { Button } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const Shifter = (props) => {
  const { whoWork } = useContext(ItemsContext);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [night, setNight] = useState(props.data);

  const onClickSubmit = (id, night) => {
    const removedShifter = whoWork.filter((shifter) => shifter.id === id);
    props.onChangeNightShifters(night);
    props.onChangeShifterDelete(removedShifter);
  };
  const onChangeHandler = (event) => {
    setNight(event.target.value);
  };

  return (
    <div>
      {whoWork.map((shifter) => (
        <Container key={shifter.id}>
          <Text>
            {shifter.time} <span>&nbsp;&nbsp;&nbsp;</span>
            {shifter.employee}
          </Text>
          <Button
            onClick={() => {
              setOpen(true);
              setId(shifter.id);
            }}
          >
            <HighlightOffIcon fontSize="medium" />
          </Button>
          <Dialog
            sx={{backgroundColor: 'transparent', opacity: '0.6', }}
            open={open}
            onClose={() => {
              setOpen(false);
              setId(null);
            }}
          >
            <DialogTitle>
              How many night shifters?
            </DialogTitle>
            <DialogContent>
                <FormControl>
                  <RadioGroup row onChange={onChangeHandler}>
                    <FormControlLabel value="1" control={<Radio />} label="1" />
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                  </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                type="button"
                onClick={() => {
                  onClickSubmit(id, night);
                  setOpen(false);
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      ))}
    </div>
  );
};
export default Shifter;

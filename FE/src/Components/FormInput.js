import TextField from "@mui/material/TextField";
import { Container } from "./Styles/FormInput.styled";

const FormInput = (props) => {
  return (
    <Container>
      <TextField
        fullWidth
        type={props.type}
        label={props.label}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </Container>
  );
};

export default FormInput;

import { useState, useContext, useEffect } from "react";
import FormInput from "./FormInput";
import { Container } from "./Styles/Login.styled";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Context";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const Login = () => {
  const [loginError, setLoginError] = useState(false);
  const { userToken, setUserToken } = useContext(UserContext);
  const[clicked, setClicked] = useState(false)
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
    company_code: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      label: "Username",
    },
    {
      id: 2,
      name: "password",
      type: "password",
      label: "Password",
    },
    {
      id: 3,
      name: "company_code",
      type: "text",
      label: "Company Code",
    },
  ];

  useEffect(() => {
    if (userToken) {
      navigate("/main");
    }
  });

  async function onClickHandler() {
    setClicked(true);
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        company_code: values.company_code,
      }),
    });
    if (!response.ok) {
      setClicked(false);
      setLoginError(true);
    } else {
      const data = await response.json();
      setUserToken(data.access_token);
      navigate("/main");
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setLoginError(false);
  };
  return (
    <Container>
      <form>
        <Typography
          variant="h1"
          sx={{ pt: "3px", m: "auto", fontWeight: "400", fontSize: "50px" }}
        >
          Login
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{ mb: "10px", mt: "10px" }}>
            Wrong Username or Password
          </Alert>
        )}
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            type={input.type}
            name={input.name}
            label={input.label}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        {!clicked ? (<Button
          variant="contained"
          size="large"
          onClick={onClickHandler}
          sx={{ mb: "15px", mt: "5px", height: 45, width: 170, fontSize: 23 }}
        >
          Start
        </Button>) : <CircularProgress />}
      </form>
    </Container>
  );
};

export default Login;

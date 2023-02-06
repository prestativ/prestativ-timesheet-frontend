import { useContext, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "context/AuthContext";
import { useForm } from "react-hook-form";
import { UserRegister } from "interfaces/users.interface";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "services/roles.service";
import { Roles } from "interfaces/roles.interface";
import { validateEmail } from "utils/validator";
import { toast } from "react-toastify";
import { Permission } from "components/Permission";

export function RegisterUser() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { data } = useQuery(["roles"], getRoles);
  const { signUp } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm<UserRegister>({});

  const onSubmit = handleSubmit(
    ({ name, surname, email, password, role, typeField }) => {
      if (validateEmail(email)) {
        signUp({ name, surname, email, password, role, typeField }).then(() => {
          reset();
        });
      } else {
        toast.error("O Email digitado é inválido.");
      }
    }
  );

  return (
    <Permission roles={["CADASTRO_USUARIO"]}>
      <form className="c-register-user" onSubmit={onSubmit}>
        <h1 className="c-register-user--title">Criar um novo usuário</h1>
        <div className="c-register-user--input-container">
          <TextField
            required
            color="warning"
            type="text"
            label="Nome"
            sx={{ width: "100%" }}
            {...register("name")}
          />
          <TextField
            required
            color="warning"
            type="text"
            label="Sobrenome"
            sx={{ width: "100%" }}
            {...register("surname")}
          />
        </div>
        <TextField
          required
          color="warning"
          label="E-mail"
          type="email"
          {...register("email")}
        />
        <TextField
          required
          color="warning"
          label="Password"
          type={isPasswordVisible ? "text" : "password"}
          {...register("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setIsPasswordVisible((prevState) => !prevState)
                  }
                >
                  {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          color="warning"
          select
          defaultValue={"nenhum"}
          label="Campo Cadastral"
          type="typeField"
          {...register("typeField")}
        >
          <MenuItem value={"nenhum"} key={0}>
            Não se aplica
          </MenuItem>
          <MenuItem value={"gerenteprojetos"} key={1}>
            Gerente de Projetos
          </MenuItem>
          <MenuItem value={"consultor"} key={2}>
            Consultor
          </MenuItem>
        </TextField>
        <TextField
          label="Perfil do Usuário"
          select
          color="warning"
          {...register("role")}
        >
          <MenuItem value="">Selecione uma opção</MenuItem>
          {data?.data.map((role: Roles) => (
            <MenuItem value={role?._id} key={role?._id}>
              {role?.name}
            </MenuItem>
          ))}
        </TextField>
        <Button id="button-primary" type="submit" variant="contained">
          Cadastrar
        </Button>
      </form>
    </Permission>
  );
}

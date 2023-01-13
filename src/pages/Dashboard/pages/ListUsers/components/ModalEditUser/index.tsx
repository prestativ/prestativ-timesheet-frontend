import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { getRoles } from "services/roles.service";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Roles } from "interfaces/roles.interface";
import { updateUser } from "services/auth.service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ModalEditUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: string;
}

export function ModalEditUser({
  isOpen,
  setIsOpen,
  currentUser,
}: ModalEditUserProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({ name, surname, email, password, role }: UserRegister) =>
      updateUser(currentUser, { name, surname, email, password, role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { data } = useQuery(["roles"], getRoles);
  const { register, reset, handleSubmit } = useForm<UserRegister>({});

  const onSubmit = handleSubmit(({ name, surname, email, password, role }) => {
    mutate({ name, surname, email, password, role });
    reset();
  });

  return (
    <div>
      <Modal open={isOpen} onClose={() => setIsOpen((prevState) => !prevState)}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar usuário</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              label="Nome"
              color="warning"
              sx={{ width: "100%" }}
              {...register("name")}
            />
            <TextField
              color="warning"
              label="Sobrenome"
              sx={{ width: "100%" }}
              {...register("surname")}
            />
            <TextField
              color="warning"
              label="Email"
              sx={{ width: "100%" }}
              {...register("email")}
            />
            <TextField
              color="warning"
              {...register("password")}
              label="Senha"
              sx={{ width: "100%" }}
            />

            <Select
              {...register("role")}
              labelId="select-label-helper"
              label="Permissão"
              defaultValue="Consultor"
              color="warning"
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {data?.data.map((role: Roles) => (
                <MenuItem value={role?.name} key={role?.name}>
                  {role?.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              sx={{ paddingBlock: "1rem" }}
              variant="contained"
              color="warning"
              type="submit"
            >
              Concluído
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

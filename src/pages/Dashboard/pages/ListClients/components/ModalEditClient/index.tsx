import { useEffect } from "react";
import { useCep } from "cep-hook";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Dialog,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserByRole } from "services/auth.service";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { updateClient } from "services/clients.service";

interface ModalEditUserProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentClient: string;
}

export function ModalEditClient({
  isOpen,
  setIsOpen,
  currentClient,
}: ModalEditUserProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({
      code,
      name,
      cnpj,
      cep,
      street,
      city,
      state,
      district,
      streetNumber,
      complement,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      valueClient,
      gpClient,
    }: Clients) =>
      updateClient(currentClient, {
        code,
        name,
        cnpj,
        cep,
        street,
        streetNumber,
        complement,
        district,
        city,
        state,
        periodIn,
        periodUntil,
        billingLimit,
        payDay,
        valueClient,
        gpClient,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["clients"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("Gerente de Projetos")
  );
  const {
    register,
    reset,
    handleSubmit,
    setValue: setValueForm,
  } = useForm<Clients>({});

  const [value, setValue, getZip] = useCep("");

  useEffect(() => {
    getZip().then((res) => {
      setValueForm("street", `${res.logradouro}`);
      setValueForm("city", `${res.localidade}`);
      setValueForm("state", `${res.uf}`);
      setValueForm("district", `${res.bairro}`);
    });
  }, [value]);

  const onSubmit = handleSubmit(
    ({
      code,
      name,
      cnpj,
      cep,
      street,
      city,
      state,
      district,
      streetNumber,
      complement,
      periodIn,
      periodUntil,
      billingLimit,
      payDay,
      valueClient,
      gpClient,
    }) => {
      mutate({
        code,
        name,
        cnpj,
        cep,
        street,
        city,
        state,
        district,
        streetNumber,
        complement,
        periodIn,
        periodUntil,
        billingLimit,
        payDay,
        valueClient,
        gpClient,
      });
      reset();
    }
  );

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar cliente</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <TextField
              required
              color="warning"
              label="Código do cliente"
              type="text"
              {...register("code")}
            />
            <TextField
              required
              color="warning"
              label="Nome / Razão Social"
              type="text"
              {...register("name")}
            />
            <TextField
              required
              color="warning"
              label="CNPJ"
              type="text"
              {...register("cnpj")}
            />
            <p>Endereço do cliente</p>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="CEP"
                type="text"
                {...register("cep")}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Logradouro"
                type="text"
                {...register("street")}
              />
            </div>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Cidade"
                type="text"
                {...register("city")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Estado"
                type="text"
                {...register("state")}
              />
            </div>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Bairro"
                type="text"
                {...register("district")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Número"
                type="text"
                {...register("streetNumber")}
              />
              <TextField
                color="warning"
                sx={{ width: "100%" }}
                label="Complemento"
                type="text"
                {...register("complement")}
              />
            </div>
            <p>Período de faturamento</p>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="De"
                type="text"
                {...register("periodIn")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Até"
                type="text"
                {...register("periodUntil")}
              />
            </div>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Dia limite de faturamento"
                type="text"
                {...register("billingLimit")}
              />
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Dia de pagamento"
                type="text"
                {...register("payDay")}
              />
            </div>
            <p>Valor e Gerente de Projetos</p>
            <div className="c-register-client--input-container">
              <TextField
                required
                color="warning"
                sx={{ width: "100%" }}
                label="Valor"
                type="text"
                {...register("valueClient")}
              />
              <Select
                required
                labelId="select-label-helper"
                label="Gerente de Projetos"
                color="warning"
                sx={{ width: "100%" }}
                {...register("gpClient")}
              >
                <MenuItem value="">Selecione uma opção</MenuItem>
                {listGps?.data.map(
                  ({ name, surname }: UserRegister, index: number) => (
                    <MenuItem value={`${name} ${surname}`} key={index}>
                      {`${name} ${surname}`}
                    </MenuItem>
                  )
                )}
              </Select>
            </div>

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
      </Dialog>
    </div>
  );
}
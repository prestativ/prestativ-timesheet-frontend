import { Button, CircularProgress, MenuItem, TextField } from "@mui/material";
import FormLabel from "@mui/material/FormLabel/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import cep from "cep-promise";
import { Modal } from "components/ModalGeneral";
import { Permission } from "components/Permission";
import { Clients } from "interfaces/clients.interface";
import { UserRegister } from "interfaces/users.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserByRole } from "services/auth.service";
import { createClients } from "services/clients.service";
import { cepMask, cnpjMask, currencyMask } from "utils/masks";
import { validateCNPJ } from "utils/validator";

interface ModalRegisterClientProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function ModalRegisterClient({
  isOpen,
  setIsOpen,
}: ModalRegisterClientProps) {
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [valueCep, setValueCep] = useState("");
  const [gpClient, setGpClient] = useState<string[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<Clients>({});
  const { data } = useQuery(["users-role", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  useEffect(() => {
    if (valueCep && valueCep.length >= 8) {
      cep(valueCep).then(({ street, city, state, neighborhood }) => {
        setValue("street", street);
        setValue("city", city);
        setValue("state", state);
        setValue("district", neighborhood);
      });
    }
  }, [valueCep]);

  const [values, setValues] = useState({ cnpj: "" });

  const inputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const { mutate, isLoading } = useMutation(
    ({
      corporateName,
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
      gpClient,
    }: Clients) =>
      createClients({
        corporateName,
        name: name.trim(),
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
        valueClient: priceNumber,
        gpClient,
      }),
    {
      onSuccess: () => {
        reset();
        setValueCep("");
        setValues({ cnpj: "" });
        setPrice("");
        setGpClient([]);
        toast.success("Cadastro de cliente efetuado com sucesso!");
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao criar o cliente", {
          autoClose: 1500,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      corporateName,
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
      gpClient,
    }) => {
      // Validates CNPJ
      if (!validateCNPJ(cnpj)) {
        return toast.error("O CNPJ digitado ?? inv??lido", { autoClose: 1500 });
      }
      mutate({
        corporateName,
        name: name.trim(),
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
        valueClient: priceNumber,
        gpClient,
      });
    }
  );

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  const multipleSelectGPChange = (
    event: SelectChangeEvent<typeof gpClient>
  ) => {
    setGpClient(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Cadastrar novo cliente">
      <Permission roles={["CADASTRO_CLIENTE"]}>
        <form className="c-register-client" onSubmit={onSubmit}>
          <p>Informa????es gerais</p>
          <TextField
            required
            color="warning"
            label="Raz??o Social"
            type="text"
            {...register("corporateName")}
          />
          <TextField
            required
            color="warning"
            label="Nome Fantasia"
            type="text"
            {...register("name")}
          />
          <TextField
            required
            color="warning"
            label="CNPJ"
            type="text"
            value={cnpjMask(values.cnpj)}
            {...register("cnpj")}
            onChange={inputChange}
          />
          <p>Endere??o do cliente</p>
          <div className="c-register-client--input-container">
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="CEP"
              type="text"
              {...register("cep")}
              value={cepMask(valueCep)}
              onChange={(event) => setValueCep(event.target.value)}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              label="Cidade"
              type="text"
              {...register("city")}
            />
            <TextField
              required
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              label="Bairro"
              type="text"
              {...register("district")}
            />
            <TextField
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="N??mero"
              type="text"
              {...register("streetNumber")}
            />
            <TextField
              color="warning"
              sx={{ width: "100%" }}
              InputLabelProps={{ shrink: true }}
              label="Complemento"
              type="text"
              {...register("complement")}
            />
          </div>
          <p>Per??odo de faturamento</p>
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
              label="At??"
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
              value={price && currencyMask(price)}
              {...register("valueClient")}
              onChange={(event) => setNewPrice(event)}
            />
          </div>
          <div className="c-register-activity--input-container">
            <FormLabel
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              }}
            >
              Gerentes De Projetos (Selecione no m??nimo uma op????o)
              <Select
                color="warning"
                variant="outlined"
                {...register("gpClient")}
                sx={{ width: "100%" }} // maxWidth: "14rem"
                value={gpClient}
                onChange={multipleSelectGPChange}
                multiple
              >
                <MenuItem value="" disabled>
                  Selecione no m??nimo uma op????o
                </MenuItem>
                {data?.data.map(({ name, surname, _id }: UserRegister) => (
                  <MenuItem value={_id} key={_id}>
                    {`${name} ${surname}`}
                  </MenuItem>
                ))}
              </Select>
            </FormLabel>
          </div>
          <Button
            type="submit"
            id="button-primary"
            disabled={isLoading}
            variant="contained"
          >
            {isLoading && <CircularProgress size={16} />}
            {!isLoading && "Cadastrar"}
          </Button>
        </form>
      </Permission>
    </Modal>
  );
}

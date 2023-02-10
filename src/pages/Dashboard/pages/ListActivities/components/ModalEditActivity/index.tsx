import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateActivity, getActivityById } from "services/activities.service";
import { Activities } from "interfaces/activities.interface";
import { getUserByRole } from "services/auth.service";
import { getProjects } from "services/project.service";
import { ProjectsInfo } from "interfaces/projects.interface";
import Dialog from "@mui/material/Dialog";
import { Permission } from "components/Permission";
import FormLabel from "@mui/material/FormLabel";
import { SwitchIOS } from "components/SwitchIOS";

interface ModalEditActivityProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentActivity: string;
}

export function ModalEditActivity({
  isOpen,
  setIsOpen,
  currentActivity,
}: ModalEditActivityProps) {
  const { data: singleActivity } = useQuery(
    ["activity", currentActivity],
    () => getActivityById(currentActivity),
    {
      onSuccess: ({ data }) => {
        reset(data.activity);
      },
    }
  );
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ({
      title,
      project,
      description,
      gpActivity,
      users,
      closedScope,
      valueActivity,
    }: Activities) =>
      updateActivity(currentActivity, {
        title,
        project,
        description,
        gpActivity,
        users,
        closedScope,
        valueActivity,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activities"]);
        setIsOpen((prevState) => !prevState);
      },
    }
  );
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  function findGpId() {
    return listGps?.data[0]._id;
  }

  const { data: consultantList } = useQuery(["users-gp", "Consultor"], () =>
    getUserByRole("consultor")
  );
  const { data: projectList } = useQuery(["projects"], getProjects);
  const { register, reset, handleSubmit } = useForm<Activities>({
    defaultValues: singleActivity?.data.activity,
  });

  const onSubmit = handleSubmit(
    ({
      title,
      project,
      description,
      gpActivity,
      users,
      valueActivity,
      closedScope,
    }) => {
      mutate({
        title,
        project,
        description,
        gpActivity,
        users,
        valueActivity,
        closedScope,
      });
      reset();
    }
  );

  const multipleSelectChange = (
    event: SelectChangeEvent<typeof multipleSelect>
  ) => {
    setMultipleSelect(
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <Permission roles={["EDITAR_ATIVIDADE"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ minWidth: 400, p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar atividade</Typography>
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
              label="Nome da atividade"
              InputLabelProps={{ shrink: true }}
              type="text"
              {...register("title")}
            />
            <TextField
              color="warning"
              select
              {...register("project")}
              required
              label="Projeto"
              defaultValue=""
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {projectList?.data.map(
                ({ title, _id, idClient }: ProjectsInfo) => (
                  <MenuItem key={_id} value={_id}>
                    {`${title} (Cliente: ${idClient.name})`}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              color="warning"
              label="Valor da atividade"
              type="number"
              InputLabelProps={{ shrink: true }}
              {...register("valueActivity")}
            />
            <TextField
              required
              color="warning"
              label="Observação"
              type="text"
              InputLabelProps={{ shrink: true }}
              {...register("description")}
            />
            <div className="c-register-activity--input-container">
              <FormLabel
                sx={{
                  width: "100%",
                  display: "none",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Gerente-Projetos
                <TextField
                  color="warning"
                  select
                  {...register("gpActivity")}
                  sx={{ width: "100%", display: "none" }}
                  defaultValue={() => findGpId()}
                >
                  <MenuItem value="">Selecione uma opção</MenuItem>
                  {listGps?.data.map(
                    ({ name, surname, _id }: UserRegister, index: number) => (
                      <MenuItem key={index} value={_id}>
                        {`${name} ${surname}`}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </FormLabel>

              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Consultores
                <Select
                  color="warning"
                  labelId="select-label-helper"
                  {...register("users")}
                  sx={{ width: "100%" }}
                  value={multipleSelect}
                  onChange={multipleSelectChange}
                  multiple
                  required
                >
                  <MenuItem value="">Selecione uma opção</MenuItem>
                  {consultantList?.data.map(
                    ({ name, surname }: UserRegister, index: number) => (
                      <MenuItem key={index} value={`${name} ${surname}`}>
                        {`${name} ${surname}`}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormLabel>
              <FormLabel
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Escopo-Fechado
                <SwitchIOS
                  // value={fieldClosedScope}
                  {...register("closedScope")}
                  // onChange={() => setFieldClosedScope(!fieldClosedScope)}
                />
              </FormLabel>
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
                Validade da Atividade
                <TextField
                  sx={{ width: "100%", gap: "0.2rem" }}
                  type="date"
                  color="warning"
                  variant="outlined"
                  required
                  // value={}
                  {...register("activityValidity")}
                  // onChange={}
                />
              </FormLabel>
              <FormLabel
                sx={{
                  gap: "0.2rem",
                  width: "100%",
                }}
              >
                Habilitar/Desabilitar
                <div className="c-register-activity--input-container">
                  <TextField
                    type="time"
                    color="warning"
                    variant="outlined"
                    required
                    // {...register("activityValidity")}
                  />
                  <SwitchIOS
                    // value={habilitar/desabilitar}
                    {...register("closedScope")}
                    // onChange={() => habilitar/desabilitar}
                  />
                </div>
              </FormLabel>
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
    </Permission>
  );
}

import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UserRegister } from "interfaces/users.interface";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateActivity, getActivityById } from "services/activities.service";
import { RegisterActivity } from "interfaces/activities.interface";
import { getUserByRole } from "services/auth.service";
import { getProjects } from "services/project.service";
import { ProjectsInfo } from "interfaces/projects.interface";
import Dialog from "@mui/material/Dialog";
import { Permission } from "components/Permission";
import FormLabel from "@mui/material/FormLabel";
import { SwitchIOS } from "components/SwitchIOS";
import { toast } from "react-toastify";
import {
  generateTimeAndDateWithTimestamp,
  generateTimestampWithDateAndTime,
} from "utils/timeControl";
import { UserInfo } from "interfaces/users.interface";
import { currencyMask } from "utils/masks";
import { getBusiness } from "services/business.service";
import { BusinessUnitModals } from "interfaces/business.interface";

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
  useQuery(
    ["activity", currentActivity],
    () => getActivityById(currentActivity),
    {
      onSuccess: ({ data }) => {
        reset(data.activity);
        const timestampFormated = generateTimeAndDateWithTimestamp(
          data.activity.activityValidity
        );
        setDateField(timestampFormated[0]);
        setTimeField(timestampFormated[1]);
        const consultants: string[] =
          data.activity.users &&
          data.activity.users.map((element: UserInfo) => {
            return element._id;
          });
        const gps: string[] =
          data.activity.gpActivity &&
          data.activity.gpActivity.map((element: UserInfo) => {
            return element._id;
          });
        setGpActivity(gps);
        setMultipleSelect(consultants);
        setProject(data.activity.project._id);
        setPrice(`${data.activity.valueActivity}`);
        setFieldClosedScope(data.activity.closedScope);
        setIdBusinessUnit(
          data.activity.businessUnit ? data.activity.businessUnit._id : ""
        );
      },
    }
  );
  const [fieldClosedScope, setFieldClosedScope] = useState(false);
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState(0);
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const [project, setProject] = useState("");
  const [dateField, setDateField] = useState("");
  const [timeField, setTimeField] = useState("");
  const [gpActivity, setGpActivity] = useState<string[]>([]);
  const [idBusinessUnit, setIdBusinessUnit] = useState("");
  const queryClient = useQueryClient();

  const setNewPrice = (e: { target: { value: string } }) => {
    const stringValue = e.target.value;
    const stringValueWithoutDots = stringValue.replaceAll(".", "");
    setPrice(stringValueWithoutDots);
    setPriceNumber(Number(stringValueWithoutDots.slice(2)));
  };

  const { mutate, isLoading } = useMutation(
    ({ title, project, description, users }: RegisterActivity) =>
      updateActivity(currentActivity, {
        title: title.trim(),
        project,
        description,
        gpActivity: gpActivity,
        businessUnit: idBusinessUnit,
        users,
        closedScope: fieldClosedScope,
        valueActivity: priceNumber,
        activityValidity: generateTimestampWithDateAndTime(
          dateField,
          timeField
        ),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["activities"]);
        setIsOpen((prevState) => !prevState);
        toast.success("Atividade foi atualizada com sucesso!");
      },
      onError: () => {
        toast.error("Ocorreu algum erro ao editar esta atividade!", {
          autoClose: 1500,
        });
      },
    }
  );
  const { data: listGps } = useQuery(["users-gp", "Gerente de Projetos"], () =>
    getUserByRole("gerenteprojetos")
  );

  const { data: consultantList } = useQuery(["users-gp", "Consultor"], () =>
    getUserByRole("consultor")
  );
  const { data: projectList } = useQuery(["projects"], getProjects);
  const { register, reset, handleSubmit } = useForm();

  const { data: businessUnitList } = useQuery(["business"], () =>
    getBusiness()
  );

  const onSubmit = handleSubmit(
    ({ title, description, users, valueActivity, closedScope }) => {
      mutate({
        title: title.trim(),
        project,
        description,
        gpActivity: gpActivity,
        businessUnit: idBusinessUnit,
        users,
        valueActivity,
        closedScope,
      });
      reset();
      setGpActivity([]);
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

  const multipleSelectGPChange = (
    event: SelectChangeEvent<typeof gpActivity>
  ) => {
    setGpActivity(
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
              required
              label="Projeto"
              value={project}
              onChange={(event) => setProject(event.target.value)}
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
              InputLabelProps={{ shrink: true }}
              value={price && currencyMask(price)}
              onChange={(event) => setNewPrice(event)}
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Gerentes De Projetos (Selecione no mínimo uma opção)
                <Select
                  color="warning"
                  variant="outlined"
                  {...register("gpActivity")}
                  sx={{ width: "100%" }} // maxWidth: "14rem"
                  value={gpActivity}
                  onChange={multipleSelectGPChange}
                  multiple
                >
                  <MenuItem value="" disabled>
                    Selecione no mínimo uma opção
                  </MenuItem>
                  {listGps?.data.map(({ name, surname, _id }: UserRegister) => (
                    <MenuItem key={_id} value={_id}>
                      {`${name} ${surname}`}
                    </MenuItem>
                  ))}
                </Select>
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
                Consultores
                <Select
                  color="warning"
                  labelId="select-label-helper"
                  {...register("users")}
                  sx={{ width: "100%", maxWidth: "200px" }}
                  value={multipleSelect}
                  onChange={multipleSelectChange}
                  multiple
                  required
                >
                  <MenuItem value="">Selecione uma opção</MenuItem>
                  {consultantList?.data.map(
                    ({ name, surname, _id }: UserRegister) => (
                      <MenuItem key={_id} value={_id}>
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
                  checked={fieldClosedScope}
                  {...register("closedScope")}
                  onChange={() =>
                    setFieldClosedScope((prevState) => !prevState)
                  }
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
                Business Unit
                <Select
                  color="warning"
                  variant="outlined"
                  sx={{ width: "100%" }} // maxWidth: "14rem"
                  value={idBusinessUnit}
                  onChange={(event) => setIdBusinessUnit(event.target.value)}
                >
                  <MenuItem value="" disabled>
                    Selecione uma opção (campo opicional)
                  </MenuItem>
                  <MenuItem value="">
                    <p>Nenhum B.U.</p>
                  </MenuItem>
                  {businessUnitList?.data.map(
                    ({ _id, nameBU }: BusinessUnitModals) => (
                      <MenuItem key={_id} value={_id}>
                        {nameBU}
                      </MenuItem>
                    )
                  )}
                </Select>
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
                  value={dateField}
                  onChange={(event) => setDateField(event.target.value)}
                />
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  value={timeField}
                  onChange={(event) => setTimeField(event.target.value)}
                />
              </FormLabel>
            </div>

            <Button
              sx={{ paddingBlock: "1rem" }}
              variant="contained"
              color="warning"
              type="submit"
            >
              {isLoading && <CircularProgress size={16} />}
              {!isLoading && "Concluído"}
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}

import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  Box,
  TextField,
  Typography,
  MenuItem,
  FormLabel,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ClientsInfo } from "interfaces/clients.interface";
import { ProjectsInfo } from "interfaces/projects.interface";
import { ActivitiesInfo } from "interfaces/activities.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "services/clients.service";
import { getHoursById, updateHours } from "services/hours.service";
import { Permission } from "components/Permission";
import {
  generateDateWithTimestamp,
  generateTimeWithTimestamp,
  convertDate,
  generateTimestampWithDateAndTime,
} from "utils/timeControl";
import { UpdateHoursProps } from "interfaces/hours.interface";
import { toast } from "react-toastify";
import { useAuthStore } from "stores/userStore";

interface ModalEditHoursProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentHour: string;
}

interface FormData {
  initialDate: string;
  adjustment: number;
  initialHour: string;
  finalHour: string;
  activityDesc: string;
  releasedCall: string;
}

export function ModalEditHours({
  isOpen,
  setIsOpen,
  currentHour,
}: ModalEditHoursProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const { register, handleSubmit, setValue } = useForm<FormData>();

  // Get current hour data
  useQuery(["hours", currentHour], () => getHoursById(currentHour), {
    onSuccess({ data }) {
      setValue(
        "initialDate",
        convertDate(generateDateWithTimestamp(data?.hours?.initial))
      );

      setValue("initialHour", generateTimeWithTimestamp(data?.hours?.initial));
      setValue("finalHour", generateTimeWithTimestamp(data?.hours?.final));
      data?.hours?.adjustment !== 0 &&
        setValue(
          "adjustment",
          Number(generateTimeWithTimestamp(data?.hours?.adjustment))
        );
      setValue("activityDesc", data?.hours?.activityDesc);
      setValue("releasedCall", data?.hours?.releasedCall);
      setSelectedClient(data.hours.relClient._id);
      setSelectedProject(data.hours.relProject._id);
      setSelectedActivity(data.hours.relActivity._id);
    },
    enabled: isOpen,
    staleTime: 5000000,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(
    ({
      initial,
      final,
      adjustment,
      relClient,
      relProject,
      relActivity,
      relUser,
      releasedCall,
      activityDesc,
    }: UpdateHoursProps) =>
      updateHours(currentHour, {
        initial,
        final,
        adjustment,
        relClient,
        relProject,
        relActivity,
        relUser,
        releasedCall,
        activityDesc,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["hours"]);
        setIsOpen((prevState) => !prevState);
      },
      onError: () => {
        toast.error("Ocorreu um erro ao atualizar as horas.", {
          autoClose: 1000,
        });
      },
    }
  );

  const onSubmit = handleSubmit(
    ({
      activityDesc,
      adjustment,
      finalHour,
      initialDate,
      initialHour,
      releasedCall,
    }) => {
      const initial = generateTimestampWithDateAndTime(
        initialDate,
        initialHour
      );
      const final = generateTimestampWithDateAndTime(initialDate, finalHour);
      if (initial > final) {
        toast.error("A hora final não pode ser anterior a hora inicial!");
        return;
      }
      const maxDaysCanRelease = 4; // Periodo máximo para lançar horas - editando essa variável, o sistema irá permitir que datas mais antigas sejam possiveis lançar
      const daysInMiliseconds = maxDaysCanRelease * 1000 * 60 * 60 * 24;
      const today = Date.now();
      if (initial > today + daysInMiliseconds / maxDaysCanRelease) {
        toast.error("A data informada ainda não está disponível para lançar");
        return;
      }
      if (initial < today - daysInMiliseconds) {
        toast.error("A data informada é muito antiga");
        return;
      }
      mutate({
        initial,
        final,
        activityDesc,
        adjustment,
        relActivity: selectedActivity,
        relClient: selectedClient,
        relProject: selectedProject,
        releasedCall,
        relUser: user._id,
      });
    }
  );

  // Requests inputs
  const { data: clients } = useQuery(["clients"], () => getClients());

  return (
    <Permission roles={["EDITAR_HORAS"]}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen((prevState) => !prevState)}
      >
        <Box sx={{ padding: 4, minWidth: 420 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontSize="1.3rem">Editar horas</Typography>
            <Close
              fontSize="large"
              sx={{ cursor: "pointer" }}
              onClick={() => setIsOpen((prevState) => !prevState)}
            />
          </Box>
          <form className="c-form-spacing" onSubmit={onSubmit}>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Data
                <TextField
                  type="date"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("initialDate")}
                />
              </FormLabel>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Ajuste
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  {...register("adjustment")}
                />
              </FormLabel>
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Hora inicial
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("initialHour")}
                />
              </FormLabel>
              <FormLabel
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                Hora final
                <TextField
                  type="time"
                  color="warning"
                  variant="outlined"
                  required
                  {...register("finalHour")}
                />
              </FormLabel>
            </Box>

            <Box sx={{ display: "flex", gap: "1rem" }}>
              <TextField
                required
                color="warning"
                variant="outlined"
                label="Cliente"
                select
                value={selectedClient}
                InputLabelProps={{ shrink: true }}
                sx={{ width: "100%" }}
                onChange={(event) => setSelectedClient(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção
                </MenuItem>
                {clients?.data.map(({ name, _id }: ClientsInfo) => (
                  <MenuItem key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                color="warning"
                variant="outlined"
                label="Projeto"
                InputLabelProps={{ shrink: true }}
                select
                value={selectedProject}
                sx={{ width: "100%" }}
                onChange={(event) => setSelectedProject(event.target.value)}
              >
                <MenuItem value="" disabled>
                  Selecione uma opção
                </MenuItem>
                {clients?.data
                  .find((client: ClientsInfo) => client._id === selectedClient)
                  ?.projects.map(({ _id, title }: ProjectsInfo) => (
                    <MenuItem key={_id} value={_id}>
                      {title}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <TextField
              required
              color="warning"
              variant="outlined"
              label="Atividade"
              InputLabelProps={{ shrink: true }}
              value={selectedActivity}
              select
              onChange={(event) => setSelectedActivity(event.target.value)}
            >
              <MenuItem value="" disabled>
                Selecione uma opção
              </MenuItem>
              {clients?.data
                .find((client: ClientsInfo) => client._id === selectedClient)
                ?.projects.find(
                  (project: ProjectsInfo) => project._id === selectedProject
                )
                ?.activities.map(({ _id, title }: ActivitiesInfo) => (
                  <MenuItem key={_id} value={_id}>
                    {title}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              required
              color="warning"
              multiline
              rows={4}
              variant="outlined"
              label="Descrição da Atividade"
              InputLabelProps={{ shrink: true }}
              {...register("activityDesc")}
            />
            <TextField
              color="warning"
              multiline
              rows={4}
              variant="outlined"
              label="Chamado Lançado"
              InputLabelProps={{ shrink: true }}
              {...register("releasedCall")}
            />
            <Button
              variant="contained"
              color="warning"
              type="submit"
              sx={{ paddingBlock: "1rem" }}
            >
              Concluído
            </Button>
          </form>
        </Box>
      </Dialog>
    </Permission>
  );
}

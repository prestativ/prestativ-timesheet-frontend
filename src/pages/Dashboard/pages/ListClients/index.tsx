import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "services/clients.service";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ClientsInfo } from "interfaces/clients.interface";
import { EmptyList } from "components/EmptyList";
import { ModalEditClient } from "./components/ModalEditClient";
import { formatCurrency } from "utils/formatCurrency";
import { StyledTableCell } from "components/StyledTableCell";
import { StyledTableRow } from "components/StyledTableRow";
import { Permission } from "components/Permission";
import { ModalRegisterClient } from "./components/ModalRegisterClient";
import { ModalDeleteClient } from "./components/ModalDeleteClient";
import Chip from "@mui/material/Chip";

export function ListClients() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [currentClient, setCurrentClient] = useState("");
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const { data: clients, isLoading } = useQuery(
    [
      "clients",
      currentClient,
      isAddingClient,
      isEditingClient,
      isDeletingClient,
    ],
    () => getClients()
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBlock: "1.3rem" }}>
          Clientes
        </Typography>

        <Permission roles={["CADASTRO_CLIENTE"]}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsAddingClient((prevState) => !prevState)}
          >
            Cadastrar cliente
          </Button>
        </Permission>
      </Box>
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBlock: "4rem",
          }}
        >
          <CircularProgress color="warning" />
        </Box>
      ) : (
        <>
          {clients?.data.length ? (
            <div>
              <Paper>
                <div className="c-table">
                  <div className="c-table--helper">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow className="c-table--reset-head">
                          <StyledTableCell align="center">
                            Raz??o Social
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Nome Fantasia
                          </StyledTableCell>
                          <StyledTableCell align="center">CNPJ</StyledTableCell>
                          <StyledTableCell align="center">
                            Endere??o
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Per??odo Faturado
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Limite de Cobran??a + Dia de Pagamento
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Valor
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Gerente de Projetos
                          </StyledTableCell>
                          <Permission
                            roles={["EDITAR_CLIENTE" || "DELETAR_CLIENTE"]}
                          >
                            <StyledTableCell align="center">
                              Controles
                            </StyledTableCell>
                          </Permission>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients?.data.map(
                          ({
                            _id,
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
                            valueClient,
                            gpClient,
                          }: ClientsInfo) => (
                            <StyledTableRow key={_id}>
                              <StyledTableCell align="center">
                                {corporateName}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {name}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {cnpj}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`${cep} ${street} ${streetNumber} ${complement} Bairro ${district} ${city} ${state}`}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`De: ${periodIn} At??: ${periodUntil}`}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {`${billingLimit} / ${payDay}`}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {formatCurrency(valueClient)}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {gpClient.length ? (
                                  gpClient.map(({ name, surname }) => (
                                    <Chip
                                      key={name}
                                      label={`${name} ${surname}`}
                                      sx={{ margin: "0.25rem" }}
                                    />
                                  ))
                                ) : (
                                  <p>Nenhum usu??rio foi vinculado</p>
                                )}
                              </StyledTableCell>
                              <Permission
                                roles={["EDITAR_CLIENTE" || "DELETAR_CLIENTE"]}
                              >
                                <StyledTableCell
                                  sx={{
                                    display: "grid",
                                    gap: "20px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                  }}
                                  align="center"
                                >
                                  <Permission roles={["EDITAR_CLIENTE"]}>
                                    <EditIcon
                                      onClick={() => {
                                        setCurrentClient(_id);
                                        setIsEditingClient(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                  <Permission roles={["DELETAR_CLIENTE"]}>
                                    <DeleteIcon
                                      onClick={() => {
                                        setCurrentClient(_id);
                                        setIsDeletingClient(
                                          (prevState) => !prevState
                                        );
                                      }}
                                    />
                                  </Permission>
                                </StyledTableCell>
                              </Permission>
                            </StyledTableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Paper>
            </div>
          ) : (
            <EmptyList />
          )}
          <Permission roles={["EDITAR_CLIENTE"]}>
            <ModalEditClient
              isOpen={isEditingClient}
              setIsOpen={setIsEditingClient}
              currentClient={currentClient}
            />
          </Permission>
          <Permission roles={["CADASTRO_CLIENTE"]}>
            <ModalRegisterClient
              isOpen={isAddingClient}
              setIsOpen={setIsAddingClient}
            />
          </Permission>
          <Permission roles={["DELETAR_CLIENTE"]}>
            <ModalDeleteClient
              isOpen={isDeletingClient}
              setIsOpen={setIsDeletingClient}
              currentClient={currentClient}
            />
          </Permission>
        </>
      )}
    </div>
  );
}

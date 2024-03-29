import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./privateRoutes";

// Pages imports
import { LoginPage } from "pages/LoginPage";
import { ForgotPassword } from "pages/ForgotPassword";
import { NewPassword } from "pages/NewPassword";
import { Dashboard } from "pages/Dashboard";
import { Timesheet } from "pages/Dashboard/pages/Timesheet";
import { ListClients } from "pages/Dashboard/pages/ListClients";
import { ListProjects } from "pages/Dashboard/pages/ListProjects";
import { ListActivities } from "pages/Dashboard/pages/ListActivities";
import { ListUsers } from "pages/Dashboard/pages/ListUsers";
import { DashboardView } from "pages/Dashboard/pages/DashboardView";
import { ListLogs } from "pages/Dashboard/pages/ListLogs";
import { ListBusinessUnit } from "pages/Dashboard/pages/ListBusinessUnit";

// Context
import { UserProfiles } from "pages/Dashboard/pages/UserProfiles";
import { SettingsAdmin } from "pages/Dashboard/pages/SettingsAdmin";
import { Permission } from "components/Permission";
import { Page404 } from "pages/Page404";
import { AccessDenied } from "pages/AccessDenied";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/newpass" element={<NewPassword />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route
              path="timesheet"
              element={
                <Permission roles={["TIMESHEET"]}>
                  <Timesheet />
                </Permission>
              }
            />
            <Route
              path="clients"
              element={
                <Permission roles={["VER_CLIENTES"]}>
                  <ListClients />
                </Permission>
              }
            />
            <Route
              path="projects"
              element={
                <Permission roles={["VER_PROJETOS"]}>
                  <ListProjects />
                </Permission>
              }
            />
            <Route
              path="activities"
              element={
                <Permission roles={["VER_ATIVIDADES"]}>
                  <ListActivities />
                </Permission>
              }
            />
            <Route
              path="users"
              element={
                <Permission roles={["VER_ATIVIDADES"]}>
                  <ListUsers />
                </Permission>
              }
            />
            <Route
              path="logs"
              element={
                <Permission roles={["VER_LOGS"]}>
                  <ListLogs />
                </Permission>
              }
            />
            <Route
              path="business"
              element={
                <Permission roles={["VER_BUS"]}>
                  <ListBusinessUnit />
                </Permission>
              }
            />
            <Route
              path="profiles"
              element={
                <Permission roles={["PERFIS_USUARIO"]}>
                  <UserProfiles />
                </Permission>
              }
            />
            <Route
              path="settings"
              element={
                <Permission roles={["CONFIGURACOES"]}>
                  <SettingsAdmin />
                </Permission>
              }
            />
            <Route
              path="dashboard"
              element={
                <Permission roles={["DASHBOARD"]}>
                  <DashboardView />
                </Permission>
              }
            />
          </Route>
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

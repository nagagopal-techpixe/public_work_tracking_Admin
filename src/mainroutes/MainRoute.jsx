import React from "react";
import Login from "../pages/authentication/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Layout from "../components/outlet/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Setting from "../pages/setting/Setting";
import ResetPassword from "../pages/authentication/ResetPassword";
import Constituencies from "../pages/constituencies/Constituencies";
import AddConstituency from "../pages/constituencies/AddConstituency";
import Mandal from "../pages/Mandal/Mandals"
import Villages from "../pages/village/Villages"
import Habitation from "../pages/Habitations/Habitations"
import Members from "../pages/Members/Members"
import AddMember from "../pages/Members/AddMember"
import Works from "../pages/works/works"
import CreateWork from "../pages/works/CreateNewWork"
import Rules from "../pages/Rules/Rules"
import AddRules from "../pages/Rules/AddRule"
import WorkDetailsPage from "../pages/works/WorkDetailsModal";
const MainRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword/>}/>


        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Setting />} />
          <Route path="constituencies" element={<Constituencies />} />
           <Route path="/constituencies/add-constituencies" element={<AddConstituency />} />
           <Route path="Mandal" element={<Mandal />} />
           <Route path="Village" element={<Villages />} />
           <Route path="Habitation" element={<Habitation />} />
           <Route path="Members" element={<Members />} />
           <Route path="/AddMember/add-AddMember" element={<AddMember />} />
           <Route path="Works" element={<Works />} />
           <Route path="/works/add-works" element={<CreateWork />} />
           <Route path="/rules" element={<Rules />} />
           <Route path="/Rules/add-Rules" element={<AddRules />} />
           <Route path="/admin/works/:id" element={<WorkDetailsPage />} />
           

        </Route>
      </Routes>
    </div>
  );
};

export default MainRoute;

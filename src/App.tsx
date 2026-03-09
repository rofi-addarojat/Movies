/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { Search } from "./pages/Search";
import { Category } from "./pages/Category";
import { Admin } from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="detail/:detailPath" element={<Detail />} />
          <Route path="search" element={<Search />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

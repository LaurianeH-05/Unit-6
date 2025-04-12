import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './components/Dashboard';
import CurrencyDetail from './components/CurrencyDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="currency/:currencyCode" element={<CurrencyDetail />} />
      </Route>
    </Routes>
  );
}
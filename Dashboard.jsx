import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const [currencies, setCurrencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [conversionRates, setConversionRates] = useState([]);
  const [showCharts, setShowCharts] = useState(true);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ratesRes = await axios.get('https://api.frankfurter.app/latest');
        const historyRes = await axios.get('https://api.frankfurter.app/2023-01-01..2023-01-07');
        
        const ratesArray = Object.entries(ratesRes.data.rates);
        const historyData = Object.entries(historyRes.data.rates).map(([date, rates]) => ({
          date,
          USD: rates?.USD || 0
        }));
        const conversions = ratesArray.slice(0, 5).map(([code, rate]) => ({
          currency: code,
          rate: parseFloat((1 / rate).toFixed(4))
        }));

        setCurrencies(ratesArray);
        setHistory(historyData);
        setConversionRates(conversions);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const filteredCurrencies = currencies.filter(([code]) => 
    code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Financial Data Dashboard</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search currencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="chart-controls">
        <div className="toggle-group">
          <button 
            className={showCharts ? 'active' : ''}
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? '📉 Hide Charts' : '📈 Show Charts'}
          </button>
          
          {showCharts && (
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
              aria-label="Select chart type"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          )}
        </div>
      </div>

      {showCharts && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3>7-Day Exchange Rate Trend (USD)</h3>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="USD" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="USD" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Top Currency Conversion Rates</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="currency" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="rate" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="data-story">
        <div className="annotation">
          <span className="annotation-icon">📈</span>
          <p>
            The line chart shows historical exchange rates against USD over time. 
            Hover to see specific values and track currency fluctuations.
          </p>
        </div>
        <div className="annotation">
          <span className="annotation-icon">📊</span>
          <p>
            The bar chart compares conversion rates of top currencies. 
            Higher bars indicate stronger currencies relative to USD.
          </p>
        </div>
      </div>

      <div className="currency-grid">
        {filteredCurrencies.map(([code, rate]) => (
          <Link 
            to={`/currency/${code}`} 
            key={code} 
            className="currency-card"
          >
            <div className="currency-header">
              <span className="currency-code">{code}</span>
              <span className="currency-rate">{rate.toFixed(4)}</span>
            </div>
            <div className="currency-meta">
              <span>Base: EUR</span>
              <span>Last 7 days: ▲ 0.5%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
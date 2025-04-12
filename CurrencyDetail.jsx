import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CurrencyDetail() {
  const { currencyCode } = useParams();
  const [currencyData, setCurrencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistorical, setShowHistorical] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ratesRes, historyRes] = await Promise.all([
          axios.get(`https://api.frankfurter.app/latest?from=${currencyCode}`),
          axios.get(`https://api.frankfurter.app/2023-01-01..2023-01-31?from=${currencyCode}`)
        ]);

        // Validate API responses
        if (!ratesRes.data?.rates || !historyRes.data?.rates) {
          throw new Error('Invalid data format from API');
        }

        const topConversions = Object.entries(ratesRes.data.rates)
          .slice(0, 5)
          .map(([code, rate]) => ({
            name: code,
            value: parseFloat(rate.toFixed(4))
          }));

        setCurrencyData({
          currentRate: ratesRes.data.rates.USD || 0,
          historical: Object.entries(historyRes.data.rates),
          conversions: topConversions,
          baseCurrency: ratesRes.data.base,
          lastUpdated: new Date(ratesRes.data.date).toLocaleDateString()
        });
        
      } catch (err) {
        setError(err.message || "Failed to load currency data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currencyCode]);

  const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {currencyCode} data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <Link to="/" className="back-link">← Return to Dashboard</Link>
      </div>
    );
  }

  if (!currencyData) {
    return (
      <div className="error-container">
        <h3>No Data Found</h3>
        <p>Could not find information for {currencyCode}</p>
        <Link to="/" className="back-link">← Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h2>{currencyCode} Currency Details</h2>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>

      <div className="detail-content">
        <div className="stats-card">
          <h3>Current Exchange Rate</h3>
          <p className="rate-value">
            {currencyData.currentRate.toFixed(4)} USD
          </p>
          <div className="meta-info">
            <p>Base Currency: {currencyData.baseCurrency}</p>
            <p>Last Updated: {currencyData.lastUpdated}</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Conversion Rates</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={currencyData.conversions}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {currencyData.conversions.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => value.toFixed(4)}
                contentStyle={{ 
                  background: '#1a1b2f',
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="legend-text">{value}</span>}
              />
            </PieChart>
            <div className="toggle-section">
  <button
    className={`toggle-button ${showHistorical ? 'active' : ''}`}
    onClick={() => setShowHistorical(!showHistorical)}
  >
    {showHistorical ? 'Hide Historical Data' : 'Show Historical Trends'}
  </button>

  {showHistorical && (
    <div className="historical-chart">
      <h3>30-Day Historical Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={currencyData.historical}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="USD" 
            stroke="#6366f1" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
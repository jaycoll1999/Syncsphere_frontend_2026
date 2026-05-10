import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BarChartWidget = ({ data, dataKeys, colors, xKey, title, height = 300 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey={xKey} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index] || '#6366f1'} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartWidget

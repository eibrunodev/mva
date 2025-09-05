import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, Box, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ 
                backgroundColor: 'rgba(37, 37, 37, 0.9)', 
                border: '1px solid #ccc', 
                padding: '10px', 
                borderRadius: '5px' 
            }}>
                <Typography variant="body2" sx={{ color: payload[0].color }}>
                    {`${payload[0].name}: R$${payload[0].value.toFixed(2)} (${payload[0].payload.porcentagem}%)`}
                </Typography>
            </Box>
        );
    }
    return null;
};

export default function GraficoMetas({ data }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (!data || data.length === 0) {
        return <Typography variant="h6" align="center">Nenhum dado para o gráfico.</Typography>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="valor_guardado"
                    nameKey="nome_meta"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({ nome_meta, valor_guardado, porcentagem }) => `${nome_meta}: ${porcentagem}%`}
                    labelLine={false}
                    stroke={isDark ? '#333' : '#fff'}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
}
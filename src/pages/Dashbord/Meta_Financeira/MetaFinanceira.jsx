import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TabelaMetas from '../../../components/metas/Tabela'

export default function MetaFinanceira() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [meta, setMeta] = useState('');
    const [porcentagem, setPorcentagem] = useState(0);

    const [totalMes, setTotalMes] = useState(0);
    const [totalDia, setTotalDia] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dataRegistrar, setDataRegistrar] = useState()

    const handleDataRegistrar = (event) => {
        setDataRegistrar(event.target.value);
    }
    
    const handleMeta = (event) => {
        setMeta(event.target.value);
    };

    const handlePorcentagem = (event) => {
        setPorcentagem(parseFloat(event.target.value) || 0);
    };

    const resetStates = () => {
        setMeta('');
        setPorcentagem(0);
    };

    // Função para calcular os totais do mês e do dia
    async function calcularTotais() {
        setLoading(true);
        const { data, error } = await supabase.from("transacoes").select("*");

        if (error) {
            console.error("Erro ao buscar dados:", error);
            setLoading(false);
            return;
        }

        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const diaAtual = hoje.getDate();

        const transacoesMes = (data || []).filter((valor) => {
            const dataTransacao = new Date(valor.data);
            return (
                dataTransacao.getMonth() === mesAtual &&
                dataTransacao.getFullYear() === anoAtual
            );
        });

        const transacoesDia = transacoesMes.filter((valor) => {
            const dataTransacao = new Date(valor.data);
            return dataTransacao.getDate() === diaAtual;
        });

        const entradasMes = transacoesMes.reduce((sum, valor) => valor.tipo === "Entrada" ? sum + valor.valor : sum, 0);
        const saidasMes = transacoesMes.reduce((sum, valor) => valor.tipo === "Saida" ? sum + valor.valor : sum, 0);
        setTotalMes(entradasMes - saidasMes);

        const entradasDia = transacoesDia.reduce((sum, valor) => valor.tipo === "Entrada" ? sum + valor.valor : sum, 0);
        const saidasDia = transacoesDia.reduce((sum, valor) => valor.tipo === "Saida" ? sum + valor.valor : sum, 0);
        setTotalDia(entradasDia - saidasDia);
        
        setLoading(false);
    }

    useEffect(() => {
        calcularTotais();
    }, []);

    return (
        <Container fixed>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
                <Typography sx={{ fontSize: { xs: "12px", sm: "18px", md: "24px", lg: "35px" } }}>
                    Registre Suas Metas Financeiras
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: "column" }}>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <BorderColorIcon sx={{ fontSize: 40, marginRight: "3px" }} />
                        <TextField
                            variant="outlined"
                            label="Nome da Meta Financeira / Projeto"
                            type="text"
                            value={meta}
                            onChange={handleMeta}
                            sx={{
                                width: '100%',
                                input: { fontSize: "1rem" },
                                "& label": { color: isDark ? "#fff" : "#333" },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#fff" : "#333" },
                                margin: '1rem'
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 40, marginRight: "3px" }} />
                        <TextField
                            variant="outlined"
                            label="Porcentagem % Para A Meta "
                            type="number"
                            value={porcentagem}
                            onChange={handlePorcentagem}
                            sx={{
                                width: '100%',
                                input: { fontSize: "1rem" },
                                "& label": { color: isDark ? "#fff" : "#333" },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#fff" : "#333" },
                                margin: '1rem'
                            }}
                        />
                        <TextField 
                            type="date"
                            sx={{
                                width:'100%',
                                input: { 
                                fontSize: "1rem" 
                                },
                                "& label": { 
                                color: isDark ? "#fff" : "#333" 
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                borderColor: isDark ? "#fff" : "#333",
                                },
                                margin: '1rem'
                            }}
                            variant="outlined"
                            onChange={handleDataRegistrar}
                        />
                    </Box>
                </Box>
                <TabelaMetas
                    valores={{ nome_meta: meta, porcentagem: porcentagem, dataMeta: dataRegistrar}}
                    totalMes={totalMes}
                    totalDia={totalDia}
                    onSuccess={resetStates}
                />
            </Box>
        </Container>
    );
}
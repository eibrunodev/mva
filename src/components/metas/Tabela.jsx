import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, styled, tableCellClasses,
    Skeleton, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField,Box,Typography 
} from "@mui/material";
import Progress from "../progress/Progress";
import GraficoMetas from '../graficos/GraficoMetas'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export default function Tabela({ valores, onSuccess, totalDia }){ 
    const { porcentagem, nome_meta, dataMeta } = valores;
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [progress, setProgress] = useState(false)
    
    const [metas, setMetas] = useState([]);
    const [metasCalculadas, setMetasCalculadas] = useState([]);
    useEffect(() => {
        filtrar();
    }, []);

    // 🔥 recalcula os valores somente quando metas e totais mudarem
    useEffect(() => {
    if (metas.length > 0) {
        const calculadas = metas.map(meta => ({
        ...meta,
        valor_dia: (totalDia * meta.porcentagem) / 100,
        }));
        setMetasCalculadas(calculadas);
    } else {
        setMetasCalculadas([]);
    }
    }, [metas, totalDia]);
    console.log("data de la",dataMeta);
    // transforma a string "YYYY-MM-DD" em Date
    const dataSelecionada = new Date(dataMeta + "T00:00:00"); 
    // ajusta para fuso de Brasília (-3h)
    const dataBrasilia = new Date(dataSelecionada.getTime() - (3 * 60 * 60 * 1000));

    const addMeta = async(e) => {
        e.preventDefault()
        setLoadingButton(true);
        setProgress(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session || !session.user) {
            console.error("Erro de autenticação ou sessão inválida!");
            return;
        }

        const user = session.user;
        
        try {
            setProgress(true);
            const {data, error} = await supabase
                .from("metas")
                .insert([{ nome_meta, 
                    porcentagem, 
                    data_criacao:dataBrasilia.toISOString(), 
                    user_id: user.id 
                }]);
            
            if (error) console.error(error);
            else {
                console.log("Meta adicionada:", data);
                onSuccess()
                filtrar();
            }
        } catch (error) {
            console.error("Algo deu errado", error);
        } finally{
            setLoadingButton(false);
            setProgress(false);
        }
    }
    
    async function filtrar() {
        try {
            const { data, error } = await supabase.from("metas").select("*");

            if (error) {
                console.error("Erro ao buscar dados:", error);
            } else {
                setMetas(data || []);
            }
        } catch (error) {
            console.error("Erro inesperado:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleOpen = (row) => {
        setEditingRow(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRow(null);
    };

    const handleSave = async () => {
        setProgress(true);
        try {
            const { error } = await supabase
                .from("metas")
                .update(editingRow)
                .eq("id", editingRow.id);

            if (error) {
                console.error("Erro ao atualizar:", error);
            } else {
                console.log("Registro atualizado com sucesso!");
                handleClose();
                filtrar();
            }
        } catch (err) {
            console.error("Erro inesperado ao salvar:", err);
        } finally {
            setProgress(false);
        }
    };
    
    const handleDelete = async (id) => {
        alert("deseja apagar?")
        try {
            const { error } = await supabase
                .from("metas")
                .delete()
                .eq("id", id);
            if (error) {
                console.error("Erro ao apagar:", error);
            } else {
                console.log("Registro apagado com sucesso!");
                filtrar();
            }
        } catch (err) {
            console.error("Erro inesperado ao apagar:", err);
        }
    };

    return(
        <>    
            <Button 
                loading={loadingButton}
                variant="contained" 
                onClick={addMeta}
                sx={{margin:'1rem'}}
                disabled={loadingButton}
            >
                Adicionar Meta
            </Button>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}></Box>
                {/* Gráfico de Pizza */}
                <Box sx={{ maxWidth: '600px', mx: 'auto', width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Distribuição das Metas
                    </Typography>
                    <GraficoMetas 
                    data={metas.map(m => ({ 
                        nome_meta: m.nome_meta,
                        porcentagem: m.porcentagem,
                        valor_guardado: (totalDia * m.porcentagem) / 100
                    }))} 
                    />
                </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                                <StyledTableCell>Nome da meta</StyledTableCell>
                                <StyledTableCell>Porcentagem</StyledTableCell>
                                <StyledTableCell>Valor do Dia</StyledTableCell>
                                <StyledTableCell>Data</StyledTableCell>
                                <StyledTableCell>Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Skeleton animation="wave" height={40} />
                                </TableCell>
                            </TableRow>
                        ) : metasCalculadas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Nenhuma meta incluída ainda!
                                </TableCell>
                            </TableRow>
                        ) : (
                            metasCalculadas.map((row) => (
                                <TableRow key={row.id}>
                                        <TableCell>{row.nome_meta}</TableCell>
                                        <TableCell>{row.porcentagem}%</TableCell>
                                        <TableCell>{(row.valor_dia || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>{new Date(row.data_criacao).toLocaleDateString('pt-br')}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" onClick={() => handleOpen(row)} size="small">
                                                Editar
                                            </Button>
                                            <Button onClick={() => handleDelete(row.id)} variant="outlined" color="error" size="small" sx={{ ml: 1 }}>
                                                Apagar
                                            </Button>
                                        </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box/>
            <Progress visible={progress}/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Editar Meta</DialogTitle>
                <DialogContent>
                    {editingRow && (
                        <>
                            <TextField
                                margin="dense"
                                label="Nome da Meta"
                                fullWidth
                                variant="standard"
                                value={editingRow.nome_meta}
                                onChange={(e) => setEditingRow({ ...editingRow, nome_meta: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Porcentagem"
                                fullWidth
                                variant="standard"
                                type="number"
                                value={editingRow.porcentagem}
                                onChange={(e) => setEditingRow({ ...editingRow, porcentagem: parseFloat(e.target.value) || '' })}
                            />
                            <TextField
                                margin="dense"
                                label="Data de Criação"
                                fullWidth
                                variant="standard"
                                type="date"
                                value={editingRow.data_criacao ? editingRow.data_criacao.split("T")[0] : ""}
                                onChange={(e) =>
                                    setEditingRow({ ...editingRow, data_criacao: e.target.value })
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

import { useEffect, useState } from "react";
import { supabase } from "../../../src/services/supabaseClient";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, styled, tableCellClasses,
  Skeleton, Container,Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl,InputLabel,Select,MenuItem
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function TableRegistro({valores, onSuccess }){
  const { categoria, tipo, descricao, valor } = valores;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // Armazena os dados da linha a ser editada

   useEffect(() => {
        filtrar();
    }, []);
    
    const addTransacao = async(e) => {
        e.preventDefault()
        setLoadingButton(true); // Desabilita o botão

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error("Erro ao buscar sessão:", sessionError);
            return;
        }

        if (!session || !session.user) {
            console.error("Usuário não autenticado!");
            return;
        }
        

        const user = session.user;
        
        const dataAtual = new Date();

        // Subtrai 3 horas (3 * 60 * 60 * 1000 milissegundos) para ajustar para o fuso horário de Brasília
        const dataBrasilia = new Date(dataAtual.getTime() - (3 * 60 * 60 * 1000));
        try {
            const {data, error} = await supabase
                .from("transacoes")
                .insert([
                    { 
                        categoria, 
                        valor, 
                        tipo, 
                        descricao, 
                        data:dataBrasilia.toISOString(), 
                        user_id: user.id}
                ]);
            if (error) console.error(error);
            else {
                console.log("Transação adicionada:", data);
                onSuccess()
                filtrar();
               
            }

        } catch (error) {
            console.error("Algo deu errado", error);
        }finally{
            setLoadingButton(false);
        }
        
    }
    async function filtrar() {
        const hoje = new Date();
        // Calcula o início do dia com base no horário de Brasília (UTC-3)
        const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
        inicioDoDia.setHours(inicioDoDia.getHours() - 3); // Ajuste de fuso horário
        
        // Calcula o fim do dia
        const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
        fimDoDia.setHours(fimDoDia.getHours() - 3); // Ajuste de fuso horário
        
      try {
         const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .gte("data", inicioDoDia.toISOString())
        .lte("data", fimDoDia.toISOString())

        if (error) {
            console.error("Erro ao buscar dados:", error);
        } else {
            setRows(data || []); // só os dados reais do Supabase
        }
      } catch (error) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false); // garante que loading sempre desliga ao final
      }
    }

    const handleEdit = (row) => {
      setEditingId(row.id);
      setEditFormData(row); // Preenche o formulário com os dados da linha
    };


    const handleOpen = (row) => {
      setEditingRow(row);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setEditingRow(null);
    };

    const handleSave = async () => {
      try {
        const { error } = await supabase
          .from("transacoes")
          .update(editingRow)
          .eq("id", editingRow.id);

        if (error) {
          console.error("Erro ao atualizar:", error);
        } else {
          console.log("Registro atualizado com sucesso!");
          handleClose(); // Fecha o modal após o sucesso
          filtrar(); // Atualiza a tabela
        }
      } catch (err) {
        console.error("Erro inesperado ao salvar:", err);
      }
    };

    
    const handleDelete = async (id) => {
      try {
        const { error } = await supabase
          .from("transacoes")
          .delete()
          .eq("id", id); // Filtra o registro pelo ID

        if (error) {
          console.error("Erro ao apagar:", error);
        } else {
          console.log("Registro apagado com sucesso!");
          filtrar(); // Atualiza a tabela após a exclusão
        }
      } catch (err) {
        console.error("Erro inesperado ao apagar:", err);
      }
    };




    return(
    <>
     <Container sx={{ margin: '1rem', display: 'flex', alignItems: 'center', width: '100%' }}>
     </Container>
     <Button 
     loading={loadingButton}
     variant="contained" 
     onClick={addTransacao}
     sx={{margin:'1rem'}}
     disabled={loadingButton}
     >
        Adicinar Item
     </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Valor</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Descrição</StyledTableCell>
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
            ): rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                    Nada Incluído ainda!
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell>{row.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                  })}</TableCell>
                  <TableCell>{new Date(row.data).toLocaleDateString('pt-br')}</TableCell>
                  <TableCell>{row.descricao}</TableCell>
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
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Registro</DialogTitle>
      <DialogContent>
        {editingRow && (
          <>
            <FormControl fullWidth>
                <InputLabel id="label-tipo">Selecione o tipo</InputLabel>
                <Select
                    labelId="label-tipo"
                    id="demo-simple-select"
                    variant="standard"
                    margin="dense"
                    value={editingRow.tipo}
                    label="Age"
                    onChange={(e) => setEditingRow({ ...editingRow, tipo: e.target.value })}
                >
                <MenuItem value={"Entrada"}>Entrada</MenuItem>
                <MenuItem value={"Saida"}>Saída</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{marginTop:'1rem'}}>
                <InputLabel id="label-categoria">Selecione a Categoria</InputLabel>
                <Select
                    labelId="label-categoria"
                    id="demo-simple-select"
                    value={editingRow.categoria}
                    variant="standard"
                    label="Age"
                    margin="dense"
                    onChange={(e) => setEditingRow({ ...editingRow, categoria: e.target.value })}
                >
                <MenuItem value={"Contas Fixas"}>Contas Fixas</MenuItem>
                <MenuItem value={"Saude"}>Saúde</MenuItem>
                <MenuItem value={"Carro"}>Carro</MenuItem>
                </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Valor"
              fullWidth
              variant="standard"
              type="number"
              value={editingRow.valor}
              onChange={(e) => setEditingRow({ ...editingRow, valor: parseFloat(e.target.value) || '' })}
            />
            <TextField
              margin="dense"
              label="Descrição"
              fullWidth
              variant="standard"
              value={editingRow.descricao}
              onChange={(e) => setEditingRow({ ...editingRow, descricao: e.target.value })}
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
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../../services/supabaseClient";
import Cards from "../../../components/cards/Card";
import { useTheme } from "@mui/material/styles";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, styled, tableCellClasses,
  Skeleton, Container, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import Progress from "../../../components/progress/Progress";

export default function Geral() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(""); // Novo estado: data inicial
  const [filterDateTo, setFilterDateTo] = useState("");   // Novo estado: data final
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fluxoConta();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1976d2",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  async function fluxoConta() {
    setLoading(true);
    const { data, error } = await supabase.from("transacoes").select("*");

    if (error) {
      console.error("Erro ao buscar dados:", error);
      setLoading(false);
      return;
    }

    setAllRows(data || []);
    setLoading(false);
  }

  const filteredAndCalculatedRows = useMemo(() => {
    let filtered = allRows;

    // Lógica de filtro por intervalo de datas
    if (filterDateFrom && filterDateTo) {
      const dateFrom = new Date(filterDateFrom + "T00:00:00");
      const dateTo = new Date(filterDateTo + "T23:59:59");
      
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.data);
        return rowDate >= dateFrom && rowDate <= dateTo;
      });
    } else if (filterDateFrom) {
      // Se apenas a data inicial for preenchida
      const dateFrom = new Date(filterDateFrom + "T00:00:00");
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.data);
        return rowDate >= dateFrom;
      });
    } else if (filterDateTo) {
      // Se apenas a data final for preenchida
      const dateTo = new Date(filterDateTo + "T23:59:59");
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.data);
        return rowDate <= dateTo;
      });
    }

    // Lógica de filtro por descrição (aplicada na lista já filtrada)
    if (filterDescription) {
      filtered = filtered.filter((row) =>
        row.descricao.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    // Cálculo dos totais
    const totalEntradas = filtered.reduce((acc, row) => {
      return row.tipo === "Entrada" ? acc + row.valor : acc;
    }, 0);

    const totalSaidas = filtered.reduce((acc, row) => {
      return row.tipo === "Saida" ? acc + row.valor : acc;
    }, 0);

    setEntradas(totalEntradas);
    setSaidas(totalSaidas);
    setTotal(totalEntradas - totalSaidas);

    return filtered;
  }, [allRows, filterDateFrom, filterDateTo, filterDescription]);

  const handleOpen = (row) => {
    setEditingRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("transacoes").delete().eq("id", id);

      if (error) {
        console.error("Erro ao apagar:", error);
      } else {
        console.log("Registro apagado com sucesso!");
        fluxoConta();
      }
    } catch (err) {
      console.error("Erro inesperado ao apagar:", err);
    }
  };

  const handleSave = async () => {
    setProgress(true);
    try {
      const { error } = await supabase
        .from("transacoes")
        .update(editingRow)
        .eq("id", editingRow.id);

      if (error) {
        console.error("Erro ao atualizar:", error);
      } else {
        console.log("Registro atualizado com sucesso!");
        handleClose();
        fluxoConta();
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar:", err);
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <Container sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', width: '100%' }}>
        <Cards valores={{ entrada: entradas, saida: saidas, total: total }} />
      </Container>
      <Progress visible={progress} />

      {/* Inputs de filtro */}
      <Container
        sx={{
          marginBottom: "1rem",
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Filtrar por Descrição"
          variant="outlined"
          size="small"
          value={filterDescription}
          onChange={(e) => setFilterDescription(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Data De"
          type="date"
          variant="outlined"
          size="small"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Até"
          type="date"
          variant="outlined"
          size="small"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Container>
      {/* --- */}

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
                <TableCell colSpan={6} align="center">
                  <Skeleton animation="wave" height={40} />
                </TableCell>
              </TableRow>
            ) : filteredAndCalculatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredAndCalculatedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell>
                    {row.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(row.data).toLocaleDateString("pt-br")}
                  </TableCell>
                  <TableCell>{row.descricao}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpen(row)}
                      size="small"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                    >
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
              <FormControl fullWidth sx={{ marginTop: '1rem' }}>
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
                type="date"
                variant="filled"
                fullWidth
                value={new Date(editingRow.data).toISOString().split('T')[0]}
                onChange={(e) => setEditingRow({ ...editingRow, data: new Date(e.target.value + "T00:00:00") })}
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
  );
}
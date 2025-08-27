import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import Cards from "../../../components/cards/Card";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, styled, tableCellClasses,
  Skeleton, Container,TextField
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

export default function TransacoesTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fluxoConta();
  }, []);

  async function fluxoConta() {
    const { data, error } = await supabase
      .from("transacoes")
      .select("*");

    if (error) {
      console.error("Erro ao buscar dados:", error);
    } else {
      setRows(data || []); // só os dados reais do Supabase
      const totalEntradas = data.reduce((result, valor) => {
        return valor.tipo === 'Entrada' ? result + valor.valor : result;
      }, 0);

      const totalSaidas = data.reduce((result, valor)=>{
        return valor.tipo === 'Saida' ? result + valor.valor : result;
      },0);

      setEntradas(totalEntradas)
      setSaidas(totalSaidas)
      setTotal(totalEntradas - totalSaidas)
    }
    setLoading(false);
  }

  const filteredRows = rows.filter((row) =>
    row.descricao.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
     <Container sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', width: '100%' }}>
      <Cards valores={{ entrada: entradas, saida: saidas, total: total }} />
     </Container>
     {/* <TextField
        label="Filtrar por Descrição"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ margin: "1rem" }}
      /> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Valor</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Descrição</StyledTableCell>
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
                  Nenhuma trasação encontrada
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
import {useState} from "react";
import { Box, Container, TextField,Typography, InputLabel,Select, MenuItem,FormControl, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InputMoeda from '../../../components/inputReal/InputMoeda'
import PaidIcon from '@mui/icons-material/Paid';
import MobiledataOffIcon from '@mui/icons-material/MobiledataOff';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CategoryIcon from '@mui/icons-material/Category';
import TableRegistro from '../../../components/TabelaRegistros/TableRegistro'

export default function Registra(){
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [tipo, setTipo] = useState('');
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState(0)
    const [categoria, setCategoria] = useState('')
    const handleChangeTipo = (event) => {
        setTipo(event.target.value);
    };

    const handleChangeCat = (event) => {
        setCategoria(event.target.value);
    };

    const handleDescricao = (event) => {
        setDescricao(event.target.value);
    }

    // Função para limpar os estados
    const resetStates = () => {
        setTipo('');
        setDescricao('');
        setValor(0); // Para o InputMoeda, pode ser 0 ou ''
        setCategoria('');
    };

    return(
        <>
            <Container fixed>
                <Box sx={{ height: '100vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <Typography sx={{ 
                        fontSize: {
                        xs: "12px", // telas pequenas
                        sm: "18px",
                        md: "24px",
                        lg: "42px",
                    }
                    }}>
                        Registre Suas Entradas e Saídas
                    </Typography>
                    <Box 
                        sx={{ 
                        width:'100%', 
                        display:'flex', 
                        justifyContent:'space-around', 
                        alignItems:'center', 
                        flexDirection:"column"
                    }} >

                        <Box sx={{ display:'flex', width:'100%', alignItems:'center' }}>
                                <MobiledataOffIcon sx={{fontSize: 40, marginRight:"3px"}}/>
                                <FormControl sx={{ flex:'100%', margin: '1rem' }}>
                                    <InputLabel id="label-tipo">Selecione o tipo</InputLabel>
                                    <Select
                                        labelId="label-tipo"
                                        id="demo-simple-select"
                                        value={tipo}
                                        label="Age"
                                        onChange={handleChangeTipo}
                                    >
                                    <MenuItem value={"Entrada"}>Entrada</MenuItem>
                                    <MenuItem value={"Saida"}>Saída</MenuItem>
                                    </Select>
                                </FormControl>
                                <CategoryIcon sx={{fontSize: 40, marginRight:"3px"}}/>
                                <FormControl sx={{ flex: '100%', margin: '1rem'}}>
                                    <InputLabel id="label-categoria">Selecione a Categoria</InputLabel>
                                    <Select
                                        labelId="label-categoria"
                                        id="demo-simple-select"
                                        value={categoria}
                                        label="Age"
                                        onChange={handleChangeCat}
                                    >
                                    <MenuItem value={"Contas Fixas"}>Contas Fixas</MenuItem>
                                    <MenuItem value={"Saude"}>Saúde</MenuItem>
                                    <MenuItem value={"Carro"}>Carro</MenuItem>
                                    </Select>
                                </FormControl>
                        </Box>
                        <Box sx={{ display:'flex', width:'100%', alignItems:'center' }}>
                                <BorderColorIcon sx={{fontSize: 40, marginRight:"3px"}}/>
                                <TextField
                                    variant="outlined"
                                    label="Descrição do movimento"
                                    type="text"
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
                                    onChange={handleDescricao}
                                />
                                    <PaidIcon sx={{fontSize: 40, marginRight:"3px"}}/>
                                    <InputMoeda
                                      value={valor}
                                      onChange={setValor}
                                    />
                        </Box>
                    </Box>
                    <TableRegistro 
                    valores={{tipo:tipo, categoria:categoria, descricao:descricao, valor:valor}}
                    onSuccess={() => { resetStates() }}
                    />
                </Box>
            </Container>
        </>
    )
}
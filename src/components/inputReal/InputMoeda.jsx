import React from 'react';
import { TextField } from "@mui/material";

function InputMoeda({ value, onChange }) {
  
  const formatarMoeda = (valor) => {
    if (!valor) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };

  const handleInputChange = (event) => {
    let valorDigitado = event.target.value.replace(/\D/g, ""); // só números
    if (!valorDigitado) {
      onChange(0);
      return;
    }

    let valorNumerico = parseFloat(valorDigitado) / 100; // sempre em reais
    onChange(valorNumerico);
  };

  return (
    <TextField
      variant="outlined"
      type="text"
      value={formatarMoeda(value)}
      onChange={handleInputChange}
      placeholder="Digite o valor"
      sx={{ width: "100%", margin: "1rem" }}
    />
  );
}

export default InputMoeda;
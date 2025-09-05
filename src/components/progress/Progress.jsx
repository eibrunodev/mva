import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

export default function Progress( { visible = true } ) {
    if (!visible) return null;
  return (
    <Box 
      sx={{ 
        position: "fixed", // sobrepõe a tela
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // escurece fundo (opcional)
        zIndex: 1300, // fica acima do conteúdo (1300 = nível do Modal do MUI)
      }}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c2c2cff" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress 
        sx={{ 
          'svg circle': { stroke: 'url(#my_gradient)' } 
        }} 
      />
    </Box>
  );
}

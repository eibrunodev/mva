import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const cards = [
  {
    id: "entrada",
    title: 'Entradas',
    description: 'Todos os tipos de entradas financeiras.',
  },
  {
    id: "saida",
    title: 'Saídas',
    description: 'Todos os tipos de saídas financeiras.',
  },
  {
    id: "total",
    title: 'Total liquido',
    description: 'Total de entradas menos saídas.',
  },
];

const formatCurrency = (value) => {
  return (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

function SelectActionCard( {valores} ) {
  const [selectedCard, setSelectedCard] = React.useState(0);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around', 
        flexWrap: 'wrap',
        gap: 2,
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        marginTop: 2,
        marginBottom: 2,
        alignItems: 'center',
        height: '100%',
        overflow: 'auto',
        '& > *': {
          flex: '1 1 30%', // Flex grow, shrink, and basis
          minWidth: '200px', // Minimum width for each card
        },

      }}
    >
      {cards.map((card, index) => (
        <Card key={index.id}>
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <CardContent sx={{ height: '100%', backgroundColor: card.id === 'entrada' ? '#258ce5' : card.id === 'saida' ? '#e55342' : '#1ba462' }}>
             <Typography
                sx={{
                    fontSize: {
                        xs: "12px", // telas pequenas
                        sm: "18px",
                        md: "24px",
                        lg: "42px",
                    }
                }}  
                variant="h3" color="text.secondary">
                    {formatCurrency(valores[card.id])}
              </Typography>
              <Typography variant="h5" component="div">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default SelectActionCard;
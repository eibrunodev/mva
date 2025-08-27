import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import Logo from '../../assets/img/Logo-web.png';
import Fluxo from './Fluxo/Fluxo';
import Registra from './Registrar/Registrar';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  if (pathname === '/fluxo') {
    return <Fluxo />;
  } else if (pathname === '/registrar'){
    return <Registra />
  }
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Seja bem vindo! {pathname}</Typography>
    </Box>
  );
}


export default function DashboardLayoutNavigationLinks() {

  const router = useDemoRouter('/home');


  return (
    <DemoProvider>
      {/* preview-start */}
      <AppProvider
        navigation={[
         {
            segment: 'fluxo',
            title: 'Fluxo',
            icon: <AssessmentIcon />, 
          },
          {
            segment:'registrar',
            title:'Registrar',
            icon:<BorderColorIcon />
          }
        ]}
        router={router}
        theme={demoTheme}
        branding={{
            title: 'Financeiro',
            logo: <img src={Logo} alt="MVA Financeiro Logo" style={{ width: 40 }} />,
            logoWidth: 40,
        }}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
      {/* preview-end */}
    </DemoProvider>
  );
}
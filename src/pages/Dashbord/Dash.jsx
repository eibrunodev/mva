import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import Logo from '../../assets/img/Logo-web.png';
import Fluxo from './Fluxo/Fluxo';
import Registra from './Registrar/Registrar';
import Geral from './Geral/geral';
import MetaFinanceira from './Meta_Financeira/MetaFinanceira';

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
  } else if (pathname === '/geral'){
    return <Geral/>
  }else if (pathname === '/meta-financeira'){
    return <MetaFinanceira/>
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
            title: 'Fluxo das Diárias Mês',
            icon: <AssessmentIcon />, 
          },
          {
            segment:'registrar',
            title:'Registrar Diárias',
            icon:<BorderColorIcon />
          },
           {
            segment: 'geral',
            title: 'Fluxo Geral',
            icon: <OpenInFullIcon />, 
          },
          {
            segment: 'meta-financeira',
            title: 'Meta Financeira',
            icon: <CrisisAlertIcon />,
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
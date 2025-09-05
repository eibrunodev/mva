import { useEffect, useState } from 'react';
import './Login.scss'
import { Typography, Box, Button, TextField} from '@mui/material';
import Logo from '../../assets/img/Logo-web.png';
import { supabase } from "../../services/supabaseClient";
import {useNavigate} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [progress, setProgress] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 10 : prev + 10));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(10);
    
    const startTime = Date.now();
    const {data,error} = await supabase.auth.signInWithPassword({ email, password});

    if(error){
      console.error('Erro ao fazer login:', error);
      setLoading(false);
      return;
    }

    if(data){
      console.log('Dados enviados com sucesso:', data);
      const elapsed = Date.now() - startTime;
      const minTime = 1500; // tempo mínimo em ms
       setTimeout(() => {
        setLoading(false);
        navigate('/home');
        setProgress(100); 
      }, Math.max(0, minTime - elapsed));
    }
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#292929ff' }}>
       
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 800, backgroundColor: '#1a1a1a', borderRadius: 2 }}>
          <Box sx={{width:'100%', display:'flex',justifyContent:'center',background: '#ffff', borderRadius:2}} className='container-header'>
            <img className='logo' src={Logo} alt="Logo" />
          </Box>
          <Typography sx={{color:'#ffff'}} variant="overline"> Efetuar Login </Typography>
          <Box component={'form'} className='container-form' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '3rem' }}>
            <TextField 
             variant='outlined' 
             label='E-mail' 
             type='email' 
             sx={{ input: { color: '#ffff', fontSize: '1rem' },
               '& label': { color: '#ffff' }, // Cor do rótulo
               "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {borderColor: '#ffffff',},
              width: '40%',
             }}
             onChange={(e) => setEmail(e.target.value)}
             />

             <TextField 
              variant='outlined' 
              label='Senha' 
              type='password' 
              sx={{ input: { color: '#ffff', fontSize: '1rem' },
                '& label': { color: '#ffff' }, // Cor do rótulo
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {borderColor: '#ffffff',},
                width: '40%',
                marginTop: '1rem',
                marginBottom: '1rem',
              }}
              onChange={(e) => setPassword(e.target.value)}
             />
             <Button onClick={handleLogin} sx={{width:'30%'}} variant="contained">Login</Button>
               {loading && (
                <CircularProgress sx={{top:10}} color="success" size="3rem" />
              )}
          </Box>
        </Box> 
      </Box>
    </>
  )
}

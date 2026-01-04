
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Paper, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Check for error in URL params (from OAuth redirect)
    const params = new URLSearchParams(window.location.hash.substring(1)); // Supabase returns params in hash
    const errorDescription = params.get('error_description');
    const errorMsg = params.get('error');

    if (errorDescription || errorMsg) {
      setError(decodeURIComponent(errorDescription || errorMsg).replace(/\+/g, ' '));
    }
  }, []);

  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Task Manager
        </Typography>
        <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
          Sign in/Sign up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3, width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GitHubIcon />}
            onClick={handleGitHubLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: '#24292e',
              '&:hover': {
                backgroundColor: '#1a1f24',
              }
            }}
          >
            {loading ? 'Connecting...' : 'Continue with GitHub'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
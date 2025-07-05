import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { useAuth } from '@/hooks/useAuth';
import { Camera } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const authMode = searchParams.get('mode');
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(
    authMode === 'reset' ? 'reset' : 'signin'
  );  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to home
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const toggleMode = () => {
    if (mode === 'reset') {
      setMode('signin');
    } else {
      setMode(mode === 'signin' ? 'signup' : 'signin');
    }
  };

  const showResetForm = () => {
    setMode('reset');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-natural flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            Authentic Moments
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'signup' ? 'Join the Community' : 
             mode === 'reset' ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'reset' 
              ? 'Enter your email to receive a password reset link'
              : 'Where every moment is genuine and unfiltered'
            }
          </p>
        </div>

        {mode === 'reset' ? (
          <PasswordResetForm onBackToSignIn={() => setMode('signin')} />
        ) : (
          <AuthForm mode={mode} onToggleMode={toggleMode} onShowReset={showResetForm} />
        )}
      </div>
    </div>
  );
};

export default Auth;
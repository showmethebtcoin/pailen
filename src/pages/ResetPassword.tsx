
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/GlassCard';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extraer el token del query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    if (!resetToken) {
      setError('Token de restablecimiento no válido. Por favor, solicita un nuevo enlace de restablecimiento.');
      return;
    }
    
    setToken(resetToken);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (!token) {
      setError('Token no válido');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Llamar al endpoint para restablecer la contraseña
      await authService.resetPassword(token, password);
      
      setSuccess(true);
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada con éxito.",
      });
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña. El enlace podría haber expirado.",
        variant: "destructive",
      });
      setError('No se pudo restablecer la contraseña. El enlace podría haber expirado o ser inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-primary/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-[25%] right-[25%] w-5 h-5 bg-primary/10 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-[30%] left-[10%] w-4 h-4 bg-primary/15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-[20%] right-[15%] w-6 h-6 bg-primary/5 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="container max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Logo size="lg" className="mb-4" />
            <h1 className="text-3xl font-semibold mb-2">Nueva contraseña</h1>
            <p className="text-muted-foreground">Establece una nueva contraseña para tu cuenta</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-6">
              {success ? (
                <div className="text-center py-4">
                  <div className="text-primary text-5xl mb-4">✓</div>
                  <h2 className="text-xl font-medium mb-2">¡Contraseña actualizada!</h2>
                  <p className="text-muted-foreground mb-4">
                    Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión.
                  </p>
                  <Button asChild className="mt-2">
                    <Link to="/login">Ir al inicio de sesión</Link>
                  </Button>
                </div>
              ) : error && !token ? (
                <div className="text-center py-4">
                  <div className="text-destructive text-5xl mb-4">✗</div>
                  <h2 className="text-xl font-medium mb-2">Error</h2>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button asChild className="mt-2">
                    <Link to="/forgot-password">Solicitar nuevo enlace</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                    {error && (
                      <p className="text-xs text-destructive mt-1">{error}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        Actualizando...
                      </div>
                    ) : (
                      'Restablecer contraseña'
                    )}
                  </Button>
                </form>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-muted-foreground">
              ¿Recuerdas tu contraseña?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/GlassCard';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Intenta enviar el email de recuperación
      await authService.forgotPassword(email);
      
      setSubmitted(true);
      toast({
        title: "Email Enviado",
        description: "Si existe una cuenta con este email, recibirás instrucciones para restablecer tu contraseña.",
      });
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      toast({
        title: "Error",
        description: "No pudimos procesar tu solicitud. Inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
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
            <h1 className="text-3xl font-semibold mb-2">Recupera tu contraseña</h1>
            <p className="text-muted-foreground">
              {submitted 
                ? "Revisa tu correo electrónico para obtener instrucciones" 
                : "Te enviaremos un enlace para restablecer tu contraseña"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-primary text-5xl mb-4">✓</div>
                  <h2 className="text-xl font-medium mb-2">Email Enviado</h2>
                  <p className="text-muted-foreground mb-4">
                    Si existe una cuenta con el email <strong>{email}</strong>, recibirás instrucciones
                    para restablecer tu contraseña.
                  </p>
                  <Button asChild className="mt-2">
                    <Link to="/login">Volver al inicio de sesión</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/50"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        Enviando...
                      </div>
                    ) : (
                      'Enviar instrucciones'
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

export default ForgotPassword;

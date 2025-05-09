
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/GlassCard';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the AuthContext
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
            <h1 className="text-3xl font-semibold mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-muted-foreground">{t('auth.accessPortal')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      {t('auth.forgotPasswordText')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      {t('auth.signingIn')}
                    </div>
                  ) : (
                    t('auth.login')
                  )}
                </Button>
              </form>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-muted-foreground">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('auth.signUp')}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;

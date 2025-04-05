
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, DollarSign, Tag, CreditCard } from 'lucide-react';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 9.99,
    billing: 'mensual',
    description: 'Ideal para profesores independientes que están comenzando',
    features: [
      'Hasta 20 estudiantes',
      'Gestión básica de estudiantes',
      'Calendario de clases',
      'Seguimiento de pagos',
      'Soporte por email'
    ],
    isPopular: false,
    cta: 'Comenzar ahora'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    billing: 'mensual',
    description: 'Perfecto para profesores establecidos con múltiples estudiantes',
    features: [
      'Hasta 50 estudiantes',
      'Todas las características del plan Básico',
      'Generación de materiales con IA',
      'Informes y analíticas avanzadas',
      'Recordatorios automáticos',
      'Soporte prioritario'
    ],
    isPopular: true,
    cta: 'Elegir Premium'
  },
  {
    id: 'professional',
    name: 'Profesional',
    price: 29.99,
    billing: 'mensual',
    description: 'Para profesionales y academias con necesidades avanzadas',
    features: [
      'Estudiantes ilimitados',
      'Todas las características del plan Premium',
      'Múltiples profesores',
      'Facturación automática',
      'Integraciones con herramientas externas',
      'Panel de administración',
      'Soporte dedicado 24/7'
    ],
    isPopular: false,
    cta: 'Contactar ventas'
  }
];

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-xl text-muted-foreground">
            Elige el plan perfecto para tus necesidades de enseñanza. 
            Todos los planes incluyen una prueba gratuita de 14 días.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col h-full ${plan.isPopular ? 'border-primary shadow-lg relative' : ''}`}>
              {plan.isPopular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                  <Badge variant="default" className="bg-primary">Más popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground">/{plan.billing}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={plan.isPopular ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes sobre precios</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
            <div className="space-y-2">
              <h3 className="font-medium">¿Puedo cambiar de plan más adelante?</h3>
              <p className="text-muted-foreground">
                Sí, puedes actualizar o degradar tu plan en cualquier momento. 
                Los cambios se reflejarán en tu próximo ciclo de facturación.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">¿Qué métodos de pago aceptan?</h3>
              <p className="text-muted-foreground">
                Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, American Express) 
                y PayPal.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">¿Ofrecen descuentos para pago anual?</h3>
              <p className="text-muted-foreground">
                Sí, ofrecemos un 20% de descuento cuando eliges facturación anual en cualquiera de nuestros planes.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">¿Qué sucede cuando termina mi prueba gratuita?</h3>
              <p className="text-muted-foreground">
                Al finalizar tu periodo de prueba, tu cuenta se convertirá automáticamente al plan seleccionado. 
                Te enviaremos un recordatorio antes de que termine.
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">¿Necesitas un plan personalizado?</h3>
            <p className="mb-4">
              Contáctanos para discutir tus necesidades específicas y obtener un presupuesto personalizado.
            </p>
            <Button onClick={() => navigate("/contact")} variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Contactar con ventas
            </Button>
          </div>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default Pricing;

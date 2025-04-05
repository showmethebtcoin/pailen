
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const FAQ = () => {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h1>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">¿Cómo puedo registrarme en la plataforma?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Para registrarte, haz clic en el botón "Comenzar gratis" en la página principal y sigue los pasos del formulario de registro. Solo necesitarás tu nombre, correo electrónico y una contraseña.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">¿Cuántos estudiantes puedo gestionar?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                El número de estudiantes depende del plan que elijas. El plan básico permite hasta 20 estudiantes, mientras que los planes premium y profesional ofrecen capacidades ampliadas o ilimitadas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">¿Cómo puedo cancelar mi suscripción?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Puedes cancelar tu suscripción en cualquier momento desde la sección "Suscripción" en tu panel de control. La cancelación será efectiva al final del periodo de facturación actual.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">¿Ofrecen soporte técnico?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí, todos los planes incluyen soporte por correo electrónico. Los planes premium y profesional incluyen soporte prioritario con tiempos de respuesta más rápidos.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">¿Puedo exportar los datos de mis estudiantes?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sí, desde la sección de estudiantes puedes exportar todos los datos a formato CSV, lo que te permite utilizar la información en otras aplicaciones o hacer copias de seguridad.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default FAQ;

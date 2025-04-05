
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const Terms = () => {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Términos de Servicio</h1>
          
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder o utilizar los servicios de Pailen, aceptas estar sujeto a estos Términos de Servicio. 
              Si no estás de acuerdo con alguno de estos términos, no podrás utilizar nuestros servicios.
            </p>
            
            <h2>2. Descripción del Servicio</h2>
            <p>
              Pailen proporciona una plataforma de gestión para profesores de idiomas, que incluye herramientas para 
              administrar estudiantes, seguimiento de progreso, programación de clases y análisis de rendimiento.
            </p>
            
            <h2>3. Registro de Cuenta</h2>
            <p>
              Para utilizar nuestros servicios, debes registrarte y crear una cuenta con información precisa y completa. 
              Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran 
              bajo tu cuenta.
            </p>
            
            <h2>4. Planes de Suscripción y Pagos</h2>
            <p>
              Ofrecemos diferentes planes de suscripción con distintas características y precios. Los pagos se procesan 
              de forma segura a través de nuestros proveedores de pago. Las suscripciones se renuevan automáticamente 
              hasta que sean canceladas.
            </p>
            
            <h2>5. Política de Cancelación y Reembolsos</h2>
            <p>
              Puedes cancelar tu suscripción en cualquier momento desde tu panel de control. Las cancelaciones serán 
              efectivas al final del periodo de facturación actual. No ofrecemos reembolsos por periodos parciales de 
              servicio.
            </p>
            
            <h2>6. Contenido del Usuario</h2>
            <p>
              Eres responsable de todo el contenido que subas a nuestra plataforma, incluyendo datos de estudiantes. 
              Debes asegurarte de tener los derechos y permisos necesarios para el uso de dicho contenido.
            </p>
            
            <h2>7. Propiedad Intelectual</h2>
            <p>
              Pailen y su contenido, características y funcionalidad son propiedad exclusiva de nuestra empresa y están 
              protegidos por leyes de propiedad intelectual. No se concede ningún derecho o licencia sobre nuestro contenido 
              salvo lo expresamente establecido en estos términos.
            </p>
            
            <h2>8. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Pailen será responsable por daños indirectos, consecuentes, ejemplares, incidentales, especiales 
              o punitivos, incluyendo pérdida de beneficios, incluso si hemos sido advertidos de la posibilidad de tales daños.
            </p>
            
            <h2>9. Cambios en los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios 
              significativos a través de un aviso en nuestra plataforma o por correo electrónico.
            </p>
            
            <h2>10. Ley Aplicable</h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes de España, sin considerar sus disposiciones 
              sobre conflictos de leyes.
            </p>
            
            <h2>11. Contacto</h2>
            <p>
              Si tienes preguntas o inquietudes sobre estos Términos de Servicio, contáctanos en legal@pailen.com.
            </p>
          </div>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default Terms;

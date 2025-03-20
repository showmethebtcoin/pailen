
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Cookie, Shield, Info } from 'lucide-react';

const Cookies = () => {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Política de Cookies</h1>
          </div>
          
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
            
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, teléfono móvil o tablet) 
              cuando visitas nuestra página web. Estas cookies nos ayudan a recordar tus preferencias, entender cómo utilizas 
              nuestra web y mejorar tu experiencia de navegación.
            </p>
            
            <div className="bg-primary-50 border-l-4 border-primary p-4 my-6">
              <div className="flex gap-3">
                <Info className="h-6 w-6 text-primary flex-shrink-0" />
                <p className="text-sm">
                  Pailen utiliza cookies para mejorar la funcionalidad de nuestra plataforma y proporcionar una 
                  experiencia personalizada a nuestros usuarios.
                </p>
              </div>
            </div>
            
            <h2>2. Tipos de cookies que utilizamos</h2>
            
            <h3>Cookies esenciales</h3>
            <p>
              Estas cookies son necesarias para el funcionamiento básico de nuestra web. Te permiten navegar y utilizar 
              funciones esenciales como iniciar sesión en áreas seguras. Sin estas cookies, muchos de nuestros servicios 
              no estarían disponibles.
            </p>
            
            <h3>Cookies de funcionalidad</h3>
            <p>
              Estas cookies nos permiten recordar tus preferencias y opciones para ofrecerte una experiencia más personalizada. 
              Por ejemplo, pueden recordar tu idioma preferido o la región en la que te encuentras.
            </p>
            
            <h3>Cookies analíticas</h3>
            <p>
              Utilizamos estas cookies para recopilar información sobre cómo los usuarios interactúan con nuestra web, 
              lo que nos ayuda a mejorar su funcionamiento. Por ejemplo, las cookies analíticas nos muestran qué páginas 
              son las más visitadas, nos ayudan a registrar dificultades que los usuarios puedan tener y nos muestran si 
              nuestra publicidad es efectiva.
            </p>
            
            <h3>Cookies de marketing</h3>
            <p>
              Estas cookies se utilizan para mostrarte anuncios que sean relevantes para ti y tus intereses. También se 
              utilizan para limitar el número de veces que ves un anuncio y para medir la efectividad de las campañas 
              publicitarias.
            </p>
            
            <h2>3. Control de cookies</h2>
            <p>
              Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador. La mayoría de 
              navegadores te permiten rechazar todas las cookies o aceptar solo algunas. Sin embargo, rechazar todas las 
              cookies puede impedir el correcto funcionamiento de nuestra plataforma.
            </p>
            
            <p>
              Para más información sobre cómo gestionar las cookies en tu navegador, puedes consultar los siguientes enlaces:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li>
            </ul>
            
            <h2>4. Cookies de terceros</h2>
            <p>
              Algunas cookies son colocadas por servicios de terceros que aparecen en nuestras páginas. Estos terceros 
              pueden incluir proveedores de análisis que nos ayudan a entender cómo utilizas nuestra web para que podamos 
              mejorarla, o plataformas de redes sociales si decides interactuar con estos servicios a través de nuestra web.
            </p>
            
            <h2>5. Cambios en nuestra política de cookies</h2>
            <p>
              Podemos actualizar nuestra política de cookies periódicamente para reflejar cambios en las cookies que utilizamos 
              o por otros motivos operativos, legales o regulatorios. Te recomendamos que visites esta página regularmente 
              para estar informado sobre el uso de cookies en nuestra plataforma.
            </p>
            
            <h2>6. Contacto</h2>
            <p>
              Si tienes preguntas o inquietudes sobre nuestra política de cookies, por favor contáctanos en:
            </p>
            <p>
              Email: <a href="mailto:privacy@pailen.com">privacy@pailen.com</a>
            </p>
            
            <div className="flex items-center gap-2 mt-8 p-4 bg-muted rounded-lg">
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              <p className="text-sm">
                Al continuar utilizando nuestra web, aceptas el uso de cookies de acuerdo con esta política.
              </p>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default Cookies;

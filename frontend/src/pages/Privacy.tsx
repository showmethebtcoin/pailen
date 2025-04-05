
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const Privacy = () => {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introducción</h2>
            <p>
              En Pailen, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, 
              utilizamos, compartimos y protegemos la información personal que recopilamos cuando utilizas nuestra plataforma 
              para profesores de idiomas, tanto a través de nuestro sitio web como de nuestras aplicaciones móviles.
            </p>
            
            <h2>2. Información que recopilamos</h2>
            <p>
              Recopilamos información que nos proporcionas directamente, como:
            </p>
            <ul>
              <li>Información de registro y perfil (nombre, correo electrónico, contraseña)</li>
              <li>Información de pago y facturación</li>
              <li>Datos de estudiantes que agregas a la plataforma</li>
              <li>Comunicaciones que mantienes con nosotros</li>
            </ul>
            
            <h2>3. Cómo utilizamos tu información</h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul>
              <li>Proporcionar, mantener y mejorar nuestros servicios</li>
              <li>Procesar transacciones y enviar notificaciones relacionadas</li>
              <li>Responder a tus comentarios y preguntas</li>
              <li>Enviar información técnica, actualizaciones y alertas de seguridad</li>
              <li>Personalizar tu experiencia y ofrecer contenido adaptado a tus intereses</li>
            </ul>
            
            <h2>4. Compartir información</h2>
            <p>
              No vendemos tu información personal a terceros. Podemos compartir información en las siguientes circunstancias:
            </p>
            <ul>
              <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma</li>
              <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
              <li>En caso de fusión, venta o cambio de control</li>
            </ul>
            
            <h2>5. Seguridad de datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra 
              acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema es completamente seguro, por lo que 
              no podemos garantizar la seguridad absoluta de tu información.
            </p>
            
            <h2>6. Tus derechos</h2>
            <p>
              Dependiendo de tu ubicación, puedes tener ciertos derechos respecto a tu información personal, como:
            </p>
            <ul>
              <li>Acceder a la información personal que tenemos sobre ti</li>
              <li>Corregir información inexacta o incompleta</li>
              <li>Eliminar tu información (sujeto a ciertas excepciones)</li>
              <li>Oponerte al procesamiento de tu información</li>
            </ul>
            
            <h2>7. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios significativos 
              a través de un aviso en nuestra plataforma o por correo electrónico.
            </p>
            
            <h2>8. Contacto</h2>
            <p>
              Si tienes preguntas o inquietudes sobre esta Política de Privacidad, contáctanos en privacy@pailen.com.
            </p>
          </div>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default Privacy;

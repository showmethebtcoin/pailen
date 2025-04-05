
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Users, BookOpen, Award, Heart, Lightbulb, Target } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <LandingNavbar />
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Acerca de Pailen</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nuestra misión es transformar la enseñanza de idiomas, proporcionando a los profesores las herramientas 
              que necesitan para gestionar eficientemente su trabajo y centrar su atención en lo que realmente importa: enseñar.
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Our Story */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Nuestra Historia</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="mb-4">
                    Pailen nació de una necesidad real observada en el campo de la enseñanza de idiomas. Nuestros fundadores, 
                    que tienen experiencia tanto en educación como en tecnología, notaron que los profesores de idiomas 
                    a menudo pasaban demasiado tiempo en tareas administrativas y no lo suficiente enseñando.
                  </p>
                  <p>
                    En 2022, comenzamos a desarrollar una plataforma que pudiera simplificar la gestión de estudiantes, 
                    la programación de clases y el seguimiento del progreso. Nuestro objetivo era crear una herramienta que 
                    fuera intuitiva, potente y específicamente diseñada para las necesidades únicas de los profesores de idiomas.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Fundado en 2022</h3>
                    <p className="text-muted-foreground">
                      Con la misión de hacer que la enseñanza de idiomas sea más accesible y eficiente
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Our Values */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Nuestros Valores</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <Heart className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Pasión por la Educación</h3>
                  <p className="text-muted-foreground">
                    Creemos en el poder transformador de la educación y en la importancia de los idiomas para conectar culturas.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <Lightbulb className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Innovación Constante</h3>
                  <p className="text-muted-foreground">
                    Nos esforzamos por mejorar continuamente nuestra plataforma, incorporando nuevas tecnologías y mejores prácticas.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Centrados en el Usuario</h3>
                  <p className="text-muted-foreground">
                    Cada decisión que tomamos está guiada por las necesidades reales de los profesores y sus estudiantes.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Our Team */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Nuestro Equipo</h2>
              <p className="mb-8">
                Pailen está formado por un equipo diverso de educadores, desarrolladores y diseñadores 
                apasionados por mejorar la enseñanza de idiomas a través de la tecnología.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Educadores Experimentados</h3>
                    <p className="text-muted-foreground">
                      Profesionales con años de experiencia en la enseñanza de idiomas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Desarrolladores Talentosos</h3>
                    <p className="text-muted-foreground">
                      Expertos en tecnología educativa y desarrollo de software
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Contact CTA */}
            <section className="bg-muted rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">¿Quieres saber más sobre Pailen?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Estamos comprometidos con la mejora continua de nuestra plataforma y nos encantaría escuchar tus preguntas o comentarios.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground 
                hover:bg-primary/90 h-10 py-2 px-4"
              >
                Contacta con Nosotros
              </a>
            </section>
          </div>
        </div>
      </div>
      <LandingFooter />
    </PageTransition>
  );
};

export default About;

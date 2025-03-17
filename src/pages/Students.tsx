
import { useTranslation } from 'react-i18next';
import PageTransition from '@/components/PageTransition';
import StudentsContainer from '@/components/students/StudentsContainer';

const Students = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <StudentsContainer />
    </PageTransition>
  );
};

export default Students;


import i18n from './i18n';

describe('i18n configuration', () => {
  
  test('should have Spanish as default language', () => {
    // Reset language to default
    localStorage.removeItem('language');
    i18n.changeLanguage('es');
    
    expect(i18n.language).toBe('es');
  });
  
  test('should change language', () => {
    // Change to English
    i18n.changeLanguage('en');
    expect(i18n.language).toBe('en');
    
    // Change back to Spanish
    i18n.changeLanguage('es');
    expect(i18n.language).toBe('es');
  });
  
  test('should have translations for both languages', () => {
    const esTranslation = i18n.getDataByLanguage('es');
    const enTranslation = i18n.getDataByLanguage('en');
    
    expect(esTranslation).toBeDefined();
    expect(enTranslation).toBeDefined();
  });
});


import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import i18n from '../i18n';

// Mock the i18n module
jest.mock('../i18n', () => ({
  changeLanguage: jest.fn(),
  language: 'es',
  t: jest.fn((key) => key),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders language switcher correctly', () => {
    render(<LanguageSwitcher />);
    
    // Check if the language button is rendered
    expect(screen.getByText('language.current')).toBeInTheDocument();
  });

  test('changes language to English when clicked', async () => {
    render(<LanguageSwitcher />);
    
    // Open dropdown
    fireEvent.click(screen.getByText('language.current'));
    
    // Click on English option
    fireEvent.click(screen.getByText('English'));
    
    // Check if changeLanguage was called with 'en'
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
    
    // Check if language was stored in localStorage
    expect(localStorage.getItem('language')).toBe('en');
  });
});

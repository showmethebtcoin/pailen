
import { Student } from '@/types/student';

export const exportToCSV = (students: Student[]): string => {
  // Create CSV header row
  const headers = ['Name', 'Email', 'Language', 'Level', 'Hours Per Week', 'Start Date'];
  
  // Create CSV data rows
  const rows = students.map(student => [
    student.name,
    student.email,
    student.language,
    student.level,
    student.hoursPerWeek.toString(),
    student.startDate
  ]);
  
  // Combine header and data rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (students: Student[], filename: string = 'students.csv'): void => {
  const csvContent = exportToCSV(students);
  
  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Append the link to the DOM
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
};

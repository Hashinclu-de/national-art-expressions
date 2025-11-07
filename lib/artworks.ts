import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export interface Artwork {
  no: string;
  artSubPathway: string;
  requirement: string;
  driveLink: string;
  artWorkTitle: string;
  artWorkTitleArabic: string;
  schoolName: string;
  schoolNameArabic: string;
  noStudents: string;
  studentName: string;
  studentNameArabic: string;
  grade: string;
  gradeArabic: string;
  medium: string;
  mediumArabic: string;
}

export interface CategoryArtworks {
  category: string;
  artworks: Artwork[];
}

export async function loadArtworks(): Promise<CategoryArtworks[]> {
  // Read the CSV file from the filesystem
  const filePath = path.join(process.cwd(), 'public', 'data', 'Digital Artworks.csv');
  const csvText = fs.readFileSync(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const artworks: Artwork[] = results.data.map((row: any) => ({
          no: row['No'] || '',
          artSubPathway: row['Art Sub Pathway'] || '',
          requirement: row['Requirement'] || '',
          driveLink: row['Drive-Full link'] || '',
          artWorkTitle: row['Art Work Title'] || '',
          artWorkTitleArabic: row['Art Work Title Arabic'] || '',
          schoolName: row['School Name'] || '',
          schoolNameArabic: row['School Name Arabic'] || '',
          noStudents: row['No. Students'] || '',
          studentName: row['Student Name'] || '',
          studentNameArabic: row['Student Name Arabic'] || '',
          grade: row['Grade'] || '',
          gradeArabic: row['Grade Arabic'] || '',
          medium: row['Medium'] || '',
          mediumArabic: row['Medium Arabic'] || '',
        }));

        // Group artworks by category (case-insensitive)
        const categories = ['3D Modeling', 'Animation', 'Game Design', 'Video Game Design', 'Web Design'];
        const groupedArtworks: CategoryArtworks[] = categories.map(category => ({
          category,
          artworks: artworks.filter(artwork =>
            artwork.artSubPathway.toLowerCase() === category.toLowerCase()
          )
        }));

        resolve(groupedArtworks);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

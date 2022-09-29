export type MagnitudGrade = 'H' | 'M' | 'L';

export interface QuakeData {
  lat: number,
  long: number,
  alt: number,
  grade: MagnitudGrade,
  time: string
}


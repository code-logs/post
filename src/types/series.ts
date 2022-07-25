export interface Series {
  id: string
  prevPostTitle?: string
  nextPostTitle?: string
}

export type TempSeries = Omit<Series, 'id'> & Partial<Pick<Series, 'id'>>

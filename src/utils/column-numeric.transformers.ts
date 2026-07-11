export const ColumnNumericTransformer = {
  to: (data: number | null): number | null => data,
  from: (data: string | null): number | null => {
    return data !== null && data !== undefined ? parseFloat(data) : null;
  },
};
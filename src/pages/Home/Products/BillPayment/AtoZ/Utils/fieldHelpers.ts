export const isDOBField = (label: string) =>
  label?.toLowerCase().replace(/\s+/g, "").includes("dateofbirth(yyyymmdd)");

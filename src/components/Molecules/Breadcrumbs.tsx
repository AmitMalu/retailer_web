import { Breadcrumbs } from "@mantine/core";
import { Link, Paper, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const BreadcrumbsComponent = () => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path);
    if (paths.length === 0) return [{ name: "Dashboard", path: "/" }];

    const breadcrumbs = [{ name: "Dashboard", path: "/" }];
    let currentPath = "";

    paths.forEach((path) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        name: path.charAt(0).toUpperCase() + path.slice(1),
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 3,
        borderRadius: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography color="text.primary" key={crumb.path}>
              {crumb.name}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={crumb.path}
              key={crumb.path}
              color="inherit"
              underline="hover"
            >
              {crumb.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Paper>
  );
};

export default BreadcrumbsComponent;

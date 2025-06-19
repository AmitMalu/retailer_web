import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
} from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as DmtIcon,
  Receipt as BbpsIcon,
  PhoneIphone as RechargeIcon,
  AccountBalance as PayoutIcon,
  Assessment as ReportsIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { ServiceItem } from "@/Common/interface";

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const theme = useTheme();

  useEffect(() => {
    // In a real app, we would dispatch the fetchProducts action
    // For now, we'll just use the mock data that's already in the store
    // dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockColor = (quantity: number) => {
    if (quantity > 100) return "success";
    if (quantity > 50) return "info";
    if (quantity > 20) return "warning";
    return "error";
  };

  const services: ServiceItem[] = [
    {
      id: "pg",
      name: "PG",
      icon: <WalletIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.primary.main,
    },
    {
      id: "dmt",
      name: "DMT",
      icon: <DmtIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.secondary.main,
    },
    {
      id: "bbps",
      name: "BBPS",
      icon: <BbpsIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.success.main,
    },
    {
      id: "recharge",
      name: "RECHARGE",
      icon: <RechargeIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.warning.main,
    },
    {
      id: "payout",
      name: "PAYOUT",
      icon: <PayoutIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.error.main,
    },
    {
      id: "reports",
      name: "REPORTS",
      icon: <ReportsIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.info.main,
    },
  ];

  if (loading === "pending") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {services.map((service, index) => {
            // Different shapes for different services
            const shapes = [
              {
                clipPath:
                  "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)", // Pentagon
                transform: "rotate(0deg)",
              },
              {
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Hexagon
                transform: "rotate(0deg)",
              },
              {
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Hexagon
                transform: "rotate(30deg)",
              },
              {
                clipPath:
                  "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)", // Pentagon
                transform: "rotate(180deg)",
              },
              {
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", // Hexagon
                transform: "rotate(-30deg)",
              },
              {
                clipPath: "circle(50% at 50% 50%)", // Circle
                transform: "rotate(0deg)",
              },
            ][index % 6];

            return (
              <></>
              // <Grid
              //   component="div"
              //   xs={6}
              //   sm={4}
              //   md={2}
              //   key={service.id}
              //   sx={{
              //     display: "flex",
              //     justifyContent: "center",
              //     alignItems: "center",
              //     p: 1,
              //   }}
              // >
              //   <Paper
              //     elevation={0}
              //     sx={{
              //       p: 2,
              //       display: "flex",
              //       flexDirection: "column",
              //       alignItems: "center",
              //       justifyContent: "center",
              //       height: 180,
              //       width: "100%",
              //       maxWidth: 160,
              //       borderRadius: 4,
              //       background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`,
              //       border: `1px solid ${service.color}20`,
              //       transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              //       position: "relative",
              //       overflow: "hidden",
              //       "&:hover": {
              //         transform: "translateY(-8px) scale(1.02)",
              //         boxShadow: `0 8px 24px ${service.color}33`,
              //         "&::before": {
              //           transform: "scale(1.2)",
              //           opacity: 0.3,
              //         },
              //       },
              //       "&::before": {
              //         content: '""',
              //         position: "absolute",
              //         width: "150%",
              //         height: "150%",
              //         background: `radial-gradient(circle, ${service.color}20 0%, transparent 70%)`,
              //         transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              //         opacity: 0,
              //       },
              //     }}
              //   >
              //     <Box
              //       sx={{
              //         width: 72,
              //         height: 72,
              //         borderRadius: "50%",
              //         background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}30 100%)`,
              //         display: "flex",
              //         alignItems: "center",
              //         justifyContent: "center",
              //         mb: 2,
              //         position: "relative",
              //         zIndex: 1,
              //         "&::before": {
              //           content: '""',
              //           position: "absolute",
              //           inset: 0,
              //           borderRadius: "50%",
              //           padding: "2px",
              //           background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}80 100%)`,
              //           WebkitMask:
              //             "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              //           WebkitMaskComposite: "xor",
              //           maskComposite: "exclude",
              //           pointerEvents: "none",
              //         },
              //       }}
              //     >
              //       <Box
              //         sx={{
              //           width: "100%",
              //           height: "100%",
              //           display: "flex",
              //           alignItems: "center",
              //           justifyContent: "center",
              //           ...shapes,
              //           background: `linear-gradient(135deg, ${service.color}10 0%, ${service.color}05 100%)`,
              //           transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              //         }}
              //       >
              //         {React.cloneElement(service.icon as React.ReactElement, {
              //           sx: {
              //             fontSize: 32,
              //             color: service.color,
              //             transform: `rotate(${shapes.transform === "rotate(0deg)" ? "0" : `-${shapes.transform.match(/-?\d+/)?.[0] || 0}deg`})`,
              //           },
              //         })}
              //       </Box>
              //     </Box>
              //     <Box
              //       sx={{
              //         position: "relative",
              //         zIndex: 1,
              //         textAlign: "center",
              //         "&::after": {
              //           content: '""',
              //           position: "absolute",
              //           bottom: -8,
              //           left: "50%",
              //           transform: "translateX(-50%)",
              //           width: 24,
              //           height: 3,
              //           background: service.color,
              //           borderRadius: 3,
              //           opacity: 0,
              //           transition: "all 0.3s ease",
              //         },
              //         "&:hover::after": {
              //           opacity: 1,
              //           width: 40,
              //         },
              //       }}
              //     >
              //       <Typography
              //         variant="subtitle2"
              //         sx={{
              //           fontWeight: 700,
              //           color: "text.primary",
              //           textTransform: "uppercase",
              //           fontSize: "0.7rem",
              //           letterSpacing: "0.1em",
              //           background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}80 100%)`,
              //           WebkitBackgroundClip: "text",
              //           WebkitTextFillColor: "transparent",
              //           transition: "all 0.3s ease",
              //         }}
              //       >
              //         {service.name}
              //       </Typography>
              //     </Box>
              //   </Paper>
              // </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          },
          gap: 3,
        }}
      ></Box>

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}
    </Box>
  );
}

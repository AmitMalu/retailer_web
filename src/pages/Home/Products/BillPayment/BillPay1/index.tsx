// import React from "react";

// const BillPayOneScreen = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const row1 = [
//     {
//       id: 1,
//       image: <BillPaymentSvgIcon color={theme.palette.red.DEFAULT} />,
//       title: "BBPS1",
//       onClick: () => {
//         navigate(`/products/aepsScreen/vendors/cashWithdrawal`);
//       },
//     },
//     {
//       id: 2,
//       image: <BillPaymentSvgIcon color={theme.palette.red.DEFAULT} />,
//       title: "BILLPAY 2",
//       onClick: () => {},
//     },
//   ];

//   return (
//     <>
//       <UnstyledButton
//         onClick={() => {
//           navigate(`/products`);
//         }}
//       >
//         <BackSvgIcon color={theme.palette.red.DEFAULT} />
//       </UnstyledButton>
//       <div className="mx-auto py-10 px-4 text-center relative">
//         <TextComponent fontSize={28} fontWeight={600} color={"primary"}>
//           Bharat Bill Payment System
//         </TextComponent>

//         <div className="flex justify-center gap-28 my-12">
//           {row1.map((product) => (
//             <BbpsCard
//               key={product.id}
//               image={product.image}
//               title={product.title}
//               onClick={product.onClick}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BillPayOneScreen;

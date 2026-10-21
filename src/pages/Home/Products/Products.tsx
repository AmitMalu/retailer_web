import PGSvgIcon from "@/assets/svg/Products/PgIcon";
import PayoutSvgIcon from "@/assets/svg/Products/PayoutIcon";
import DMTSvgIcon from "@/assets/svg/Products/DmtIcon";
import RechargeSvgIcon from "@/assets/svg/Products/Recharge";
import BillPaymenstSvgIcon from "@/assets/svg/Products/BillPayments";
import { IconArrowRight, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/system";
import { AepsCardSvgIcon } from "@/assets/svg/Products/AepsSvgIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import React from "react";
import { showErrorNotification } from "@/Utils/notifications";

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const bbpsBillAvenueSubProduct = React.useMemo(() => {
    const bbps = loginData?.products?.find(
      (p: any) => p.productName?.toUpperCase() === "BBPS"
    );

    if (!bbps) return null;

    const billAvenueSubProduct = bbps.subProducts?.find((sp: any) =>
      sp.vendorName?.toLowerCase().includes("avenue") ||
      sp.vendorName?.toLowerCase().includes("bill")
    );

    if (!billAvenueSubProduct) return bbps;

    return billAvenueSubProduct;
  }, [loginData]);

  const productStatusMap = React.useMemo(() => {
    const map: Record<string, any> = {};

    loginData?.products?.forEach((p: any) => {
      map[p.productName.toUpperCase()] = {
        isVisible: p.isVisible,
        blocked: p.blocked,
        active: p.active,
        subProducts: p.subProducts || [],
      };
    });

    return map;
  }, [loginData]);

  const handleProductClick = (productKey: string, route: string) => {
    const status = productStatusMap[productKey];

    if (!status) return;

    if (status.blocked) return;

    if (!status.active) {
      showErrorNotification(
        "This product is currently inactive. Please contact support for more information."
      );
      return;
    }

    if (!status.subProducts || status.subProducts.length < 1) {
      showErrorNotification(
        "No Scheme Found For You on this Product."
      );
      return;
    }

    navigate(route);
  };



  const row1: any = [
    {
      id: 1,
      key: "PAYMENT GATEWAY",
      image: <PGSvgIcon />,
      title: "Payment Gateway",
      route: "/products/pgScreen"
    },
    {
      id: 2,
      key: "PAYOUT",
      image: <PayoutSvgIcon />,
      title: "Payout",
      route: `/products/payoutScreen`,
    },
    {
      id: 3,
      key: "DMT",
      image: <DMTSvgIcon />,
      title: "DMT",
      route: `/products/dmt`,
    },
  ];

  const row2: any = [
    // {
    //   id: 4,
    //   key: "MPOS",
    //   image: <RechargeSvgIcon color={theme.palette.background.paper} />,
    //   title: "MPOS",
    //   route: `/products/mpos`,
    // },
    {
      id: 4,
      key: "RECHARGE",
      image: <RechargeSvgIcon />,
      title: "Recharge",
      route: `/products/recharge`,
    },
    {
      id: 5,
      key: "AEPS",
      image: <AepsCardSvgIcon />,
      title: "AEPS",
      route: "/products/aeps"
    },
  ];

  const row3: any = [
    {
      id: 6,
      key: "BBPS",
      image: <BillPaymenstSvgIcon />,
      title: "Credit Card",
      route: "/products/credit-card"
    },
    {
      id: 7,
      key: "BBPS",
      image: <BillPaymenstSvgIcon />,
      title: "Bill Payment",
      route: "/products/billPay"
    },
    {
      id: 8,
      key: "CMS",
      image: <PGSvgIcon />,
      title: "CMS",
      route: ""
    }
  ];

  const descriptions: Record<string, string> = {
    "Payment Gateway": "Collect payments by card, UPI and net banking",
    Payout: "Send money instantly to any bank account",
    DMT: "Domestic money transfer for walk-in customers",
    Recharge: "Mobile, DTH and data card recharges",
    AEPS: "Aadhaar cash withdrawal, balance and statements",
    "Credit Card": "Pay credit card bills for any bank",
    "Bill Payment": "Electricity, water, gas and other BBPS bills",
    CMS: "Cash management and loan EMI collections",
  };

  // Same visibility / blocked rules as before, flattened into one list for the grid
  const visibleProducts = [...row1, ...row2, ...row3].flatMap((product: any) => {
    const status = productStatusMap[product.key];
    if (!status?.isVisible) return [];

    const isCreditCard = product.title === "Credit Card";
    const subProduct = bbpsBillAvenueSubProduct;
    if (isCreditCard && !subProduct?.isVisible) return [];

    const isDisabled = status?.blocked || (isCreditCard && subProduct?.blocked);
    return [{ ...product, isDisabled }];
  });

  return (
    <div style={{ scrollbarWidth: "none" }} className="w-full max-w-[1200px] mx-auto py-2">
      <div className="mb-6">
        <h1 className="text-[24px] font-extrabold tracking-tight" style={{ color: theme.palette.text.primary }}>
          Services
        </h1>
        <p className="mt-1 text-sm text-slate-500">Choose a service to start a transaction.</p>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No products are enabled for your account yet. Please contact support.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleProducts.map((product: any) => (
            <button
              key={product.id}
              type="button"
              disabled={product.isDisabled}
              onClick={() => {
                if (product.isDisabled) return;
                handleProductClick(product.key, product.route);
              }}
              className="group relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl [&_svg]:max-h-9 [&_svg]:max-w-9"
                style={{ backgroundColor: theme.palette.primary.main + "14", color: theme.palette.primary.main }}
              >
                {React.isValidElement(product.image)
                  ? React.cloneElement(product.image as React.ReactElement<{ color?: string }>, { color: theme.palette.primary.main })
                  : product.image}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[16px] font-bold text-slate-900">{product.title}</div>
                  {product.isDisabled ? (
                    <IconLock size={16} className="text-slate-400" />
                  ) : (
                    <IconArrowRight
                      size={18}
                      className="text-slate-300 transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </div>
                <div className="mt-1 text-[13px] leading-snug text-slate-500">
                  {product.isDisabled ? "Currently unavailable" : descriptions[product.title]}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import ProductSubProductsScreen from "../ProductSubProductsScreen";
import RechargeSvgIcon from "@/assets/svg/Products/Recharge";

export default function DmtSubProductsScreen() {
    return (
        <ProductSubProductsScreen
            productKey="recharge"
            title="RECHARGE"
            Icon={RechargeSvgIcon}
            routeBuilder={(id) => `/products/recharge/${id}`}
        />
    );
}
import { TextInputProps } from "@mantine/core";
import { ReactNode, ChangeEvent, MouseEventHandler } from "react";

export type LayoutType = "default" | "compact" | "wide";
export type ColorScheme = "blue" | "green" | "purple" | "orange" | "teal";
export type NavbarPosition = "fixed" | "static";
export type SidebarStyle = "full" | "compact" | "closed";
export type LayoutVariant = "standard" | "horizontal" | "minimal" | "footer";
export type ThemeOption =
  | "default"
  | "corporate"
  | "creative"
  | "elegant"
  | "playful"
  | "minimal"
  | "dark"
  | "mutedTeal";

export type ThemeColors = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  paper: string;
  blackColor: string;
  textPrimary: string;
  textSecondary: string;
  navBackground: string;
  lightGray: string;
  headLine: string;
  placeholder: string;
  authButtonBg: string;
  authBackground: string;
  redLightText: string;
  red: string;
  redLight: string;
  redDark: string;
  grayDefault: string;
  grayLight: string;
  grayDark: string;
  greenDefault: string;
  greenLight: string;
};

export type SettingsState = {
  layout: LayoutType;
  colorScheme: ColorScheme;
  navbarPosition: NavbarPosition;
  sidebarStyle: SidebarStyle;
  layoutVariant: LayoutVariant;
  themeOption: ThemeOption;
  isSettingsOpen: boolean;
};

export type CustomError = {
  status?: number;
  message?: string;
  data?: any;
};

export type BaseLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
};

export type FooterLayoutProps = {
  children: React.ReactNode;
};

export type HorizontalLayoutProps = {
  children: React.ReactNode;
};

export type MinimalLayoutProps = {
  children: React.ReactNode;
};

export type StandardLayoutProps = {
  children: React.ReactNode;
};

export type NavbarProps = {
  onMenuClick: () => void;
  isMobile: boolean;
};

export type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export type ReduxProviderProps = {
  children: ReactNode;
};

export type ThemePreviewProps = {
  themeKey: ThemeOption;
  selected: boolean;
  onClick: () => void;
  darkMode: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

export type ThemeComparisonProps = {
  currentTheme: ThemeOption;
  darkMode: boolean;
};

export type ThemeShowcaseProps = {
  title?: string;
};

export type ApiState = {
  responses: { [key: string]: any };
};

export type UserRole = "RT" | "DT" | "SD" | "WL" | "PT" | "RA";

export type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
};

export type MenuItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
  roles?: UserRole[]; // If not specified, accessible to all roles
  subItems?: MenuItem[];
  hidden?: boolean; // Optional flag to hide menu item
};

export const SAVE_API_RESPONSE = "SAVE_API_RESPONSE";
export const CLEAR_API_RESPONSE = "CLEAR_API_RESPONSE";
export const CLEAR_ALL_RESPONSES = "CLEAR_ALL_RESPONSES";
export const SET_CURRENT_ROUTE = "route/SET_CURRENT_ROUTE";

export type SaveApiResponseAction = {
  type: typeof SAVE_API_RESPONSE;
  payload: { key: string; data: string | object };
};

export type ClearApiResponseAction = {
  type: typeof CLEAR_API_RESPONSE;
  payload: string;
};

export type ClearAllResponsesAction = {
  type: typeof CLEAR_ALL_RESPONSES;
};
export interface SetCurrentRouteAction {
  type: typeof SET_CURRENT_ROUTE;
  payload: string;
}

export type ApiActionTypes =
  | SaveApiResponseAction
  | ClearApiResponseAction
  | ClearAllResponsesAction
  | SetCurrentRouteAction;

export type CustomTextInputProps = Omit<
  TextInputProps,
  "error" | "onChange" | "onBlur"
> & {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  leftSection?: React.ReactElement;
  rightSection?: React.ReactElement;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  radius?: string;
  variant?: "default" | "filled" | "unstyled";
  withAsterisk?: boolean | false;
  isAuth?: boolean;
};

export type CustomTextProps = {
  fontSize?: string | number;
  fontWeight?: number | string;
  color?: string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  truncate?: boolean;
  lineClamp?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
  fontFamily?: string;
  [key: string]: any;
};

export type ButtonComponentProps = {
  title: string;
  onClick?: () => void;
  variant?: "filled" | "outline" | "light" | "gradient";
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  radius?: number;
  color?: string;
  fontSize?: number;
  isAuth?: boolean;
  width?: string | number;
};

export type CustomDatePickerProps = {
  label?: string;
  placeholder?: string;
  value: Date | [Date | null, Date | null] | null; // Accepts either a single date or a range
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
  // value?: Date | null; // Ensure this is Date or null
  // onChange?: (value: Date | null) => void; // Change to accept Date or null
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  radius?: string;
  variant?: "default" | "filled" | "unstyled";
  withAsterisk?: boolean | false;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
  autoComplete?: string;
  type?: "default" | "range";
  defaultDate?: boolean;
  onShortcutSelect?: (start: Date | null, end: Date | null) => void;
  dateFormat?: "DD-MM-YYYY" | "YYYY-MM-DD";
  customButtons?: boolean;
  inputMode?: "picker" | "manual" | "both";
};
export interface CustomDropdownProps {
  label?: string;
  data: Array<string | { label: string; value: string | number }>;
  value?: string | number | string[] | number[];
  onChange?: (value: string | number | string[] | number[]) => void;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  withAsterisk?: boolean;
  multiple?: boolean;
  className?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export type customFileinputProps = {
  label?: string;
  placeholder?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string | boolean;
  disabled?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  withAsterisk?: boolean | false;
  accept?: string;
};

export type DynamicModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  content: React.ReactNode;
  ButtonTitle?: string;
  onClick?: () => void;
};

export type TimeComponentProps = {
  value?: string;
  onChange?: (value: string) => void;
  withSeconds?: boolean;
  maxTime?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export type TableColumn = {
  key: string;
  label: string | JSX.Element;
  render?: (
    value: any,
    index: number,
    row: Record<string, any>
  ) => React.ReactNode;
  searchKey?: string;
  sortable?: boolean;
  searchable?: boolean;
  type?: string;
  align?: "left" | "center" | "right";
};

export type TableProps = {
  data: Record<string, any>[];
  columns: TableColumn[];
  height?: number;
  caption?: string;
  onSelectRow?: (row: Record<string, any>) => void;
  onCurrentPageData?: (data: Record<string, any>[]) => void;
  onSearch?: (columnKey: string, value: string) => void;
  showSearch?: boolean;
  keyField?: string;
  page?: number;
  size?: number;
  onPageChange?: (size: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export type CustomTextareaProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "outlined" | "filled" | "standard";
  withAsterisk?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  helperText?: string;
  showCharacterCount?: boolean;
};

export type AuthLayoutProps = {
  children: React.ReactNode;
  authImage?: React.ReactNode;
  authText?: string;
};

export type TokenGenerationRequest = {
  userName: string;
};

export type VerifyTokenRequest = {
  token: string;
  hierarchyType: string;
};

export type LoginRequest = {
  userName: string;
  password: string;
  url: string;
};

export type SignUpRequest = {
  userName: string;
  name: string;
};

export type SetPasswordRequestProps = {
  userName: string;
  newPassword: string;
  reEnteredPassword: string;
};

export type ChangePasswordRequestProps = {
  userName: string;
  otp: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  step: string;
};

export type ForgotPasswordRequestProps = {
  userName: string;
};

export type OtpRequestProps = {
  otp: string;
  userName: string;
};

export type ResendOtpRequestProps = {
  userName: string;
};

export type ProductCardProps = {
  image: React.ReactNode;
  title: string;
  fill: boolean;
  onClick: () => void;
};

export type FundRequestProps = {
  depositType: string;
  transactionId: string;
  bankName: string;
  bankAccountNumber: string;
  amount: string;
  confirmAmount: string;
  depositDate: string;
  narration: string;
  depositSlip: File | string | null;
  bankAccountHolderName: string;
  paymentMode: string;
};

export type FundTransferProps = {
  fromHierarchyId: string;
  toHierarchyId: string;
  amount: string;
  confirmAmount: string;
  fromWalletType: string;
  toWalletType: string;
  narration: string;
};

export type WalletToBankProps = {
  requesterHierarchyId: string;
  walletBalance?: string;
  selectBank: string;
  TransactionType: string;
  amount?: string;
  confirmAmount?: string;
};

export type FundReversalProps = {
  parentHierarchyId: string;
  childHierarchyId: string;
  walletType: string;
  reversalAmount: string;
  confirmAmount?: string;
  narration?: string;
};

export type WalletToWalletProps = {
  hierarchyId: string;
  transferAmount: string;
  confirmAmount: string;
  walletTypeFrom: string;
  walletTypeTo: string;
};

export type ChildMemberListProps = Record<string, any>;

export type UserProfileFormProps = {
  title: string;
  mobileNumber: string;
  emailId: string;
  parentAccount: string;
  name: string;
  aadhaarNumber: string;
  panNumber: string;
  shopNumber: string;
  businessNumber: string;
  dob: Date | null;
  mainAddress: string;
  city: string;
  state: string;
  addessZipCode: string;
  outletName: string;
  outletAddresses: string;
  outletCity: string;
  outletState: string;
  outletZipCode: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  branchName: string;
  createdBy: string;
  createdByIPAddress: string;
  aadhaarCardFrontImage: File | null;
  aadhaarCardBackImage: File | null;
  panCardImage: File | null;
  shopImage: File | null;
  businessProofImage: File | null;
};

export type PendingPartnerActivationData = Record<string, any>;

export type PartnerRegistrationModalProps = {
  opened: boolean;
  onClose: () => void;
  rowData?: PendingPartnerActivationData;
  openedAs?: string;
};

export type ViewUserProps = {
  network: string;
  userID: string;
  userName: string;
  mobileNumber: string;
  emailId: string;
  status: string;
  isBlocked: boolean;
};

export type ViewUserList = Record<string, any>;

export type ColumsSelectionModalProps = {
  open: boolean;
  onClose: () => void;
  data: any[];
  setVisibleColumns: (columns: string[]) => void;
  visibleColumns: string[];
};

export type ViewUserAPIProps = {
  search?: string;
};

export type TicketingSystemProps = {
  transactionId: string;
  issueType: string;
  description: string;
  subProductName: string;
  email: string;
  mobileNumber: string;
  screenshotImage: File | null;
};

export type MyBanksList = Record<string, any>;
export type KycDocList = Record<string, any>;
export type UserProfileData = Record<string, any>;
export type CommissionData = Record<string, any>;

export type CommissionAndChargesParams = {
  fromDate: Date | string | null;
  toDate: Date | string | null;
  hierarchyId: string;
  walletType: string;
  subProductName: string;
  reportType: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type WalletParams = {
  hierarchyId: string;
  fromDate: Date | string | null;
  toDate: Date | string | null;
  subProductName: string;
  walletType: string;
  status: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type WalletData = Record<string, any>;

export type NetworkTransactionParams = {
  loginHierarchyId: string;
  fromDate: Date | string | null;
  toDate: Date | string | null;
  subProductName: string;
  partnerId: string;
  whitelabelId: string;
  superDistributorId: string;
  distributorId: string;
  retailerId: string;
  status: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type NetworkTransactionData = Record<string, any>;

export type TransactionDetailsParams = {
  transactionId: string;
  hierarchyId: string;
};

export type TransactionDetailsData = Record<string, any>;
export type PartnersData = Record<string, any>;
export type DistributorsData = Record<string, any>;
export type RetailersData = Record<string, any>;

export type PGFormBodyProps = {
  cardType?: string;
  cardBinNo: string;
  paymentMethod?: string;
  cardHolderName?: string;
  cardHolderMobileNumber: string;
  amount: string;
  confirmAmount?: string;
  narration?: string;
  productId: string;
  subProductId: string;
};

export type FetchCardBinDetailProps = { cardType?: string; cardBinNo: string };
export type ValidateTransactionProps = {
  cardBinNo: string;
  cardHolderMobileNumber: string;
  amount: string;
  productId: string;
};
export type CreateOrderProps = {
  amount: string;
  callbackUrl: string;
  productId: string;
  subProductId: string;
};

export type PayoutBankDetails = Record<string, any>;

export type PayoutFormBodyProps = {
  bank: string;
  ifscCode: string;
  accountNumber: string;
  accountName: string;
};

export type AepsFormBodyProps = {
  mobileNumber: string;
  aadhaarNumber: string;
  amount: string;
  bank: string;
  deviceType: string;
  csp: string;
  alert: boolean;
};

export type TwoFAFormBodyProps = {
  aadhaarNumber: string;
  deviceType: string;
  csp: string;
};

export type FindRemitterProps = {
  mobileNumber: string;
  name?: string;
  dob?: string;
  page: number;
  size: number;
};

export type RemitterData = Record<string, any>;

export type RemitterInfoData = Record<string, any>;

export type EditRemitterProps = {
  name: string;
  address: string;
  otp?: string;
};

export type AddBeneficiaryFormProps = {
  fullName: string;
  bankName: string;
  bankAccountNumber: string;
  confirmBankAccountNumber: string;
  ifscCode: string;
};

export type RegisterRemitterFormProps = {
  aadhaarNumber: string;
  mobileNumber: string;
  otp?: string;
};

export type RemitterEkycFormProps = {
  device: string;
  csp: boolean;
  alert: boolean;
};

export type MposBodyProps = {
  cardType?: string;
  cardBinNo: string;
  paymentMethod?: string;
  cardHolderName?: string;
  cardHolderMobileNumber: string;
  amount: string;
  confirmAmount?: string;
  narration?: string;
  productId: string;
  subProductId: string;
};

export type SubuserCreationProps = {
  parentAccount: string;
  name: string;
  mobileNumber: string;
  username: string;
  password: string;
  emailId: string;
  emailVerified: boolean;
  dob: Date | string | null;
  add: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdBy: string;
  createdByIPAddress: string;
  role_id: string;
  subRoleId: string;
};

export type PayoutSaveBeneficiaryProps = {
  retailerId: string;
  bankName: string;
  bankHolderName: string;
  accountNumber: string;
  ifscCode: string;
  createdBy: string;
};

export type PayoutSendBeneficiaryProps = {
  retailerId: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
  beneficiaryName: string;
  paymentMode: string;
  subProductId: string;
  callbackurl: string;
};

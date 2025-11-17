import { TextInputProps } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
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

export type UserRole = "RT" | "DT" | "SD" | "WL" | "PT" | "RU";

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
  rightSection?: React.ReactElement | null;
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
  allowNumber?: boolean;
  allowDecimal?: boolean;
  decimalPlaces?: number;
  allowCharacter?: boolean;
  allowSpecialChar?: boolean;
  allowSpace?: boolean;
  allowedChars?: string;
  capitalize?: boolean;
  size?: "medium" | "small";
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
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "small" | "medium" | "large";
  fullWidth?: boolean;
  radius?: number;
  color?: string;
  fontSize?: number;
  isAuth?: boolean;
  width?: string | number;
  height?: string | number;
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
  allowDeselect?: boolean;
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

export type subProductObjType = {
  schemeCode: string;
  subProductName: string;
  subProductId: string;
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

export type GenericTableHeader<T> = {
  key: keyof T;
  label?: string;
  filterType?: "text" | "number" | "boolean" | "date" | "time" | "none";
  filterOptions?: { label: string; value: any }[];
  searchable?: boolean; // optionally override with this
  renderType?: "link" | "custom" | "statusBadge"; //
  copyable?: boolean;
};

export type FetchListParams = {
  key: string;
  url: string;
  page?: number;
  size?: number;
  filter?: Record<string, any> | null;
  method?: "GET" | "POST";
  payload?: any;
  skipPagination?: Boolean;
  returnFullData?: Boolean;
  sendPaginationIn?: "params" | "body";
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
  disableSearch?: boolean;
  type?: "text" | "date" | "time" | "dropdown" | "number" | "boolean";
  options?: { value: string; label: string }[];
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
  searchTrigger?: "change" | "enter";
  showSearch?: boolean;
  keyField?: string;
  page?: number;
  size?: number;
  onPageChange?: (size: number) => void;
  onPageSizeChange?: (size: number) => void;
  serverSide?: boolean;
  totalRecords?: number; // required only when serverSide = true
  enablePagination?: boolean;
  onAddRow?: () => void; // If defined → show Add Row; if undefined → hide
  addRowLabel?: string; // Optional text for Add Row
  addRowIcon?: React.ReactNode; // Optional icon for Add Row
  showNoDataFound?: boolean; // Show "No data found" when data is empty
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
  size?: number | { base: number; md?: number; lg?: number };
};

export type FundRequestProps = {
  depositType: string;
  transactionId: string;
  bankName: string;
  bankAccountNumber: string;
  amount: string;
  confirmAmount: string;
  depositDate: DateValue;
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
  walletType: string;
  retailerId: string;
  selectBank: string;
  // accountNumber: string;
  // ifscCode: string;
  amount: string;
  confirmAmount: string;
  // beneficiaryName: string;
  paymentMode: string;
  // subProductId: string;
};

export type WalletToBankRequest = {
  retailerId: string;
  accountNumber: string;
  ifscCode: string;
  amount: string;
  beneficiaryName: string;
  paymentMode: string;
  subProductId: string;
};

export type FundReversalFormType = {
  parentHierarchyId: string;
  childHierarchyId: string;
  walletType: string;
  reversalAmount: string;
  confirmAmount?: string;
  remark?: string;
  otp?: string;
  isResendOtp?: boolean;
  fundReversalRequestId?: string;
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
  lastVerifiedAadhaar: string | null;
  isAadhaarVerified: boolean;
  panNumber: string;
  lastVerifiedPan: string | null;
  panVerified: boolean;
  aadhaarPanVerified: boolean;
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
  bankHolderName: string;
  isBankVerified: boolean;
  branchName: string;
  createdBy: string;
  createdByIPAddress: string;
  longitude: number | null;
  latitude: number | null;
  aadhaarCardFrontImage: File | null;
  aadhaarCardBackImage: File | null;
  panCardImage: File | null;
  shopImage: File | null;
  businessProofImage: File | null;
  emailVerified: boolean;
  gstNumberVerified: boolean;
};

export type PendingPartnerActivationData = Record<string, any>;

export type PartnerRegistrationModalProps = {
  opened: boolean;
  onClose: () => void;
  rowData?: PendingPartnerActivationData;
  openedAs?: string;
  productId?: string;
  subProductId?: string;
};

export type AddBankFormProps = {
  opened: boolean;
  onClose: () => void;
};

export type AddBankFormType = {
  hierarchyId: string;
  bankName: string;
  isVerified: boolean;
  bankHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
  createdBy: string;
};

export type EditBankFormType = {
  id: string;
  hierarchyId: string;
  bankName: string;
  isVerified: boolean;
  bankHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
  createdBy: string;
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
  page?: string;
  size?: string;
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
  // fromDate: Date | string | null;
  // toDate: Date | string | null;
  dateRange: DatesRangeValue;
  hierarchyType: string;
  hierarchyId: string;
  productId: string;
  walletType: string;
  reportType: string;
  [key: string]: any;
};

export interface CommissionAndChargesRequest {
  fromDate: string | null;
  toDate: string | null;
  hierarchyType: string;
  hierarchyId: any;
  walletType: string;
  productId: string;
  reportType: string;
}

export type WalletParams = {
  hierarchyId: string;
  dateRange: DatesRangeValue;
  subProductName: string;
  walletType: string;
  status: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type WalletRequest = {
  fromDate: string | null;
  toDate: string | null;
  hierarchyId: string;
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
  dateRange: DatesRangeValue;
  partnerId: string;
  whitelabelId: string;
  superDistributorId: string;
  distributorId: string;
  retailerId: string;
  reportType: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type WalletReportParams = {
  dateRange: DatesRangeValue;
  hierarchyType: string;
  hierarchyId: string;
  productId: string;
  walletType: string;
  status: string;
  [key: string]: any;
};

export type PendingTransactionParams = {
  dateRange: DatesRangeValue;
  productId: string | number;
  subProductId: string | number;
  walletType: string;
  tranStatus: string;
  [key: string]: any;
};

export type DebitHistoryParams = {
  dateRange: DatesRangeValue;
  hierarchyType: string;
  hierarchyId: string;
  walletType: string;
  [key: string]: any;
};

export type DownlineBalanceParams = {
  dateRange: DatesRangeValue;
  [key: string]: any;
};

export interface SearchTransReportTableType {
  transactionId: string;
  hierarchyId: string;
  walletType: string;
  balBefore: number;
  amount: number;
  balAfter: number;
  subProductName: string | null;
  narration: string | null;
  status: string;
  date: string;
  time: string;
}

export interface SearchTransReportData {
  transactionDetails: SearchTransReportTableType[];
  walletDetails: SearchTransReportTableType[];
}

export type NetworkTransactionRequest = {
  loginHierarchyId: string;
  fromDate: string | null;
  toDate: string | null;
  subProductName: string;
  partnerId: string;
  whitelabelId: string;
  superDistributorId: string;
  distributorId: string;
  retailerId: string;
  // status: string;
  reportType: string;
  page: number;
  size: number;
  [key: string]: any;
};

export type NetworkTransactionData = Record<string, any>;

export type TransactionDetailsParams = {
  transactionId: string;
  hierarchyId: string;
};

export type RaisedTicketParams = {
  page?: number | string; // optional, 0-indexed
  size?: number | string;
  raisedBy?: string;
  [key: string]: any; // additional filters
};

export type PayoutBankDetailsParams = {
  page?: number | string; // optional, 0-indexed
  size?: number | string;
  [key: string]: any; // additional filters
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
  // callbackUrl: string;
  productId: string;
  subProductId: string;
  initiatedBy?: string;
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
  // dob?: string;
  aadhaarNumber?: string;
  otp?: string;
};

export interface RemitterModalProps {
  isOpen: boolean;
  onClose: (source: "icon" | "button") => void;
  modelMode: "ekyc" | "register" | null;
  isNewRemitter: boolean;
  handleRemitterKyc: (values: any) => void;
  handleRegisterRemitterSubmit: (values: any) => void;
}

export type RemitterData = Record<string, any>;

export type RemitterInfoData = Record<string, any>;

export type EditRemitterProps = {
  name: string;
  address: string;
  otp?: string;
};

export type AddBeneficiaryFormProps = {
  // mobileNumber: string;
  beneficiaryName: string;
  bankId: string;
  accountNumber: string;
  ifscCode: string;
  verified: string | undefined;
  gstState: string;
  dob: Date | null;
  address: string;
  pincode: string;
};

export type AddBeneficiaryPayload = {
  mobile: string;
  benename: string;
  bankid: string;
  accno: string;
  ifsccode: string;
  verified: string; // "0" or "1"
  gst_state: string;
  dob: string | null;
  address: string;
  pincode: string;
  subProductId: string;
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

export type FetchSubUserRequest = {
  page?: number | string; // optional, 0-indexed
  size?: number | string;
  [key: string]: any; // additional filters
};

export type SubuserCreationProps = {
  parentAccount: string;
  name: string;
  mobileNumber: string;
  username: string;
  password: string;
  emailId: string;
  emailVerified: boolean;
  lastVerifiedEmail?: string | null;
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

export type EditBeneficiaryBankRequest = {
  id: string | number;
  hierarchyId: string;
  bankName: string;
  bankHolderName: string;
  bankAccountNumber: string;
  ifscCode: string;
  isVerified: boolean;
  createdBy: string;
};

export type PayoutSendBeneficiaryProps = {
  retailerId: string;
  accountNumber: string;
  ifscCode: string;
  amount: string | number | null;
  beneficiaryName: string;
  paymentMode: string;
  subProductId: string;
  schemeCode: string;
  // callbackurl: string;
};

export type FetchBillDetailsProps = {
  subProductId: string;
  provider: string;
  billerNumber?: string;
  field_one?: string;
  customerMobileNumber: string;
  dob?: Date | null;
  field_two?: string;
  field_three?: string;
  field_four?: string;
};

export type TransactionProps = {
  retailerId: string;
  subProductId: string;
  number: string; // Biller number / Consumer Number
  provider: string | number; // provider id
  amount: string | number;
  context?: string;
  bill_due_date?: string;
  consumerNumber: string | number; // Customer Number
  field_one?: string;
  field_two?: string;
  field_three?: string;
  field_four?: string;
};

export type BankVerificationRequest = {
  id_number: string;
  ifsc: string;
  ifsc_details: boolean;
};

export type ExtraParamContent = {
  name: string;
  value?: string;
};

export type ExtraParam = {
  field_one?: string;
  field_two?: string;
  field_three?: string;
  field_four?: string;
  extraparam_content?: ExtraParamContent[];
  [key: string]: any;
};

export type ProviderDetails = {
  provider_id: string;
  provider_name: string;
  service_name: string;
  consumerNumber?: string;
  extra_param?: ExtraParam[];
  _numeric?: boolean;
  min_length?: number;
  max_length?: number;
  [key: string]: any;
};

export type FormValues = {
  provider: string;
  consumerNumber?: string;
  [key: string]: any;
};

//////////////////////////REPORTS//////////////////////////////
export interface NetworkTransactionTableType {
  tranxId: string;
  subProductName: string;
  balBefore: string;
  amount: string;
  balAfter: string;
  actionOnBalanceAmount: string;
  status: string;
  transactionDate: number;
  transactionTime: number;
  narration: string;
}

export interface PendingTransactionTableType {
  txId: string;
  userId: string;
  subProductName: string;
  vendor: string | null;
  schemeName: string | null;
  mobileNo: string | null;
  amount: number;
  txStatus: string;
  txType: string | null;
  remarks: string | null;
  medium: string | null;
  dateOfTransaction: string; // e.g. "2025-10-14"
  timeOfTransaction: string; // e.g. "18:14:18.35"
  updatedAt: string | null;
  updatedDateOfTransaction: string | null;
  updatedTimeOfTransaction: string | null;
}

export interface WalletReportTableType {
  tranxId: string;
  subProductName: string;
  balBefore: string;
  amount: string;
  balAfter: string;
  actionOnBalanceAmount: string;
  status: string;
  transactionDate: number;
  transactionTime: number;
  narration: string;
}

export interface CommissionAndChargeTableType {
  txId: string;
  subProductName: string;
  walletType: string;
  txType: string;
  operator: string;
  balBefore: string | number;
  amount: string | number;
  balAfter: string | number;
  transactionDate: string;
  transactionTime: string;
  narration: string;
}

export interface DebitHistoryTableType {
  transactionId: string;
  transactionType: string | null;
  service: string;
  balBeforeTran: string | number;
  amount: string | number;
  balAfterTran: string | number;
  finalBalance: string | number;
  dateOfTransaction: string;
  timeOfTransaction: string;
  narration: string;
}

export interface DownlineBalanceTableType {
  userId: string;
  name: string;
  parentAccount: string;
  prepaidBalance: string | number;
  postpaidBalance: string | number;
  createdOn: string;
  narration: string;
}

import {
  AddBankFormType,
  BankVerificationRequest,
  ChangePasswordRequestProps,
  CommissionAndChargesRequest,
  CreateOrderProps,
  EditBankFormType,
  EditBeneficiaryBankRequest,
  FetchBillDetailsProps,
  FetchCardBinDetailProps,
  FetchListParams,
  FetchSubUserRequest,
  ForgotPasswordRequestProps,
  FundReversalFormType,
  FundTransferProps,
  LoginRequest,
  // NetworkTransactionParams,
  NetworkTransactionRequest,
  OtpRequestProps,
  PayoutBankDetailsParams,
  PayoutSaveBeneficiaryProps,
  PayoutSendBeneficiaryProps,
  RaisedTicketParams,
  ResendOtpRequestProps,
  SetPasswordRequestProps,
  SubuserCreationProps,
  TokenGenerationRequest,
  TransactionDetailsParams,
  TransactionProps,
  ValidateTransactionProps,
  VerifyTokenRequest,
  ViewUserAPIProps,
  WalletRequest,
  WalletToBankRequest,
  WalletToWalletProps,
} from "@/Common/interface";
import api from ".";
import { API_ROUTES } from "./apiRoutes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { savePagination } from "@/Redux/Reducers/paginationSlice";
import { toast } from "react-toastify";
import { handleCustomError } from "@/Utils/handleCustomError";

export const isAuthenticated = () => {
  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  return {
    isAuthenticated: !!authToken,
  };
};

const createHeaders = async () => {
  let token = "";

  try {
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    if (authCookie) {
      token = decodeURIComponent(authCookie.split("=")[1]);
    }
  } catch (err) {
    console.error("ERROR reading authToken cookie:", err);
  }

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

const createMultipartHeaders = async () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));
  return {
    headers: {
      Authorization: `Bearer ${
        token ? decodeURIComponent(token.split("=")[1]) : ""
      }`,
      "Content-Type": "multipart/form-data",
      // 'Access-Control-Allow-Origin': '*',
      Accept: "application/json, text/plain, */*",
    },
  };
};

export const Token_generation = async (body: TokenGenerationRequest) =>
  await api.post(`${API_ROUTES.TOKEN_GENERATION}?username=${body.userName}`);

export const Verify_Token = async (body: VerifyTokenRequest) =>
  await api.post(API_ROUTES.VERIFY_TOKEN, body);

export const login = async (data: LoginRequest) =>
  await api.post(API_ROUTES.LOGIN, data);

export const Forgot_Password = async (data: ForgotPasswordRequestProps) =>
  await api.post(API_ROUTES.FORGOT_PASSWORD, data);

export const Verify_Otp = async (data: OtpRequestProps) =>
  await api.post(API_ROUTES.VERIFY_OTP, data);

export const Verify_Forget_Otp = async (data: OtpRequestProps) =>
  await api.post(API_ROUTES.VERIFY_FORGET_OTP, data);

export const Resend_Otp = async (data: ResendOtpRequestProps) =>
  await api.post(API_ROUTES.RESEND_OTP, data);

export const Set_Password = async (data: SetPasswordRequestProps) =>
  await api.post(API_ROUTES.SET_PASSWORD, data);

export const Change_Password = async (data: ChangePasswordRequestProps) =>
  await api.post(API_ROUTES.CHANGE_PASSWORD, data, await createHeaders());

export const Prefund_Request = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.PREFUND_REQUEST}`,
    data,
    await createMultipartHeaders()
  );

export const Fund_Transfer = async (data: FundTransferProps) =>
  await api.post(`${API_ROUTES.FUND_TRANSFER}`, data, await createHeaders());

export const Fund_Reversal = async (data: FundReversalFormType) =>
  await api.post(`${API_ROUTES.FUND_REVERSAL}`, data, await createHeaders());

export const Resend_Otp_Fund_Reversal = async (id: string) =>
  await api.post(
    `${API_ROUTES.FUND_REVERSAL_RESEND_OTP}/${id}`,
    {},
    await createHeaders()
  );

export const Wallet_To_Wallet = async (data: WalletToWalletProps) =>
  await api.post(`${API_ROUTES.WALLET_TO_WALLET}`, data, await createHeaders());

export const Wallet_To_Bank = async (data: WalletToBankRequest) =>
  await api.post(`${API_ROUTES.WALLET_TO_BANK}`, data, await createHeaders());

export const Get_Hierarchy_Banks = async (id: string) => {
  const url = `${API_ROUTES.FETCH_HIERARCHY_BANKS}/${id}`;

  return await api.get(url, await createHeaders());
};

export const Wallet_Balance = async (id: string) =>
  await api.get(`${API_ROUTES.WALLET_BALANCE}/${id}`, await createHeaders());

export const User_Profile = async (id: string) =>
  await api.get(`${API_ROUTES.USER_PROFILE}/${id}`, await createHeaders());

export const Child_Member_List = async (
  id: string,
  params?: ViewUserAPIProps
) => {
  const queryParams = new URLSearchParams(params).toString();

  const url = `${API_ROUTES.CHILD_MEMBER_LIST}/${id}${queryParams ? `?${queryParams}` : ""}`;

  return await api.get(url, await createHeaders());
};

export const Single_Hierarchy_Child_List = async (
  id: string,
  params?: ViewUserAPIProps
) => {
  const queryParams = new URLSearchParams(params).toString();

  const url = `${API_ROUTES.SINGLE_HIERARCHY_CHILD_LIST}/${id}${queryParams ? `?${queryParams}` : ""}`;

  return await api.get(url, await createHeaders());
};

export const Create_White_Label = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.CREATE_WHITE_LABEL}`,
    data,
    await createMultipartHeaders()
  );

export const Create_Super_Distributor = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.CREATE_SUPER_DISTRIBUTOR}`,
    data,
    await createMultipartHeaders()
  );

export const Create_Partner = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.CREATE_PARTNER}`,
    data,
    await createMultipartHeaders()
  );

export const Create_Distributor = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.CREATE_DISTRIBUTOR}`,
    data,
    await createMultipartHeaders()
  );

export const Create_Retailer = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.CREATE_RETAILER}`,
    data,
    await createMultipartHeaders()
  );

export const Commission_And_Charges_Report = async (
  params: Record<string, string>,
  bodyRequest: CommissionAndChargesRequest
) => {
  const queryParams = new URLSearchParams(params).toString();

  return await api.post(
    `${API_ROUTES.COMMISSION_AND_CHARGES}?${queryParams}`,
    bodyRequest,
    await createHeaders()
  );
};

export const Wallet_Report = async (
  params: Record<string, string>,
  bodyRequest: WalletRequest
) => {
  const queryParams = new URLSearchParams(params).toString();

  return await api.post(
    `${API_ROUTES.WALLET_REPORT}?${queryParams}`,
    bodyRequest,
    await createHeaders()
  );
};

export const Network_Transaction_Report = async (
  params: Record<string, string>,
  bodyRequest: NetworkTransactionRequest
) => {
  const queryParams = new URLSearchParams(params).toString();

  return await api.post(
    `${API_ROUTES.NETWORK_TRANSACTION_REPORT}?${queryParams}`,
    bodyRequest,
    await createHeaders()
  );
};

export const Transaction_Details = async (data: TransactionDetailsParams) =>
  await api.post(
    `${API_ROUTES.TRANSACTION_DETAILS}`,
    data,
    await createHeaders()
  );

export const fetch_raised_tickets = async (params: RaisedTicketParams) => {
  // Convert all values to string for URLSearchParams
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value ?? "")])
    )
  ).toString();

  const url = `${API_ROUTES.FETCH_RAISED_TICKET}${queryParams ? `?${queryParams}` : ""}`;

  return await api.get(url, await createHeaders());
};

export const Raise_Ticket = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.TICKET_RAISE}`,
    data,
    await createMultipartHeaders()
  );

export const Issue_Type_Dropdown = async () =>
  await api.get(`${API_ROUTES.ISSUE_TYPE_DROPDOWN}`, await createHeaders());

export const Product_Dropdown = async () => {
  return await api.get(`${API_ROUTES.PRODUCT_LIST}`, await createHeaders());
};

export const Sub_Product_Dropdown = async (id?: string) => {
  const url = id
    ? `${API_ROUTES.SUB_PRODUCT_DROPDOWN}/${id}`
    : `${API_ROUTES.SUB_PRODUCT_DROPDOWN}`;
  return await api.get(url, await createHeaders());
};

export const Sub_Product_Settlement_Dropdown = async (id?: string) => {
  const baseUrl = id
    ? `${API_ROUTES.SUB_PRODUCT_DROPDOWN}/${id}`
    : `${API_ROUTES.SUB_PRODUCT_DROPDOWN}`;
  const url = `${baseUrl}?isSettlement=true`;
  return await api.get(url, await createHeaders());
};

export const Fetch_Hierarchy_Type_Dropdown = async () =>
  await api.get(`${API_ROUTES.HIERARCHY_TYPE_LIST}`, await createHeaders());

export const Fetch_Hierarchy_List_Dropdown = async (
  selectedHierarchyCode: string
) =>
  await api.get(
    `${API_ROUTES.HIERARCHY_LIST}/${selectedHierarchyCode}`,
    await createHeaders()
  );

export const Fetch_Card_Bin_Detail = async (data: FetchCardBinDetailProps) =>
  await api.post(`${API_ROUTES.FETCH_CARD_TYPE}`, data, await createHeaders());

export const Validate_Transaction = async (data: ValidateTransactionProps) =>
  await api.post(
    `${API_ROUTES.VALIDATE_TRANSACTION}`,
    data,
    await createHeaders()
  );

export const Create_Order = async (data: CreateOrderProps) =>
  await api.post(`${API_ROUTES.CREATE_ORDER}`, data, await createHeaders());

export const Fetch_Sub_User = async (
  id: string | number,
  params?: FetchSubUserRequest
) => {
  const safeParams = params ?? {};
  // Convert all values to string for URLSearchParams
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(safeParams).map(([key, value]) => [
        key,
        String(value ?? ""),
      ])
    )
  ).toString();

  const url = `${API_ROUTES.FETCH_SUB_USER}/${id}${queryParams ? `?${queryParams}` : ""}`;

  return await api.get(url, await createHeaders());
};

export const Create_Sub_User = async (data: SubuserCreationProps) =>
  await api.post(`${API_ROUTES.CREATE_SUB_USER}`, data, await createHeaders());

export const Payout_Save_Beneficiary = async (
  data: PayoutSaveBeneficiaryProps
) =>
  await api.post(`${API_ROUTES.SAVE_BENEFICIARY}`, data, await createHeaders());

export const Edit_Beneficiary_Bank_Details = async (
  data: EditBeneficiaryBankRequest
) =>
  await api.put(
    `${API_ROUTES.EDIT_BENEFICIARY_BANK_DETAILS}/${data.id}`,
    data,
    await createHeaders()
  );

export const Payout_Send = async (data: PayoutSendBeneficiaryProps) =>
  await api.post(`${API_ROUTES.SEND_PAYOUT}`, data, await createHeaders());

export const Payout_Success_Callback = async (data: any) =>
  await api.post(
    `${API_ROUTES.PAYOUT_SUCCESS_CALLBACK}`,
    data,
    await createHeaders()
  );

export const Payout_Get_Bank_Details = async (ifscCode: string) =>
  await api.get(
    `${API_ROUTES.GET_BANK_DETAILS}/${ifscCode}`,
    await createHeaders()
  );

// export const Payout_GetAll_Payout_BankDetails = async () =>
// await api.get(`${API_ROUTES.GET_PAYOUT_ALL_DETAILS}`, await createHeaders());

export const Payout_GetAll_Payout_BankDetails = async (
  params: PayoutBankDetailsParams
) => {
  //////////////
  // Convert all values to string for URLSearchParams
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value ?? "")])
    )
  ).toString();

  const url = `${API_ROUTES.GET_PAYOUT_ALL_DETAILS}${queryParams ? `?${queryParams}` : ""}`;

  return await api.get(url, await createHeaders());
  //////////////

  // always include page & size
  // const params = { page, size, ...(filters || {}) };

  // build query string
  // const queryParams = new URLSearchParams(
  //   Object.entries(params).reduce(
  //     (acc, [key, value]) => {
  //       acc[key] = String(value);
  //       return acc;
  //     },
  //     {} as Record<string, string>
  //   )
  // ).toString();

  // return await api.get(
  //   `${API_ROUTES.GET_PAYOUT_ALL_DETAILS}?${queryParams}`,
  //   await createHeaders()
  // );
};

export const Payout_Delete_Payout_BankDetails = async (ids: number[]) => {
  const headers = await createHeaders();
  return await api.delete(API_ROUTES.DELETE_PAYOUT_BENEFICIARY, {
    ...headers,
    data: ids,
  });
};

/////////////////////// ---- BBPS ---- //////////////////////////
export const Get_Provider_List = async (data: { subProductId: string }) =>
  await api.post(
    API_ROUTES.GET_PROVIDER_LIST,
    { subProductId: data.subProductId },
    await createHeaders()
  );

export const Get_Services_List = async (data: { subProductId: string }) =>
  await api.post(
    API_ROUTES.GET_SERVICES_LIST,
    { subProductId: data.subProductId },
    await createHeaders()
  );

export const Get_Providers = async (data: {
  subProductId: string;
  serviceName: string;
}) => await api.post(API_ROUTES.GET_PROVIDERS, data, await createHeaders());

export const Get_Provider_Config = async (data: {
  subProductId: string;
  providerId: string;
}) =>
  await api.post(API_ROUTES.GET_PROVIDER_CONFIG, data, await createHeaders());

export const Fetch_Bill_Details = async (body: FetchBillDetailsProps) =>
  await api.post(API_ROUTES.FETCH_BILL_DETAILS, body, await createHeaders());

export const Transaction = async (body: TransactionProps) =>
  await api.post(API_ROUTES.TRANSACTION, body, await createHeaders());

export const Fetch_Transaction_Receipt = async (transactionId: string) => {
  return await api.post(
    `${API_ROUTES.FETCH_TRANSACTION_RECEIPT}/${transactionId}`,
    {},
    await createHeaders()
  );
};

export const Find_Remitter = async (data: any) => {
  return await api.post(
    `${API_ROUTES.FIND_REMITTER}`,
    data,
    await createHeaders()
  );
};

export const Register_Remitter = async (data: any) => {
  return await api.post(
    `${API_ROUTES.REGISTER_REMITTER}`,
    data,
    await createHeaders()
  );
};

export const Update_Remitter = async (data: any) => {
  return await api.put(
    `${API_ROUTES.UPDATE_REMITTER}`,
    data,
    await createHeaders()
  );
};

export const Remitter_Kyc = async (data: any) => {
  return await api.post(
    `${API_ROUTES.REMITTER_KYC}`,
    data,
    await createHeaders()
  );
};

export const Remitter_details = async (mobile: string) => {
  return await api.get(
    `${API_ROUTES.FETCH_REMITTER_DETAILS}/${mobile}`,
    await createHeaders()
  );
};

export const Register_Beneficiary = async (data: any) => {
  return await api.post(
    `${API_ROUTES.REGISTER_BENEFICIARY}`,
    data,
    await createHeaders()
  );
};

export const Fetch_Beneficiaries = async (data: Record<string, any>) => {
  // Extract page and size for query params
  const { page, size, ...bodyData } = data;

  // Construct query params only for page & size
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ page, size }).map(([key, value]) => [
        key,
        String(value ?? ""),
      ])
    )
  ).toString();

  // Build final URL
  const url = `${API_ROUTES.FETCH_BENEFICIARY}${queryParams ? `?${queryParams}` : ""}`;

  // Make the API call — page & size in query, rest in body
  return await api.post(url, bodyData, await createHeaders());
};

export const edit_beneficiary = async (data: any) => {
  return await api.put(
    `${API_ROUTES.EDIT_BENEFICIARY}`,
    data,
    await createHeaders()
  );
};

export const delete_beneficiary = async (data: any) => {
  return await api.post(
    `${API_ROUTES.DELETE_BENEFICIARY}`,
    data,
    await createHeaders()
  );
};

export const Dmt_Tranx_Send_Otp = async (data: any) => {
  return await api.post(
    `${API_ROUTES.DMT_TRANX_SEND_OTP}`,
    data,
    await createHeaders()
  );
};

export const Dmt_Transaction = async (data: any) => {
  return await api.post(
    `${API_ROUTES.DMT_TRANSACTION}`,
    data,
    await createHeaders()
  );
};

////////////////////////////---- AEPS-----//////////////////////////////////
export const Check_Aeps_Onboard_Status = async (data: any) => {
  try {
    const response = await api.post(
      API_ROUTES.AEPS_CHECK_STATUS,
      data,
      await createHeaders()
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const AepsMerchantOnboardAPI = async (data: any) => {
  return await api.post(
    `${API_ROUTES.AEPS_MERCHANT_ONBOARD}`,
    data,
    await createHeaders()
  );
};

export const Aeps_Send_Otp = async (data: any) => {
  return await api.post(
    `${API_ROUTES.AEPS_SEND_OTP}`,
    data,
    await createHeaders()
  );
};

export const Aeps_Resend_Otp = async (data: any) => {
  return await api.post(
    `${API_ROUTES.AEPS_RESEND_OTP}`,
    data,
    await createHeaders()
  );
};

export const Aeps_Verify_Otp = async (data: any) => {
  return await api.post(
    `${API_ROUTES.AEPS_VALIDATE_EKYC}`,
    data,
    await createHeaders()
  );
};

export const Aeps_Bank_List = async () => {
  return await api.get(`${API_ROUTES.AEPS_BANK_LIST}`, await createHeaders());
};

export const Aeps_TwoFactor_Verify = async (data: any) => {
  return await api.post(
    `${API_ROUTES.AEPS_TWO_FA}`,
    data,
    await createHeaders()
  );
};

export const Adhaar_Verification = async (aadhaarNumber: number) =>
  await api.post(
    `${API_ROUTES.ADHAAR_VERIFICATION}?aadhaarNumber=${aadhaarNumber}`,
    {},
    await createHeaders()
  );

export const Pan_Verification = async (panNumber: string) =>
  await api.post(
    `${API_ROUTES.PAN_VERIFICATION}?panNumber=${panNumber}`,
    {},
    await createHeaders()
  );

export const Email_Verification = async (emailId: string) =>
  await api.post(
    `${API_ROUTES.EMAIL_VERIFICATION}`,
    { email: emailId },
    await createHeaders()
  );

export const Adhaar_Pan_Link = async (aadhaarNumber: number) =>
  await api.post(
    `${API_ROUTES.ADHAAR_PAN_LINK}?aadhaarNumber=${aadhaarNumber}`,
    {},
    await createHeaders()
  );

export const Voter_Id_Verification = async (voterid: string) =>
  await api.post(
    `${API_ROUTES.VOTER_ID_VERIFICATION}?voterid=${voterid}`,
    {},
    await createHeaders()
  );

export const Bank_Verification = async ({
  id_number,
  ifsc,
  ifsc_details,
}: BankVerificationRequest) =>
  await api.post(
    `${API_ROUTES.BANK_VERIFICATION}`,
    { id_number, ifsc, ifsc_details },
    await createHeaders()
  );

export const Add_Bank = async (data: AddBankFormType) =>
  await api.post(`${API_ROUTES.ADD_BANK}`, data, await createHeaders());

export const Edit_Bank = async (data: EditBankFormType) =>
  await api.put(
    `${API_ROUTES.EDIT_BANK}/${data.id}`,
    data,
    await createHeaders()
  );

export const Delete_Bank = async (id: string) =>
  await api.delete(`${API_ROUTES.DELETE_BANK}/${id}`, await createHeaders());

export const fetchList = createAsyncThunk(
  "api/fetchList",
  async (
    {
      key,
      url,
      page = 1,
      size = 10,
      filter = null,
      method = "GET",
      payload = null,
      skipPagination = false,
      returnFullData = false,
      sendPaginationIn = "params",
    }: FetchListParams,
    { dispatch }
  ) => {
    try {
      const params = new URLSearchParams();

      // Append page & size only if skipPagination is false
      if (!skipPagination && sendPaginationIn === "params") {
        params.append("page", String(page - 1)); // 0 - based
        params.append("size", String(size));
      }

      // Append all filters as query params
      if (filter && typeof filter === "object") {
        Object.entries(filter).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            params.append(k, String(v));
          }
        });
      }

      // Smart joiner: add `?` or `&` depending on presence of `?` in URL
      const connector = url.includes("?") ? "&" : "?";
      const finalUrl = `${url}${connector}${params.toString()}`;

      // ✅ If pagination needs to be sent in body
      let finalPayload = payload || {};

      if (!skipPagination && sendPaginationIn === "body") {
        finalPayload = {
          ...finalPayload,
          page: page - 1,
          size,
        };
      }

      let response;
      if (method === "POST") {
        if (Object.keys(finalPayload).length > 0) {
          response = await api.post(
            finalUrl,
            finalPayload,
            await createHeaders()
          );
        } else {
          response = await api.post(finalUrl, {}, await createHeaders());
        }
      } else {
        response = await api.get(finalUrl, await createHeaders());
      }

      const responseData = response?.data;

      if ([200, 201].includes(responseData.statusCode)) {
        if (returnFullData) {
          // Return the full data object
          return responseData.data;
        }

        const {
          content = [],
          totalPages = 0,
          totalElements = 0,
          size,
          pageSize,
          pageNumber,
          number,
        } = responseData.data || {};

        // Set data and meta in store
        if (!skipPagination) {
          dispatch(
            savePagination({
              key,
              pagination: {
                totalPages: totalPages || 0,
                totalElements: totalElements || 0,
                pageSize: size ?? pageSize ?? 10,
                currentPage: (number ?? pageNumber ?? 0) + 1,
              },
            })
          );
        }

        // Show toast if content is empty
        if (!content || content.length === 0) {
          toast.warning("No records found", {
            autoClose: 1000,
            className: "!text-sm",
            position: "bottom-right",
          });
        }

        return content;
      } else {
        throw new Error(responseData?.message || "Fetch failed");
      }
    } catch (error: any) {
      // const errMsg =
      //   error?.response?.data?.message || error.message || "Failed to fetch";
      // return rejectWithValue(errMsg);
      handleCustomError(error);
    }
  }
);

export const getCommonFastagBalanceKeys = (normalized: Record<string, any>) =>
    normalized["fastag balance"] ||
    normalized["fasttag balance"] ||
    normalized["fastagbalance"] ||
    normalized["wallet balance"] ||
    normalized["walletbalance"] ||
    normalized["fastag"];

export const getCommonFastagStatusKeys = (normalized: Record<string, any>) =>
    normalized["status"] ||
    normalized["tag status"] ||
    normalized["vehicle tag status"];

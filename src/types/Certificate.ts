export type Certificate = {
  title: string;
  issuer: string;
  recipient: string;
  timestamp: number;
  transactionHash: string;
  certificateHash: string;
  fileUrl: string;
  qrLink: string;
  tokenId: string;
};

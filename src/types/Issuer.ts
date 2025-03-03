export type IssuerApplication = {
  organizationName: string;
  website?: string;
  location: string;
  phoneNumber: string;
};

export type IssuerApplicationWithStatus = IssuerApplication & {
  status: "pending" | "approved" | "rejected";
  govtDocument: string;
  uid: string;
  aid: string;
};

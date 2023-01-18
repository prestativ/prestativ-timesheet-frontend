export interface Hours {
  _id: string;
  initial: number;
  final: number;
  adjustment: number;
  relClient: string;
  relProject: string;
  relActivity: string;
  relUser: string;
  closedScope: boolean;
  billable: boolean;
  released: boolean;
  approved: boolean;
  callNumber: string;
  createdAt: number;
  updatedAt: number;
}
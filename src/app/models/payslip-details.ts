import {PaymentsDetails} from './payments-details';

export interface PayslipDetails {
  id: number,
  total:number,
  paymentDate:string,
  payments: PaymentsDetails[]
}

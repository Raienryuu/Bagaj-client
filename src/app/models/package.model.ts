export class PackageModel {
  Id: number | undefined;
  SenderId: number | undefined;
  TransporterId: number | undefined;

  StartVoivodeship: string | undefined;
  StartPostCode: string | undefined;
  StartCity: string | undefined;
  StartStreetAddress: string | undefined;

  EndVoivodeship: string | undefined;
  EndPostCode: string | undefined;
  EndCity: string | undefined;
  EndStreetAddress: string | undefined;

  Weight: number | undefined;
  Dimensions: string | undefined;
  SenderHelp: boolean | undefined;
  Comment: string | undefined;
  LowestBidId: number | undefined;
  LowestBid: number | undefined;
  OfferState: number | undefined;
  CreationDate: Date | undefined;
  ApproximateDistance: number | undefined;
}

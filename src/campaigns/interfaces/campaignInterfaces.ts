export interface ICampaign {
  profit: string
  description: string
}

export enum CampaignStatus {
  ACTIVE = "Active",
  PAUSED = "Paused"
  // CANCELLED will remains in choosing between re-create match &/| posts, or just delete all
  // recreate: match & posts | posts | 1 post | null
}

export enum Recreate {
  MATCH = "match",
  POSTS = "posts",
  BUYER_POST = "buyer-post",
  SELLER_POST = "seller-post"
}
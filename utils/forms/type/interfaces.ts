export interface AntiSpamFields {
  turnstileToken?: string;
  website?: string;
}

export interface BecomeParthnerRequestDTO extends AntiSpamFields {
  email: string;
  description: string;
}

export interface ContactRequestDTO extends AntiSpamFields {
  name: string;
  email: string;
  phone?: string;
  description: string;
}

export interface SubscribeRequestDTO extends AntiSpamFields {
  email: string;
}

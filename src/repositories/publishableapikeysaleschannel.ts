import { PublishableApiKeySalesChannel } from "@medusajs/medusa"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
    PublishableApiKeySalesChannelRepository as MedusaPublishableApiKeySalesChannelRepository,
} from "@medusajs/medusa/dist/repositories/publishable-api-key-sales-channel"

export const PublishableApiKeySalesChannelRepository = dataSource
  .getRepository(PublishableApiKeySalesChannel)
  .extend({
    ...Object.assign(
        MedusaPublishableApiKeySalesChannelRepository, 
      { target: PublishableApiKeySalesChannel }
    ),
  })

export default PublishableApiKeySalesChannelRepository
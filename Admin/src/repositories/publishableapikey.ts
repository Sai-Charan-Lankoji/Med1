import { PublishableApiKey } from "@medusajs/medusa"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import {
    PublishableApiKeyRepository as MedusaPublishableApiKeyRepository,
} from "@medusajs/medusa/dist/repositories/publishable-api-key"

export const PublishableApiKeyRepository = dataSource
  .getRepository(PublishableApiKey)
  .extend({
    ...Object.assign(
        MedusaPublishableApiKeyRepository, 
      { target: PublishableApiKey }
    ),
  })

export default PublishableApiKeyRepository
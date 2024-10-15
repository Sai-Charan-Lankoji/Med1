'use client'
import withAuth from "@/lib/withAuth"
import { Heading, Container } from "@medusajs/ui"
const BusinessType = () =>{
    
    const businessType = sessionStorage.getItem("business_type")
     return(
        <Container>
            <Heading>{businessType}</Heading>
        </Container>
    )
}
export default withAuth(BusinessType)
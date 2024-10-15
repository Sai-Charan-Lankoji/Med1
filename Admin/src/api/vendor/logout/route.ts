import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> => {
    res.setHeader(
        'Set-Cookie',
        `vendor_id=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Mon, 26 Aug 2024 00:00:00 GMT`
    );
    res.status(200).json({ message: 'Vendor logged out successfully' });
}

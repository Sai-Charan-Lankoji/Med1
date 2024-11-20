import React from 'react';
import Image from 'next/image';
import { Printer } from 'lucide-react';

const PrintOrder = ({ order, selectedDesigns, currentImageIndex }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <html>
        <head>
          <title>Order ${order.id} - Print View</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
            .print-container { max-width: 800px; margin: 0 auto; }
            .header { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .order-info { margin-bottom: 30px; }
            .item { margin-bottom: 40px; page-break-inside: avoid; }
            .item-header { margin-bottom: 15px; }
            .designs-grid { 
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
            }
            .design-container { 
              position: relative;
              height: 280px;
              border: 1px solid #e5e7eb;
              border-radius: 16px;
              overflow: hidden;
            }
            .apparel-image {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .design-overlay-wrapper {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .design-image {
              position: relative;
              transform: translateY(-10%);
            }
            .design-image.leftshoulder {
              top: 12px;
              left: -3px;
              width: 30%;
              height: 30%;
            }
            .design-image.rightshoulder {
              top: 12px;
              left: 2px;
              width: 30%;
              height: 30%;
            }
            .design-image.front, .design-image.back {
              width: 50%;
              height: 50%;
            }
            .design-side-label {
              position: absolute;
              bottom: 8px;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .details { margin-top: 15px; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
              .item { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>Order Details - #${order.id}</h1>
            </div>
            <div class="order-info">
              <p><strong>Customer:</strong> ${order.email}</p>
              <p><strong>Order Status:</strong> ${order.status}</p>
              <p><strong>Total Amount:</strong> $${order.total_amount}</p>
            </div>
            ${order.line_items.map((item, index) => `
              <div class="item">
                <div class="item-header">
                  <h2>Item ${index + 1}</h2>
                </div>
                <div class="designs-grid">
                  ${item.designs.map(design => `
                    <div class="design-container">
                      <img 
                        class="apparel-image"
                        src="${design.apparel.url}"
                        alt="Product view - ${design.apparel.side}"
                        style="background-color: ${design.apparel?.color || '#ffffff'}"
                      />
                      <div class="design-overlay-wrapper">
                        ${design.pngImage ? `
                          <img 
                            class="design-image ${design.apparel.side}"
                            src="${design.pngImage}"
                            alt="Design overlay"
                            style="object-fit: contain;"
                          />
                        ` : ''}
                      </div>
                      <div class="design-side-label">
                        ${design.apparel.side}
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div class="details">
                  <p><strong>Quantity:</strong> ${item.quantity}</p>
                  <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print Order
    </button>
  );
};

export default PrintOrder;